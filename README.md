# LeetCode Proto

A modern full-stack web application built with React, TypeScript, and Flask for practicing LeetCode problems.

## Prerequisites

### Frontend
- Node.js (v16 or higher)
- npm or yarn package manager

### Backend
- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment (recommended):
```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
.\venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database:
```bash
python init_db.py
```

5. Start the Flask server:
```bash
python app.py
```

The backend server will start running at `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the project root directory

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend application will start running at `http://localhost:5173`

## Available Scripts

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready application
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint to check code quality

### Backend
- `python app.py` - Start the Flask server
- `python init_db.py` - Initialize/reset the database
- `./test_api.sh` - Run API tests (Unix/Linux only)

## Project Structure

```
.
├── src/                  # Frontend source code
│   ├── components/      # React components
│   ├── services/       # API services and utilities
│   └── ...
├── backend/             # Backend server code
│   ├── app.py          # Main Flask application
│   ├── routes/         # API routes
│   ├── models/         # Database models
│   ├── services/       # Business logic
│   └── database/       # Database configuration
├── public/             # Static assets
└── ...
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- Chart.js
- React Router
- Tailwind CSS
- Jest for testing
- ESLint for code quality

### Backend
- Flask
- Flask-CORS
- SQLite (default database)
- Python 3.8+

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is private and not licensed for public use.
