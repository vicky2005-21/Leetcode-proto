import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any

class DatabaseHandler:
    def __init__(self):
        self.base_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        self.problems_file = os.path.join(self.base_path, 'problems.json')
        self.users_file = os.path.join(self.base_path, 'users.json')
        self.answers_file = os.path.join(self.base_path, 'user_answers.json')
        self.stats_file = os.path.join(self.base_path, 'user_stats.json')
        self.reviews_file = os.path.join(self.base_path, 'reviews.json')
        self.problem_stats_file = os.path.join(self.base_path, 'problem_stats.json')

    def _read_json(self, filepath: str) -> Dict:
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}

    def _write_json(self, filepath: str, data: Dict) -> None:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)

    # Problem Operations
    def get_all_problems(self) -> List[Dict]:
        data = self._read_json(self.problems_file)
        return data.get('problems', [])

    def get_problem_by_id(self, problem_id: int) -> Optional[Dict]:
        problems = self.get_all_problems()
        return next((p for p in problems if int(p['id']) == problem_id), None)

    def add_problem(self, problem_data: Dict) -> Dict:
        data = self._read_json(self.problems_file)
        problems = data.get('problems', [])
        
        # Generate new ID
        max_id = max([p['id'] for p in problems]) if problems else 0
        problem_data['id'] = max_id + 1
        
        problems.append(problem_data)
        data['problems'] = problems
        self._write_json(self.problems_file, data)
        return problem_data

    # User Operations
    def get_all_users(self) -> Dict[str, Dict]:
        data = self._read_json(self.users_file)
        return data.get('users', {})

    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        data = self._read_json(self.users_file)
        users = data.get('users', {})
        return users.get(user_id)

    def update_user(self, user_id: str, user_data: Dict) -> Optional[Dict]:
        data = self._read_json(self.users_file)
        users = data.get('users', {})
        if user_id in users:
            users[user_id].update(user_data)
        else:
            users[user_id] = user_data
        data['users'] = users
        self._write_json(self.users_file, data)
        return users.get(user_id)

    # User Answers Operations
    def get_user_answers(self, user_id: str) -> Dict:
        data = self._read_json(self.answers_file)
        return data.get(user_id, {})

    def save_answer(self, user_id: str, problem_id: int, answer_data: Dict) -> None:
        """Save a user's answer for a problem"""
        data = self._read_json(self.answers_file)
        if user_id not in data:
            data[user_id] = {}
        
        data[user_id][str(problem_id)] = answer_data
        self._write_json(self.answers_file, data)
        
        # Update problem stats after saving answer
        stats = self.get_problem_stats(problem_id)
        problem_stats = self._read_json(self.problem_stats_file)
        problem_stats[str(problem_id)] = stats
        self._write_json(self.problem_stats_file, problem_stats)

    # User Stats Operations
    def get_user_stats(self, user_id: str) -> Optional[Dict]:
        data = self._read_json(self.stats_file)
        return data.get(user_id, {
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
        })

    def update_user_stats(self, user_id: str, stats: Dict) -> Dict:
        data = self._read_json(self.stats_file)
        if user_id not in data:
            data[user_id] = {}
        data[user_id]['stats'] = stats
        data[user_id]['achievements'] = data[user_id].get('achievements', [])
        self._write_json(self.stats_file, data)
        return data[user_id]

    def get_problem_stats(self, problem_id: int) -> Dict:
        """Get statistics for a specific problem"""
        answers = self._read_json(self.answers_file)
        total_attempts = 0
        correct_attempts = 0
        
        for user_answers in answers.values():
            if str(problem_id) in user_answers:
                total_attempts += 1
                if user_answers[str(problem_id)].get('is_correct'):
                    correct_attempts += 1
        
        return {
            'total_attempts': total_attempts,
            'correct_attempts': correct_attempts,
            'accuracy': round((correct_attempts / total_attempts * 100) if total_attempts > 0 else 0, 2)
        }

    def get_specific_answer(self, user_id: str, problem_id: int) -> Optional[Dict]:
        data = self._read_json(self.answers_file)
        user_answers = data.get(user_id, {})
        return user_answers.get(str(problem_id))

    def get_reviews(self, problem_id: int) -> List[Dict]:
        """Get all reviews for a problem"""
        try:
            data = self._read_json(self.reviews_file)
            return data.get(str(problem_id), [])
        except:
            return []

    def save_reviews(self, problem_id: int, reviews: List[Dict]) -> None:
        """Save reviews for a problem"""
        try:
            data = self._read_json(self.reviews_file)
        except:
            data = {}
        
        data[str(problem_id)] = reviews
        self._write_json(self.reviews_file, data)

    def get_problem_submissions(self, problem_id: int) -> List[Dict]:
        """Get all submissions for a problem"""
        answers = self._read_json(self.answers_file)
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
        
        # Sort by timestamp, most recent first
        submissions.sort(key=lambda x: x['timestamp'], reverse=True)
        return submissions

db = DatabaseHandler()
