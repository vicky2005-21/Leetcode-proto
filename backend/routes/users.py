from flask import Blueprint, jsonify, request
from services.user_service import UserService
from datetime import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = UserService.get_user(user_id)
        if user:
            return jsonify(user)
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user_data = request.json
        updated_user = UserService.update_user(user_id, user_data)
        if updated_user:
            return jsonify(updated_user)
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/users/<user_id>/answers', methods=['GET'])
def get_user_answers(user_id):
    try:
        answers = UserService.get_user_answers(user_id)
        return jsonify(answers)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/users/<user_id>/answers/<int:problem_id>', methods=['GET'])
def get_specific_answer(user_id, problem_id):
    try:
        answer = UserService.get_specific_answer(user_id, problem_id)
        if answer:
            return jsonify(answer)
        return jsonify({'error': 'Answer not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/users/<user_id>/answers', methods=['POST'])
def save_answer(user_id):
    try:
        data = request.json
        problem_id = data.get('problemId')
        answer = data.get('answer')
        
        if not problem_id or not answer:
            return jsonify({'error': 'Missing problemId or answer'}), 400
        
        result = UserService.save_answer(user_id, problem_id, answer)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/users/<user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    try:
        stats = UserService.get_user_stats(user_id)
        if stats:
            return jsonify(stats)
        return jsonify({
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
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/users/<user_id>/answers/<int:problem_id>/submit', methods=['POST'])
def submit_answer(user_id, problem_id):
    try:
        data = request.json
        answer = data.get('answer')
        
        if not answer:
            return jsonify({'error': 'Missing answer'}), 400
        
        result = UserService.submit_answer(user_id, problem_id, answer)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/users/<user_id>/reviews/<int:problem_id>', methods=['POST'])
def submit_review(user_id, problem_id):
    data = request.get_json()
    review = data.get('review')
    if not review:
        return jsonify({'error': 'Review text is required'}), 400
    
    try:
        result = UserService.submit_review(user_id, problem_id, review)
        return jsonify(result)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
