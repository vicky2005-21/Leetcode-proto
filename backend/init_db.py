from database.db_handler import db

def init_database():
    # Initialize problems if empty
    if not db.get_all_problems():
        initial_problems = [
            {
                "title": "Chemical Equilibrium",
                "description": "In a reversible reaction at equilibrium, what happens to the forward and reverse reaction rates?",
                "options": [
                    {"id": "A", "text": "Forward rate becomes zero"},
                    {"id": "B", "text": "Reverse rate becomes zero"},
                    {"id": "C", "text": "Both rates become equal"},
                    {"id": "D", "text": "Rates constantly fluctuate"}
                ],
                "correct_answer": "C",
                "difficulty": "Medium",
                "category": "Chemistry"
            },
            {
                "title": "Kinematics: Projectile Motion",
                "description": "What is the horizontal component of velocity in projectile motion under ideal conditions?",
                "options": [
                    {"id": "A", "text": "Constantly increasing"},
                    {"id": "B", "text": "Constantly decreasing"},
                    {"id": "C", "text": "Zero"},
                    {"id": "D", "text": "Constant"}
                ],
                "correct_answer": "D",
                "difficulty": "Hard",
                "category": "Physics"
            }
        ]
        for problem in initial_problems:
            db.add_problem(problem)

    # Initialize default user if not exists
    default_user = {
        "name": "John Doe",
        "email": "john@example.com",
        "solved_count": 0,
        "streak": 0,
        "rank": 1,
        "joined_date": "2024-03-01",
        "stats": {
            "problemsSolved": 0,
            "accuracyRate": 0,
            "studyStreak": 0,
            "timeSpent": "0h",
            "correctSolved": 0
        }
    }
    if not db.get_user_by_id("user1"):
        db.update_user("user1", default_user)

if __name__ == "__main__":
    init_database()
    print("Database initialized successfully!")
