#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:5001/api"

echo "Testing Problems API..."
echo "----------------------"

# 1. Get all problems
echo "1. GET /problems"
curl -v $BASE_URL/problems
echo -e "\n"

# 2. Get specific problem
echo "2. GET /problems/1"
curl -v $BASE_URL/problems/1
echo -e "\n"

# 3. Add new problem
echo "3. POST /problems"
curl -v -X POST $BASE_URL/problems \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Newton Laws",
    "description": "What is Newton first law about?",
    "options": [
      {"id": "A", "text": "Force equals mass times acceleration"},
      {"id": "B", "text": "Objects in motion stay in motion"},
      {"id": "C", "text": "Every action has an equal and opposite reaction"},
      {"id": "D", "text": "Gravity is constant"}
    ],
    "correct_answer": "B",
    "difficulty": "Easy",
    "category": "Physics"
  }'
echo -e "\n"

echo "Testing Users API..."
echo "------------------"

# 4. Get user profile
echo "4. GET /users/user1"
curl -v $BASE_URL/users/user1
echo -e "\n"

# 5. Update user profile
echo "5. PUT /users/user1"
curl -v -X PUT $BASE_URL/users/user1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john@example.com",
    "solved_count": 1,
    "streak": 1,
    "rank": 1,
    "stats": {
      "problemsSolved": 1,
      "accuracyRate": 100,
      "studyStreak": 1,
      "timeSpent": "1h",
      "correctSolved": 1
    }
  }'
echo -e "\n"

# 6. Save an answer
echo "6. POST /users/user1/answers"
curl -v -X POST $BASE_URL/users/user1/answers \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": 1,
    "answer": "C"
  }'
echo -e "\n"

# 7. Get all user answers
echo "7. GET /users/user1/answers"
curl -v $BASE_URL/users/user1/answers
echo -e "\n"

# 8. Get specific answer
echo "8. GET /users/user1/answers/1"
curl -v $BASE_URL/users/user1/answers/1
echo -e "\n"

echo "API Testing Complete!"
