class Problem:
    def __init__(self, id, title, description, options, correct_answer):
        self.id = id
        self.title = title
        self.description = description
        self.options = options
        self.correct_answer = correct_answer

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'options': self.options
        }

# Sample problems data
problems = [
    Problem(
        id=1,
        title="Chemical Equilibrium",
        description="In a reversible reaction at equilibrium, what happens to the forward and reverse reaction rates?",
        options=[
            {"id": "A", "text": "Forward rate becomes zero"},
            {"id": "B", "text": "Reverse rate becomes zero"},
            {"id": "C", "text": "Both rates become equal"},
            {"id": "D", "text": "Rates constantly fluctuate"}
        ],
        correct_answer="C"
    ),
    Problem(
        id=2,
        title="Kinematics: Projectile Motion",
        description="What is the horizontal component of velocity in projectile motion under ideal conditions?",
        options=[
            {"id": "A", "text": "Constantly increasing"},
            {"id": "B", "text": "Constantly decreasing"},
            {"id": "C", "text": "Zero"},
            {"id": "D", "text": "Constant"}
        ],
        correct_answer="D"
    ),
    Problem(
        id=3,
        title="Vectors: 3D Motion",
        description="Which components of a vector are needed to fully describe motion in three dimensions?",
        options=[
            {"id": "A", "text": "X and Y components only"},
            {"id": "B", "text": "Y and Z components only"},
            {"id": "C", "text": "X, Y, and Z components"},
            {"id": "D", "text": "Magnitude only"}
        ],
        correct_answer="C"
    )
]
