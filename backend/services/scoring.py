from datetime import datetime, timedelta
import json
import os
import statistics

class ScoringService:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.users_file = os.path.join(self.base_dir, 'data', 'users.json')
        self.answers_file = os.path.join(self.base_dir, 'data', 'user_answers.json')
        self.problems_file = os.path.join(self.base_dir, 'data', 'problems.json')

    def load_data(self):
        try:
            with open(self.users_file, 'r') as f:
                users_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            users_data = {"users": {}}
            
        try:
            with open(self.answers_file, 'r') as f:
                answers_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            answers_data = {"answers": {}}
            
        try:
            with open(self.problems_file, 'r') as f:
                problems_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            problems_data = {"problems": []}
            
        return users_data, answers_data, problems_data

    def save_users_data(self, users_data):
        os.makedirs(os.path.dirname(self.users_file), exist_ok=True)
        with open(self.users_file, 'w') as f:
            json.dump(users_data, f, indent=2)

    def get_global_stats(self, users_data):
        """Calculate global statistics across all users"""
        active_users = [user for user in users_data['users'].values() 
                       if user['stats']['totalAttempts'] > 0]
        
        if not active_users:
            return {
                'avgAccuracy': 0,
                'avgSolveTime': 0,
                'avgProblemsPerUser': 0,
                'topAccuracy': 0,
                'fastestSolveTime': 0
            }

        accuracies = [user['stats']['accuracyRate'] for user in active_users]
        solve_times = [user['stats'].get('averageTime', 0) for user in active_users]
        problems_solved = [user['stats']['problemsSolved'] for user in active_users]

        return {
            'avgAccuracy': statistics.mean(accuracies) if accuracies else 0,
            'avgSolveTime': statistics.mean(solve_times) if solve_times else 0,
            'avgProblemsPerUser': statistics.mean(problems_solved) if problems_solved else 0,
            'topAccuracy': max(accuracies) if accuracies else 0,
            'fastestSolveTime': min(t for t in solve_times if t > 0) if solve_times else 0
        }

    def calculate_score(self, user_id):
        try:
            users_data, answers_data, problems_data = self.load_data()
            global_stats = self.get_global_stats(users_data)
            
            # Initialize user if not exists
            if user_id not in users_data['users']:
                users_data['users'][user_id] = {
                    'id': user_id,
                    'name': user_id.capitalize(),
                    'email': f'{user_id}@example.com',
                    'avatar': f'https://ui-avatars.com/api/?name={user_id}',
                    'joinedDate': datetime.now().isoformat(),
                    'stats': {
                        'problemsSolved': 0,
                        'accuracyRate': 0,
                        'studyStreak': 0,
                        'timeSpent': '0h',
                        'totalAttempts': 0,
                        'totalProblems': len(problems_data.get('problems', [])),
                        'averageTime': 0,
                        'rank': 1000,
                        'lastUpdated': datetime.now().isoformat()
                    }
                }
                self.save_users_data(users_data)
            
            user_answers = answers_data.get('answers', {}).get(user_id, {})

            # Calculate unique problems attempted and correct solutions
            unique_problems = {}  # problemId -> latest attempt
            total_attempts = len(user_answers)
            total_time = 0
            
            for problem_id, answer in user_answers.items():
                if problem_id not in unique_problems or \
                   datetime.fromisoformat(answer['timestamp']) > datetime.fromisoformat(unique_problems[problem_id]['timestamp']):
                    unique_problems[problem_id] = answer
                    if 'time_taken' in answer:
                        total_time += answer['time_taken']

            # Only count problems that were solved correctly
            correct_unique_answers = sum(1 for answer in unique_problems.values() if answer.get('is_correct'))
            
            # Calculate accuracy rate based on unique problems with correct answers
            total_unique_attempts = len(unique_problems)
            accuracy_rate = (correct_unique_answers / total_unique_attempts * 100) if total_unique_attempts > 0 else 0

            # Calculate average solve time
            average_time = total_time / total_attempts if total_attempts > 0 else 0

            # Calculate relative performance metrics
            relative_accuracy = (accuracy_rate / global_stats['avgAccuracy'] * 100) if global_stats['avgAccuracy'] > 0 else 100
            relative_speed = (global_stats['avgSolveTime'] / average_time * 100) if average_time > 0 else 100

            # Calculate rank based on multiple factors
            rank_score = (
                (correct_unique_answers * 50) +  # Problems solved weight
                (relative_accuracy * 0.3) +      # Accuracy weight
                (relative_speed * 0.2)           # Speed weight
            )
            rank = max(1, min(1000, int(1000 - rank_score)))

            # Calculate study streak
            sorted_answers = sorted(
                user_answers.items(),
                key=lambda x: datetime.fromisoformat(x[1]['timestamp']),
                reverse=True
            )

            current_streak = 0
            if sorted_answers:
                dates_active = set()
                last_active_date = None
                
                for _, answer in sorted_answers:
                    answer_date = datetime.fromisoformat(answer['timestamp']).date()
                    
                    if last_active_date is None:
                        if datetime.now().date() == answer_date:
                            current_streak = 1
                            last_active_date = answer_date
                            dates_active.add(answer_date)
                        elif datetime.now().date() - answer_date <= timedelta(days=1):
                            current_streak = 1
                            last_active_date = answer_date
                            dates_active.add(answer_date)
                    else:
                        if answer_date == last_active_date - timedelta(days=1):
                            current_streak += 1
                            last_active_date = answer_date
                            dates_active.add(answer_date)
                        elif answer_date == last_active_date:
                            dates_active.add(answer_date)
                        else:
                            break

            # Calculate time spent
            if sorted_answers:
                daily_times = {}
                for _, answer in sorted_answers:
                    answer_time = datetime.fromisoformat(answer['timestamp'])
                    day_key = answer_time.date()
                    
                    if day_key not in daily_times:
                        daily_times[day_key] = {'first': answer_time, 'last': answer_time}
                    else:
                        if answer_time < daily_times[day_key]['first']:
                            daily_times[day_key]['first'] = answer_time
                        if answer_time > daily_times[day_key]['last']:
                            daily_times[day_key]['last'] = answer_time

                total_hours = sum(
                    (times['last'] - times['first']).total_seconds() / 3600
                    for times in daily_times.values()
                )
                time_spent = f"{max(1, round(total_hours))}h"
            else:
                time_spent = "0h"

            # Update user stats
            updated_stats = {
                'problemsSolved': correct_unique_answers,
                'accuracyRate': round(accuracy_rate, 2),
                'studyStreak': current_streak,
                'timeSpent': time_spent,
                'totalAttempts': total_attempts,
                'totalProblems': len(problems_data.get('problems', [])),
                'averageTime': round(average_time, 2),
                'rank': rank,
                'relativeAccuracy': round(relative_accuracy, 2),
                'relativeSpeed': round(relative_speed, 2),
                'globalStats': global_stats,
                'lastUpdated': datetime.now().isoformat()
            }

            # Update users data
            users_data['users'][user_id]['stats'] = updated_stats
            self.save_users_data(users_data)

            return updated_stats
        except Exception as e:
            print(f"Error in calculate_score: {str(e)}")
            return {
                'problemsSolved': 0,
                'accuracyRate': 0,
                'studyStreak': 0,
                'timeSpent': '0h',
                'totalAttempts': 0,
                'totalProblems': 0,
                'averageTime': 0,
                'rank': 1000,
                'lastUpdated': datetime.now().isoformat()
            }

    def update_achievements(self, user_id):
        try:
            users_data, answers_data, _ = self.load_data()
            user = users_data.get('users', {}).get(user_id)
            if not user:
                return []

            stats = user.get('stats', {})
            achievements = []

            # Problem Solver Achievement
            problems_solved = stats.get('problemsSolved', 0)  
            if problems_solved >= 5:
                achievements.append({
                    'name': 'Problem Solver',
                    'description': 'Solved 5 or more problems correctly',
                    'icon': '🎯'
                })

            # Accuracy Master Achievement
            accuracy = stats.get('accuracyRate', 0)
            total_problems = stats.get('problemsSolved', 0)
            if accuracy >= 80 and total_problems >= 3:
                achievements.append({
                    'name': 'Accuracy Master',
                    'description': 'Maintained 80% or higher accuracy with at least 3 problems',
                    'icon': '🎯'
                })

            # Study Streak Achievement
            streak = stats.get('studyStreak', 0)
            if streak >= 3:
                achievements.append({
                    'name': 'Consistent Learner',
                    'description': 'Maintained a 3-day study streak',
                    'icon': '🔥'
                })

            # Update user achievements
            users_data['users'][user_id]['achievements'] = achievements
            self.save_users_data(users_data)

            return achievements
        except Exception as e:
            print(f"Error in update_achievements: {str(e)}")
            return []
