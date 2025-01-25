from database.db_handler import db
from typing import Dict, List, Optional
import json
import os
import uuid
from datetime import datetime

class ProblemService:
    def __init__(self):
        self.current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.problems_file = os.path.join(self.current_dir, 'data', 'problems.json')
        self.answers_file = os.path.join(self.current_dir, 'data', 'user_answers.json')
        self.submissions_file = os.path.join(self.current_dir, 'data', 'submissions.json')

    def get_all_problems(self) -> List[Dict]:
        try:
            with open(self.problems_file, 'r') as f:
                data = json.load(f)
                # Sort problems by ID to ensure consistent order
                problems = sorted(data['problems'], key=lambda x: x['id'])
                return problems
        except Exception as e:
            print(f"Error reading problems: {e}")
            return []

    def get_problem_by_id(self, problem_id: int) -> Optional[Dict]:
        try:
            with open(self.problems_file, 'r') as f:
                data = json.load(f)
                for problem in data['problems']:
                    if problem['id'] == problem_id:
                        return problem
                return None
        except Exception as e:
            print(f"Error reading problem {problem_id}: {e}")
            return None

    def create_problem(self, problem_data: Dict) -> Dict:
        required_fields = ['title', 'description', 'options', 'correct_answer']
        if not all(field in problem_data for field in required_fields):
            raise ValueError("Missing required fields")
        
        return db.add_problem(problem_data)

    def get_problem_stats(self, problem_id: int) -> Dict:
        try:
            # Check if problem exists first
            problem = self.get_problem_by_id(problem_id)
            if not problem:
                return {
                    'total_attempts': 0,
                    'correct_attempts': 0,
                    'accuracy': 0,
                    'answer_distribution': {},
                    'average_time': 0,
                    'total_reviews': 0,
                    'first_submission': None,
                    'last_submission': None
                }

            # Load answers data
            with open(self.answers_file, 'r') as f:
                answers_data = json.load(f)

            total_attempts = 0
            correct_attempts = 0
            answer_distribution = {}
            total_time = 0
            reviews_count = 0
            last_submission = None
            first_submission = None

            # Convert problem_id to string since it's stored as string in JSON
            problem_id_str = str(problem_id)

            # Analyze all submissions
            for user_id, user_answers in answers_data.get('answers', {}).items():
                if problem_id_str in user_answers:
                    answer_data = user_answers[problem_id_str]
                    total_attempts += 1
                    
                    # Track correct attempts
                    if answer_data.get('is_correct', False):
                        correct_attempts += 1
                    
                    # Track answer distribution
                    user_answer = answer_data.get('answer', '')
                    answer_distribution[user_answer] = answer_distribution.get(user_answer, 0) + 1
                    
                    # Track reviews
                    if answer_data.get('review'):
                        reviews_count += 1
                    
                    # Track submission time
                    timestamp = answer_data.get('timestamp')
                    if timestamp:
                        if not first_submission or timestamp < first_submission:
                            first_submission = timestamp
                        if not last_submission or timestamp > last_submission:
                            last_submission = timestamp

            # Calculate accuracy
            accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0
            
            # Calculate average time (if we have both first and last submission)
            average_time = 0
            if first_submission and last_submission:
                from datetime import datetime
                time_diff = datetime.fromisoformat(last_submission) - datetime.fromisoformat(first_submission)
                if total_attempts > 1:  # Only calculate average if we have more than one attempt
                    average_time = time_diff.total_seconds() / total_attempts

            return {
                'total_attempts': total_attempts,
                'correct_attempts': correct_attempts,
                'accuracy': round(accuracy, 2),
                'answer_distribution': answer_distribution,
                'average_time': round(average_time, 2),
                'total_reviews': reviews_count,
                'first_submission': first_submission,
                'last_submission': last_submission
            }
        except Exception as e:
            print(f"Error getting problem stats: {e}")
            return {
                'total_attempts': 0,
                'correct_attempts': 0,
                'accuracy': 0,
                'answer_distribution': {},
                'average_time': 0,
                'total_reviews': 0,
                'first_submission': None,
                'last_submission': None
            }

    def get_problem_submissions(self, problem_id: int) -> List[Dict]:
        """Get all submissions for a specific problem."""
        try:
            # Load submissions data
            if os.path.exists(self.submissions_file):
                with open(self.submissions_file, 'r') as f:
                    submissions = json.load(f)
                return [s for s in submissions if s['problem_id'] == problem_id]
            return []
        except Exception as e:
            print(f"Error reading submissions for problem {problem_id}: {e}")
            return []

    def add_submission(self, problem_id: int, user_id: str, submission_data: Dict) -> Dict:
        """Add a new submission for a problem."""
        try:
            submission = {
                'id': str(uuid.uuid4()),
                'problem_id': problem_id,
                'user_id': user_id,
                'answer': submission_data.get('answer', ''),
                'is_correct': submission_data.get('is_correct', False),
                'timestamp': submission_data.get('timestamp', datetime.now().isoformat())
            }

            # Load existing submissions
            submissions = []
            if os.path.exists(self.submissions_file):
                with open(self.submissions_file, 'r') as f:
                    submissions = json.load(f)

            # Add new submission
            submissions.append(submission)

            # Save updated submissions
            with open(self.submissions_file, 'w') as f:
                json.dump(submissions, f, indent=2)

            return submission
        except Exception as e:
            print(f"Error adding submission: {e}")
            raise
