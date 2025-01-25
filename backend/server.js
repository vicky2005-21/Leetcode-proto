const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Helper function to read JSON files
async function readJsonFile(filename) {
  const filePath = path.join(__dirname, 'data', filename);
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// Get all problems
app.get('/problems', async (req, res) => {
  try {
    const problems = await readJsonFile('problems.json');
    res.json(problems);
  } catch (error) {
    console.error('Error reading problems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific problem
app.get('/problems/:id', async (req, res) => {
  try {
    const problems = await readJsonFile('problems.json');
    const problem = problems.find(p => p.id === req.params.id);
    if (!problem) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }
    res.json(problem);
  } catch (error) {
    console.error('Error reading problem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all submissions
app.get('/submissions', async (req, res) => {
  try {
    const submissions = await readJsonFile('submissions.json');
    res.json(submissions);
  } catch (error) {
    console.error('Error reading submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit an answer
app.post('/submit', async (req, res) => {
  try {
    const { problemId, answer } = req.body;
    const problems = await readJsonFile('problems.json');
    const problem = problems.find(p => p.id === problemId);
    
    if (!problem) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }

    const isCorrect = answer.toLowerCase() === problem.answer.toLowerCase();
    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      problemId,
      isCorrect
    };

    // Read current submissions
    const submissions = await readJsonFile('submissions.json');
    submissions.push(submission);

    // Write updated submissions
    await fs.writeFile(
      path.join(__dirname, 'data', 'submissions.json'),
      JSON.stringify(submissions, null, 2)
    );

    res.json({ isCorrect });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
