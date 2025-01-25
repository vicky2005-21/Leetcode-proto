import random
import json

def generate_dummy_questions(num_questions=200):
    topics = {
        "Physics": [
            "Mechanics",
            "Electrostatics",
            "Thermodynamics",
            "Modern Physics",
            "Optics",
            "Magnetism"
        ],
        "Chemistry": [
            "Organic Chemistry",
            "Inorganic Chemistry",
            "Physical Chemistry",
            "Chemical Bonding",
            "Electrochemistry",
            "Chemical Kinetics"
        ],
        "Mathematics": [
            "Calculus",
            "Algebra",
            "Coordinate Geometry",
            "Trigonometry",
            "Vectors",
            "Probability"
        ]
    }

    question_templates = {
        "Physics": {
            "Mechanics": [
                "Calculate the projectile motion of a particle launched at angle θ",
                "Find the centripetal force in circular motion",
                "Analyze the motion of a simple pendulum"
            ],
            "Electrostatics": [
                "Calculate the electric field due to point charges",
                "Find the potential difference between two points",
                "Determine the capacitance of parallel plate capacitor"
            ]
        },
        "Chemistry": {
            "Organic Chemistry": [
                "Predict the product of the following reaction",
                "Identify the IUPAC name of the compound",
                "Determine the mechanism of the reaction"
            ],
            "Physical Chemistry": [
                "Calculate the pH of the solution",
                "Find the order of reaction",
                "Determine the equilibrium constant"
            ]
        },
        "Mathematics": {
            "Calculus": [
                "Find the derivative of the function",
                "Evaluate the definite integral",
                "Find the maxima and minima"
            ],
            "Coordinate Geometry": [
                "Find the equation of the circle",
                "Determine the distance between two points",
                "Find the area of the triangle"
            ]
        }
    }

    questions = []
    for i in range(num_questions):
        # Select random subject and topic
        subject = random.choice(list(topics.keys()))
        topic = random.choice(topics[subject])
        
        # Generate question based on topic
        templates = question_templates.get(subject, {}).get(topic, ["Solve the following problem"])
        description = random.choice(templates)
        
        # Generate options based on topic
        options = [
            {"id": "A", "text": f"Option A for {topic}"},
            {"id": "B", "text": f"Option B for {topic}"},
            {"id": "C", "text": f"Option C for {topic}"},
            {"id": "D", "text": f"Option D for {topic}"}
        ]

        question = {
            "id": i + 1,
            "title": f"{topic} Problem {i + 1}",
            "description": description,
            "options": options,
            "correct_answer": random.choice(["A", "B", "C", "D"]),
            "difficulty": random.choice(["Easy", "Medium", "Hard"]),
            "subject": subject,
            "topic": topic,
            "acceptance_rate": random.randint(40, 95),
            "solved": random.choice([True, False]),
            "hints": [f"Hint 1 for {topic}", f"Hint 2 for {topic}"]
        }
        questions.append(question)

    # Generate topic stats
    topic_stats = {}
    for subject in topics:
        for topic in topics[subject]:
            topic_questions = [q for q in questions if q["topic"] == topic]
            topic_stats[topic] = {
                "total": len(topic_questions),
                "solved": len([q for q in topic_questions if q["solved"]]),
                "subject": subject
            }

    return {
        "problems": questions,
        "topic_stats": topic_stats
    }

# Generate dummy questions
data = generate_dummy_questions(num_questions=200)

# Save to a JSON file
with open("dummy_questions.json", "w") as f:
    json.dump(data, f, indent=4)

print("200 dummy questions with topic stats have been generated and saved to 'dummy_questions.json'.")
