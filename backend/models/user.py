class User:
    def __init__(self, id, name, solved_count=0, streak=0):
        self.id = id
        self.name = name
        self.solved_count = solved_count
        self.streak = streak
        self.answers = {}  # Store user's answers: {problem_id: answer}

    def add_answer(self, problem_id, answer):
        self.answers[problem_id] = answer

    def get_answer(self, problem_id):
        return self.answers.get(problem_id)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'solved_count': self.solved_count,
            'streak': self.streak,
            'answers': self.answers
        }

# Sample user data
users = {
    'user1': User(
        id='user1',
        name='John Doe',
        solved_count=15,
        streak=3
    )
}
