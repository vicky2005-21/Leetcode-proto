from flask import Blueprint, jsonify, request
from services.problem_service import ProblemService
from datetime import datetime
from database.db_handler import db

problems_bp = Blueprint('problems', __name__)

@problems_bp.route('/problems', methods=['GET'])
def get_all_problems():
    try:
        problems = ProblemService.get_all_problems()
        return jsonify({'problems': problems})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@problems_bp.route('/problems/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    try:
        problem = ProblemService.get_problem(problem_id)
        if problem:
            return jsonify(problem)
        return jsonify({'error': 'Problem not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@problems_bp.route('/problems', methods=['POST'])
def add_problem():
    try:
        problem_data = request.json
        new_problem = ProblemService.add_problem(problem_data)
        return jsonify(new_problem), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@problems_bp.route('/problems/<int:problem_id>/stats', methods=['GET'])
def get_problem_stats(problem_id):
    try:
        stats = ProblemService.get_problem_stats(problem_id)
        if stats is None:
            return jsonify([]), 200
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@problems_bp.route('/problems/<int:problem_id>/submissions', methods=['GET'])
def get_problem_submissions(problem_id):
    try:
        submissions = ProblemService.get_problem_submissions(problem_id)
        if submissions is None:
            return jsonify([]), 200
        return jsonify(submissions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@problems_bp.route('/problems/<int:problem_id>/submit', methods=['POST'])
def submit_answer(problem_id):
    try:
        data = request.json
        answer = data.get('answer')
        is_correct = data.get('isCorrect')

        # Store the submission
        submission = {
            'problem_id': problem_id,
            'answer': answer,
            'is_correct': is_correct,
            'timestamp': datetime.now().isoformat()
        }

        # Update user_answers.json
        db.save_answer(problem_id, answer, is_correct)
        
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
