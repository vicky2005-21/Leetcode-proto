from typing import Dict, List, Optional
from database.db_handler import db
from datetime import datetime
import json
import os

class ScoringService:
    def __init__(self):
        self.current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.problems_file = os.path.join(self.current_dir, 'data', 'problems.json')
        self.answers_file = os.path.join(self.current_dir, 'data', 'user_answers.json')
        self.users_file = os.path.join(self.current_dir, 'data', 'users.json')

    def _ensure_users_file(self) -> Dict:
        """Ensure the users file exists with proper structure."""
        try:
            with open(self.users_file, 'r') as f:
                users_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            users_data = {'users': []}

        if not isinstance(users_data, dict):
            users_data = {'users': []}
        if 'users' not in users_data or not isinstance(users_data['users'], list):
            users_data['users'] = []
        return users_data

    def _load_answers_data(self) -> Dict:
        """Load answers data with proper structure."""
        try:
            with open(self.answers_file, 'r') as f:
                answers_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            answers_data = {'answers': {}}

        if not isinstance(answers_data, dict):
            answers_data = {'answers': {}}
        if 'answers' not in answers_data:
            answers_data['answers'] = {}
        return answers_data

    def get_problem_stats(self, problem_id: int) -> Dict:
        """Get comprehensive statistics for a specific problem including reviews."""
        try:
            answers_data = self._load_answers_data()
            total_attempts = 0
            correct_attempts = 0
            all_reviews = []
            answer_distribution = {}
            latest_submissions = []
            
            # Convert problem_id to string since it's stored as string in JSON
            problem_id_str = str(problem_id)
            
            # Iterate through all users' answers
            for user_id, user_answers in answers_data.get('answers', {}).items():
                # Check if this problem exists in user's answers
                if problem_id_str in user_answers:
                    answer_data = user_answers[problem_id_str]
                    total_attempts += 1
                    
                    # Track correct attempts
                    if answer_data.get('is_correct', False):
                        correct_attempts += 1
                    
                    # Track answer distribution
                    user_answer = answer_data.get('answer', '')
                    answer_distribution[user_answer] = answer_distribution.get(user_answer, 0) + 1
                    
                    # Collect reviews if they exist
                    review = answer_data.get('review', '')
                    if review:
                        review_entry = {
                            'user_id': user_id,
                            'review': review,
                            'timestamp': answer_data.get('timestamp', ''),
                            'is_correct': answer_data.get('is_correct', False)
                        }
                        all_reviews.append(review_entry)
                    
                    # Collect submission for latest attempts
                    submission = {
                        'user_id': user_id,
                        'answer': user_answer,
                        'is_correct': answer_data.get('is_correct', False),
                        'timestamp': answer_data.get('timestamp', '')
                    }
                    latest_submissions.append(submission)
            
            # Calculate accuracy
            accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0
            
            # Sort reviews by timestamp (most recent first)
            all_reviews.sort(key=lambda x: x['timestamp'], reverse=True)
            
            # Sort and limit latest submissions
            latest_submissions.sort(key=lambda x: x['timestamp'], reverse=True)
            latest_submissions = latest_submissions[:10]  # Keep only the 10 most recent submissions
            
            return {
                'total_attempts': total_attempts,
                'correct_attempts': correct_attempts,
                'accuracy': round(accuracy, 2),
                'answer_distribution': answer_distribution,
                'latest_submissions': latest_submissions,
                'reviews': all_reviews,
                'unique_users': len(set(user_id for user_id, user_answers in answers_data.get('answers', {}).items() 
                                     if problem_id_str in user_answers))
            }
        except Exception as e:
            print(f"Error getting problem stats: {e}")
            return {
                'total_attempts': 0,
                'correct_attempts': 0,
                'accuracy': 0,
                'answer_distribution': {},
                'latest_submissions': [],
                'reviews': [],
                'unique_users': 0
            }

    def check_answer(self, submitted_answer: str, correct_answer: str) -> bool:
        """
        Check if the submitted answer matches the correct answer.
        
        Args:
            submitted_answer (str): The answer submitted by the user
            correct_answer (str): The correct answer for the problem
            
        Returns:
            bool: True if the answer is correct, False otherwise
        """
        try:
            # Convert both answers to strings and compare them case-insensitively
            submitted = str(submitted_answer).strip().lower()
            correct = str(correct_answer).strip().lower()
            return submitted == correct
        except Exception as e:
            print(f"Error checking answer: {e}")
            return False

    def get_problem_submissions(self, problem_id: int) -> List[Dict]:
        """Get all submissions for a problem."""
        try:
            answers_data = self._load_answers_data()
            submissions = []
            
            # Convert problem_id to string since it's stored as string in JSON
            problem_id_str = str(problem_id)
            
            # Iterate through all users and their answers
            for user_id, user_answers in answers_data.get('answers', {}).items():
                # Check if this problem exists in user's answers
                if problem_id_str in user_answers:
                    answer_data = user_answers[problem_id_str]
                    submission = {
                        'user_id': str(user_id),
                        'answer': str(answer_data.get('answer', '')),
                        'is_correct': bool(answer_data.get('is_correct', False)),
                        'timestamp': str(answer_data.get('timestamp', '')),
                        'review': str(answer_data.get('review', ''))
                    }
                    submissions.append(submission)
            
            # Sort submissions by timestamp, most recent first
            submissions.sort(key=lambda x: x['timestamp'], reverse=True)
            return submissions
            
        except Exception as e:
            print(f"Error getting problem submissions: {e}")
            return []

    def submit_answer(self, user_id: str, problem_id: int, answer: str) -> Dict:
        try:
            print(f"Processing submission: user_id={user_id}, problem_id={problem_id}, answer={answer}")
            
            # Ensure types are correct
            user_id = str(user_id)
            problem_id = int(problem_id)
            answer = str(answer)
            
            # Load problems to check answer
            try:
                with open(self.problems_file, 'r') as f:
                    problems_data = json.load(f)
            except Exception as e:
                print(f"Error loading problems file: {e}")
                raise ValueError("Could not load problems data")

            if not isinstance(problems_data, dict) or 'problems' not in problems_data:
                raise ValueError("Invalid problems data format")
            
            # Find the problem by ID
            problem = None
            for p in problems_data['problems']:
                if isinstance(p, dict) and int(p.get('id', 0)) == problem_id:
                    problem = p
                    break
            
            if not problem:
                raise ValueError(f"Problem {problem_id} not found")

            # Check if answer is correct
            correct_answer = str(problem.get('correct_answer', ''))
            print(f"Comparing answer '{answer}' with correct_answer '{correct_answer}'")
            is_correct = self.check_answer(answer, correct_answer)

            # Load and update answers
            answers_data = self._load_answers_data()
            if user_id not in answers_data['answers']:
                answers_data['answers'][user_id] = {}

            # Create new answer entry
            new_answer = {
                'answer': answer,
                'timestamp': datetime.now().isoformat(),
                'is_correct': is_correct
            }

            # Save the answer using string problem_id
            answers_data['answers'][user_id][str(problem_id)] = new_answer
            
            with open(self.answers_file, 'w') as f:
                json.dump(answers_data, f, indent=2)

            # Calculate updated stats
            user_answers = answers_data['answers'].get(user_id, {})
            if not isinstance(user_answers, dict):
                user_answers = {}
                
            total_answers = len(user_answers)
            correct_answers = sum(1 for ans in user_answers.values() if isinstance(ans, dict) and ans.get('is_correct'))
            accuracy = (correct_answers / total_answers * 100) if total_answers > 0 else 0

            # Load and update user data
            users_data = self._ensure_users_file()
            
            # Find or create user
            user = None
            for u in users_data['users']:
                if isinstance(u, dict) and str(u.get('id', '')) == str(user_id):
                    user = u
                    break

            if not user:
                user = {
                    'id': str(user_id),
                    'name': f'User {user_id}',
                    'study_streak': 1,
                    'time_spent': '0h',
                    'total_points': 0
                }
                users_data['users'].append(user)

            # Update user stats
            points_per_correct = 10
            user['total_points'] = correct_answers * points_per_correct
            
            with open(self.users_file, 'w') as f:
                json.dump(users_data, f, indent=2)

            print(f"Returning result: is_correct={is_correct}, total_answers={total_answers}")
            return {
                'is_correct': is_correct,
                'answer': answer,
                'stats': {
                    'problemsSolved': total_answers,
                    'accuracyRate': round(accuracy, 2),
                    'studyStreak': int(user.get('study_streak', 1)),
                    'timeSpent': str(user.get('time_spent', '0h')),
                    'correctSolved': correct_answers,
                    'totalPoints': int(user.get('total_points', 0)),
                    'lastUpdated': datetime.now().isoformat()
                }
            }

        except Exception as e:
            print(f"Error in submit_answer: {str(e)}")
            raise ValueError(str(e))

    def submit_review(self, user_id: str, problem_id: int, review: str) -> Dict:
        try:
            # Ensure types are correct
            user_id = str(user_id)
            problem_id = int(problem_id)
            review = str(review)

            # Load answers data
            answers_data = self._load_answers_data()
            
            # Initialize user's answers if not exists
            if user_id not in answers_data['answers']:
                answers_data['answers'][user_id] = {}
            
            problem_id_str = str(problem_id)
            
            # Initialize problem entry if it doesn't exist
            if problem_id_str not in answers_data['answers'][user_id]:
                answers_data['answers'][user_id][problem_id_str] = {
                    'review': review,
                    'review_timestamp': datetime.now().isoformat()
                }
            else:
                # Update existing entry with review
                answers_data['answers'][user_id][problem_id_str]['review'] = review
                answers_data['answers'][user_id][problem_id_str]['review_timestamp'] = datetime.now().isoformat()

            # Save back to file
            with open(self.answers_file, 'w') as f:
                json.dump(answers_data, f, indent=2)

            return {
                'success': True,
                'message': 'Review submitted successfully',
                'review': {
                    'user_id': user_id,
                    'problem_id': problem_id,
                    'review': review,
                    'timestamp': datetime.now().isoformat()
                }
            }
        except Exception as e:
            print(f"Error in submit_review: {e}")
            raise e

    def submit_review_new(self, user_id: str, problem_id: int, review: str) -> Dict:
        try:
            # Load existing answers
            with open(self.answers_file, 'r') as f:
                answers_data = json.load(f)

            # Get user's answer
            user_answers = answers_data.get('answers', {}).get(user_id, {})
            answer = user_answers.get(str(problem_id))

            if not answer:
                raise ValueError("Cannot submit review without submitting answer first")

            # Add review to the answer
            answer['review'] = review
            answer['review_timestamp'] = datetime.now().isoformat()

            # Save back to file
            with open(self.answers_file, 'w') as f:
                json.dump(answers_data, f, indent=2)

            return {
                'success': True,
                'message': 'Review submitted successfully'
            }

        except Exception as e:
            print(f"Error submitting review at {self.submit_review_new.__name__}: {e}")
            raise
