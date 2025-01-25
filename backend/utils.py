import json
import os
from datetime import datetime

def load_json(filename):
    filepath = os.path.join(os.path.dirname(__file__), 'data', filename)
    with open(filepath, 'r') as f:
        return json.load(f)

def save_json(data, filename):
    filepath = os.path.join(os.path.dirname(__file__), 'data', filename)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def get_problems():
    return load_json('problems.json')['problems']

def get_users():
    return load_json('users.json')['users']

def get_user_answers():
    return load_json('user_answers.json')['answers']

def save_user_answer(user_id, problem_id, answer):
    answers_data = load_json('user_answers.json')
    if user_id not in answers_data['answers']:
        answers_data['answers'][user_id] = {}
    
    # Get the problem to check if the answer is correct
    problems = get_problems()
    problem = next((p for p in problems if p['id'] == problem_id), None)
    is_correct = problem['correct_answer'] == answer if problem else False

    answers_data['answers'][user_id][str(problem_id)] = {
        'answer': answer,
        'timestamp': datetime.now().isoformat(),
        'is_correct': is_correct
    }
    
    save_json(answers_data, 'user_answers.json')
    return is_correct
