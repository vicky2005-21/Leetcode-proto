from database.db_handler import db
from typing import Dict, Optional, List
from datetime import datetime
import json
import os

class UserService:
    def __init__(self):
        self.current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.users_file = os.path.join(self.current_dir, 'data', 'users.json')
        self.answers_file = os.path.join(self.current_dir, 'data', 'user_answers.json')

    @staticmethod
    def get_user(user_id: str) -> Optional[Dict]:
        try:
            # Get user data
            user = db.get_user_by_id(user_id)
            if not user:
                return None
            
            # Return user data with stats
            return {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'avatar': user['avatar'],
                'joinedDate': user['joinedDate'],
                'stats': user['stats']
            }
        except Exception as e:
            print(f"Error in get_user: {e}")
            return None

    @staticmethod
    def update_user(user_id: str, user_data: Dict) -> Optional[Dict]:
        return db.update_user(user_id, user_data)

    def get_user_stats(self, user_id: str) -> Optional[Dict]:
        try:
            # Get all user answers
            with open(self.answers_file, 'r') as f:
                answers_data = json.load(f)
            user_answers = answers_data.get('answers', {}).get(user_id, {})
            
            # Calculate stats
            total_problems = len(user_answers)
            correct_problems = sum(1 for answer in user_answers.values() if answer.get('is_correct', False))
            accuracy = (correct_problems / total_problems * 100) if total_problems > 0 else 0
            
            # Get user data
            with open(self.users_file, 'r') as f:
                users_data = json.load(f)
            user_data = next((user for user in users_data.get('users', []) if user.get('id') == user_id), None)
            
            if not user_data:
                return None
            
            return {
                'problemsSolved': total_problems,
                'accuracyRate': round(accuracy, 2),
                'studyStreak': user_data.get('study_streak', 0),
                'timeSpent': user_data.get('time_spent', '0h'),
                'correctSolved': correct_problems,
                'totalPoints': user_data.get('total_points', 0),
                'lastUpdated': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error getting user stats: {e}")
            return None

    def get_user_answer(self, user_id: str, problem_id: int) -> Optional[Dict]:
        try:
            with open(self.answers_file, 'r') as f:
                answers_data = json.load(f)
            
            user_answers = answers_data.get('answers', {}).get(user_id, {})
            answer = user_answers.get(str(problem_id))
            
            if answer:
                return {
                    'answer': answer.get('answer', ''),
                    'is_correct': answer.get('is_correct', False),
                    'timestamp': answer.get('timestamp', '')
                }
            return None
        except Exception as e:
            print(f"Error getting user answer: {e}")
            return None

    def get_user_answers(self, user_id: str) -> Dict:
        try:
            with open(self.answers_file, 'r') as f:
                answers_data = json.load(f)
            
            user_answers = answers_data.get('answers', {}).get(user_id, {})
            formatted_answers = {}
            
            for problem_id, answer in user_answers.items():
                formatted_answers[problem_id] = {
                    'answer': answer.get('answer', ''),
                    'is_correct': answer.get('is_correct', False),
                    'timestamp': answer.get('timestamp', '')
                }
            
            return formatted_answers
        except Exception as e:
            print(f"Error getting user answers: {e}")
            return {}

    @staticmethod
    def get_specific_answer(user_id: str, problem_id: int) -> Optional[Dict]:
        answers = UserService.get_user_answers(user_id)
        return answers.get(str(problem_id))

    @staticmethod
    def submit_answer(user_id: str, problem_id: int, answer: str) -> Dict:
        # Get the problem to check the answer
        problem = db.get_problem_by_id(problem_id)
        if not problem:
            raise ValueError("Problem not found")

        # Check if the answer is correct
        is_correct = answer == problem.get('correct_answer')
        
        # Save the answer
        answer_data = {
            'answer': answer,
            'is_correct': is_correct,
            'timestamp': datetime.now().isoformat()
        }
        db.save_answer(user_id, problem_id, answer_data)

        # Get current stats
        current_stats = UserService.get_user_stats(user_id)
        stats = current_stats.get('stats', {
            'problemsSolved': 0,
            'accuracyRate': 0,
            'studyStreak': 0,
            'timeSpent': '0',
            'correctSolved': 0,
            'totalPoints': 0,
            'lastUpdated': datetime.now().isoformat()
        })

        # Get all user answers
        all_answers = UserService.get_user_answers(user_id)
        unique_solved = set()
        total_correct = 0
        total_attempts = len(all_answers)

        # Calculate stats from all answers
        for prob_id, ans in all_answers.items():
            if ans.get('is_correct'):
                unique_solved.add(prob_id)
                total_correct += 1

        # Update stats
        stats['problemsSolved'] = len(unique_solved)
        stats['correctSolved'] = total_correct
        
        if total_attempts > 0:
            stats['accuracyRate'] = round((total_correct / total_attempts) * 100, 2)

        # Update streak and points
        if is_correct:
            if str(problem_id) not in unique_solved:
                stats['totalPoints'] += 10  # Points only for first correct answer
            stats['studyStreak'] += 1
        else:
            stats['studyStreak'] = 0

        # Update timestamp
        stats['lastUpdated'] = datetime.now().isoformat()

        # Save updated stats
        updated_stats = db.update_user_stats(user_id, stats)

        return {
            'is_correct': is_correct,
            'answer': answer,
            'stats': updated_stats.get('stats', stats),
            'achievements': updated_stats.get('achievements', [])
        }

    @staticmethod
    def get_user_stats(user_id: str) -> Dict:
        stats = db.get_user_stats(user_id)
        if not stats:
            stats = {
                'stats': {
                    'problemsSolved': 0,
                    'accuracyRate': 0,
                    'studyStreak': 0,
                    'timeSpent': '0',
                    'correctSolved': 0,
                    'totalPoints': 0,
                    'lastUpdated': datetime.now().isoformat()
                },
                'achievements': []
            }
            db.update_user_stats(user_id, stats['stats'])
        return stats

    @staticmethod
    def submit_review(user_id: str, problem_id: int, review: str) -> Dict:
        # Get the user's answer to check if it was correct
        answer = db.get_specific_answer(user_id, problem_id)
        
        review_data = {
            'username': user_id,
            'review': review,
            'timestamp': datetime.now().isoformat(),
            'is_correct': answer.get('is_correct', False) if answer else False,
            'answer': answer.get('answer') if answer else None
        }
        
        # Get existing reviews and add new one
        reviews = db.get_reviews(problem_id)
        if not isinstance(reviews, list):
            reviews = []
        reviews.append(review_data)
        db.save_reviews(problem_id, reviews)
        
        return review_data

    @staticmethod
    def get_problem_submissions(problem_id: int) -> List[Dict]:
        # Get all answers for this problem
        answers = db.get_user_answers()
        submissions = []
        
        for user_id, user_answers in answers.items():
            if str(problem_id) in user_answers:
                answer = user_answers[str(problem_id)]
                submission = {
                    'username': user_id,
                    'answer': answer.get('answer'),
                    'is_correct': answer.get('is_correct'),
                    'timestamp': answer.get('timestamp')
                }
                submissions.append(submission)
        
        # Get all reviews for this problem
        reviews = db.get_reviews(problem_id)
        if isinstance(reviews, list):
            submissions.extend(reviews)
        
        # Sort by timestamp, most recent first
        submissions.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        return submissions
