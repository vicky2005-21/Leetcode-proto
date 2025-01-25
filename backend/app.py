from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from services.user_service import UserService
from services.scoring_service import ScoringService
from services.problem_service import ProblemService
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime
import json

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:5174"]}})

# Get current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Initialize services
problem_service = ProblemService()
user_service = UserService()
scoring_service = ScoringService()

# Configure upload folder
UPLOAD_FOLDER = os.path.join(current_dir, 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'webm'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# File paths
PROBLEMS_FILE = os.path.join(current_dir, 'data', 'problems.json')
USERS_FILE = os.path.join(current_dir, 'data', 'users.json')
USER_ANSWERS_FILE = os.path.join(current_dir, 'data', 'user_answers.json')
REVIEWS_FILE = os.path.join(current_dir, 'data', 'reviews.json')
SUBMISSIONS_FILE = os.path.join(current_dir, 'data', 'submissions.json')

# Make sure data directory exists
os.makedirs(os.path.join(current_dir, 'data'), exist_ok=True)
os.makedirs(os.path.join(current_dir, 'uploads'), exist_ok=True)

# Create empty JSON files if they don't exist
for file_path in [PROBLEMS_FILE, USERS_FILE, USER_ANSWERS_FILE, REVIEWS_FILE, SUBMISSIONS_FILE]:
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump([], f)

# Problem routes
@app.route('/problems', methods=['GET'])
def get_problems():
    try:
        problems = problem_service.get_all_problems()
        return jsonify(problems)
    except Exception as e:
        print(f"Error getting problems: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/problems/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    try:
        problem = problem_service.get_problem_by_id(problem_id)
        if problem:
            return jsonify(problem)
        return jsonify({'error': 'Problem not found'}), 404
    except Exception as e:
        print(f"Error getting problem: {e}")
        return jsonify({'error': str(e)}), 500

# User routes
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = user_service.get_user(user_id)
        if user:
            return jsonify(user)
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Error getting user: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/users/<user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    try:
        stats = user_service.get_user_stats(user_id)
        if stats:
            return jsonify(stats)
        return jsonify({'error': 'User stats not found'}), 404
    except Exception as e:
        print(f"Error getting user stats: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/user_answer/<user_id>/<int:problem_id>', methods=['GET'])
def get_user_answer(user_id, problem_id):
    try:
        answer = user_service.get_user_answer(user_id, problem_id)
        if answer:
            return jsonify(answer)
        # Return empty object instead of 404 for better frontend handling
        return jsonify({
            'answer': '',
            'is_correct': False,
            'timestamp': ''
        })
    except Exception as e:
        print(f"Error getting user answer: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/users/<user_id>/answers', methods=['GET'])
def get_user_answers(user_id):
    try:
        answers = user_service.get_user_answers(user_id)
        return jsonify(answers)
    except Exception as e:
        print(f"Error getting user answers: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/users/<user_id>/submit_answer/<int:problem_id>', methods=['POST'])
def submit_answer(user_id, problem_id):
    try:
        data = request.get_json()
        if not data or 'answer' not in data:
            return jsonify({'error': 'No answer provided'}), 400

        # Load current user answers
        user_answers = {}
        if os.path.exists(USER_ANSWERS_FILE):
            with open(USER_ANSWERS_FILE, 'r') as f:
                user_answers = json.load(f)

        # Initialize user's answers if not exists
        if user_id not in user_answers:
            user_answers[user_id] = {}

        # Get the problem
        problem = problem_service.get_problem_by_id(problem_id)
        if not problem:
            return jsonify({'error': 'Problem not found'}), 404

        # Check the answer
        is_correct = scoring_service.check_answer(data['answer'], problem.get('correct_answer', ''))
        
        # Create submission record
        submission = {
            'user_id': user_id,
            'problem_id': problem_id,
            'answer': data['answer'],
            'is_correct': is_correct,
            'timestamp': datetime.now().isoformat()
        }

        # Load and update submissions.json
        submissions = []
        if os.path.exists(SUBMISSIONS_FILE):
            with open(SUBMISSIONS_FILE, 'r') as f:
                submissions = json.load(f)
        submissions.append(submission)
        with open(SUBMISSIONS_FILE, 'w') as f:
            json.dump(submissions, f, indent=2)

        # Update user_answers.json
        user_answers[user_id][str(problem_id)] = {
            'answer': data['answer'],
            'is_correct': is_correct,
            'timestamp': submission['timestamp']
        }
        
        with open(USER_ANSWERS_FILE, 'w') as f:
            json.dump(user_answers, f, indent=2)

        # Update user stats
        user = user_service.get_user(user_id)
        if user is not None:
            if 'stats' not in user:
                user['stats'] = {
                    'total_submissions': 0,
                    'correct_submissions': 0,
                    'problems_solved': 0
                }
            
            user['stats']['total_submissions'] = len([s for s in submissions if s['user_id'] == user_id])
            user['stats']['correct_submissions'] = len([s for s in submissions if s['user_id'] == user_id and s['is_correct']])
            user['stats']['problems_solved'] = len(set(str(s['problem_id']) for s in submissions if s['user_id'] == user_id and s['is_correct']))
            
            with open(USERS_FILE, 'w') as f:
                json.dump(user, f, indent=2)

        return jsonify({
            'success': True,
            'answer': {
                'answer': data['answer'],
                'is_correct': is_correct,
                'timestamp': submission['timestamp']
            },
            'stats': {
                'problemsSolved': user['stats']['problems_solved'] if user is not None else 0,
                'accuracyRate': round(user['stats']['correct_submissions'] / user['stats']['total_submissions'] * 100, 2) if user is not None and user['stats']['total_submissions'] > 0 else 0,
                'studyStreak': 1,  # TODO: Implement streak calculation
                'timeSpent': 0,    # TODO: Implement time tracking
                'correctSolved': user['stats']['correct_submissions'] if user is not None else 0,
                'totalPoints': user['stats']['correct_submissions'] * 10 if user is not None else 0,  # 10 points per correct answer
                'lastUpdated': submission['timestamp']
            }
        })

    except Exception as e:
        print(f"Error submitting answer: {e}")
        return jsonify({'error': str(e)}), 500

# Unified Stats Route
@app.route('/api/unified-stats/<user_id>', methods=['GET'])
def get_unified_stats(user_id):
    try:
        # Get user data
        user_data = user_service.get_user(user_id)
        if not user_data:
            return jsonify({'error': 'User not found'}), 404

        # Get all problems for reference
        problems = problem_service.get_all_problems()
        problem_dict = {str(p['id']): p for p in problems}

        # Load submissions
        submissions = []
        if os.path.exists(SUBMISSIONS_FILE):
            with open(SUBMISSIONS_FILE, 'r') as f:
                submissions = json.load(f)

        # Filter user's submissions
        user_submissions = [s for s in submissions if s['user_id'] == user_id]
        
        # Calculate submission stats
        total_submissions = len(user_submissions)
        correct_submissions = len([s for s in user_submissions if s['is_correct']])
        
        # Calculate unique problems solved
        solved_problems = set(str(s['problem_id']) for s in user_submissions if s['is_correct'])
        
        # Calculate difficulty stats
        difficulty_stats = {
            'easy': 0,
            'medium': 0,
            'hard': 0
        }
        
        for problem_id in solved_problems:
            if problem_id in problem_dict:
                difficulty = problem_dict[problem_id].get('difficulty', 'medium').lower()
                difficulty_stats[difficulty] += 1

        # Get recent activity (last 5 submissions)
        recent_submissions = []
        sorted_submissions = sorted(user_submissions, key=lambda x: x['timestamp'], reverse=True)[:5]

        for sub in sorted_submissions:
            problem_id = str(sub['problem_id'])
            if problem_id in problem_dict:
                problem = problem_dict[problem_id]
                recent_submissions.append({
                    'problemId': problem_id,
                    'problemTitle': problem.get('title', ''),
                    'timestamp': sub['timestamp'],
                    'isCorrect': sub['is_correct'],
                    'difficulty': problem.get('difficulty', 'medium')
                })

        # Calculate acceptance rate
        acceptance_rate = (correct_submissions / total_submissions * 100) if total_submissions > 0 else 0

        # Combine all stats
        unified_stats = {
            'user': user_data,
            'submissions': {
                'total': total_submissions,
                'correct': correct_submissions,
                'acceptanceRate': round(acceptance_rate, 2)
            },
            'problemsByDifficulty': difficulty_stats,
            'recentActivity': recent_submissions,
            'studyStreak': user_data.get('stats', {}).get('studyStreak', 0),
            'timeSpent': user_data.get('stats', {}).get('timeSpent', 0),
            'rank': user_data.get('stats', {}).get('rank', 'Beginner')
        }

        return jsonify(unified_stats)
    except Exception as e:
        print(f"Error in get_unified_stats: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Stats and Reviews routes
@app.route('/problem_stats/<int:problem_id>', methods=['GET'])
def get_problem_stats(problem_id):
    try:
        stats = problem_service.get_problem_stats(problem_id)
        if stats:
            return jsonify(stats)
        return jsonify({'error': 'Problem stats not found'}), 404
    except Exception as e:
        print(f"Error getting problem stats: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/problems/<int:problem_id>/submissions', methods=['GET'])
def get_problem_submissions(problem_id):
    try:
        # Load submissions from file
        submissions = []
        if os.path.exists(SUBMISSIONS_FILE):
            with open(SUBMISSIONS_FILE, 'r') as f:
                submissions = json.load(f)
        
        # Filter submissions for this problem
        problem_submissions = [s for s in submissions if s['problem_id'] == problem_id]
        return jsonify(problem_submissions)
    except Exception as e:
        print(f"Error getting submissions: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/users/<user_id>/submit_review/<int:problem_id>', methods=['POST'])
def submit_review(user_id, problem_id):
    try:
        data = request.get_json()
        review = data.get('review')
        
        if not review:
            return jsonify({'error': 'Missing review field'}), 400
            
        result = scoring_service.submit_review(user_id, problem_id, review)
        return jsonify(result)
    except Exception as e:
        print(f"Error submitting review: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/problems/<int:problem_id>/reviews', methods=['GET'])
def get_problem_reviews(problem_id):
    try:
        # Load reviews from file
        reviews = []
        if os.path.exists(REVIEWS_FILE):
            with open(REVIEWS_FILE, 'r') as f:
                reviews_data = json.load(f)
                # Get reviews for this problem
                problem_reviews = reviews_data.get(str(problem_id), [])
                
                # Format the response
                formatted_reviews = [{
                    'id': str(uuid.uuid4()),  # Generate ID for existing reviews
                    'content': r.get('review', ''),
                    'media': r.get('media'),
                    'author': r.get('user_id', 'Anonymous'),
                    'timestamp': r.get('timestamp')
                } for r in problem_reviews]
                
                return jsonify(formatted_reviews)
    except Exception as e:
        print(f"Error getting reviews: {e}")
        return jsonify({'error': str(e)}), 500

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Helper function to handle file upload
def handle_file_upload(file, filename):
    if file and allowed_file(filename):
        # Create unique filename
        filename = secure_filename(f"{uuid.uuid4()}_{filename}")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return f"/uploads/{filename}"
    return None

# File upload route
@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    
    file = request.files['image']
    filename = file.filename
    media_url = handle_file_upload(file, filename)
    if media_url:
        return jsonify({'filename': filename, 'path': media_url})
    return jsonify({'error': 'Invalid file type'}), 400

# Review routes
@app.route('/api/problems/<int:problem_id>/reviews', methods=['POST'])
def add_review(problem_id):
    try:
        content = request.form.get('content')
        if not content:
            return jsonify({'error': 'Review content is required'}), 400

        # Handle media file if present
        media_url = None
        if 'media' in request.files:
            file = request.files['media']
            filename = file.filename
            media_url = handle_file_upload(file, filename)

        # Create review object
        review = {
            'user_id': 'user1',  # TODO: Get from auth
            'review': content,
            'timestamp': datetime.now().isoformat(),
            'problem_id': problem_id,
            'media': media_url
        }

        # Load existing reviews
        reviews_data = {}
        if os.path.exists(REVIEWS_FILE):
            with open(REVIEWS_FILE, 'r') as f:
                reviews_data = json.load(f)

        # Initialize problem reviews list if it doesn't exist
        problem_id_str = str(problem_id)
        if problem_id_str not in reviews_data:
            reviews_data[problem_id_str] = []

        # Add new review
        reviews_data[problem_id_str].append(review)

        # Save updated reviews
        with open(REVIEWS_FILE, 'w') as f:
            json.dump(reviews_data, f, indent=2)

        # Format the response
        formatted_review = {
            'id': str(uuid.uuid4()),
            'content': review['review'],
            'media': review['media'],
            'author': review['user_id'],
            'timestamp': review['timestamp']
        }

        return jsonify(formatted_review)
    except Exception as e:
        print(f"Error adding review: {e}")
        return jsonify({'error': str(e)}), 500

# Helper function to load JSON data
def load_data(file_path):
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

if __name__ == '__main__':
    # Ensure data directory exists
    os.makedirs(os.path.join(current_dir, 'data'), exist_ok=True)
    # Ensure uploads directory exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(host='0.0.0.0', port=5001, debug=True)
