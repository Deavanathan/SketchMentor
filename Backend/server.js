const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Create the express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Create data directories if they don't exist
const dataDir = path.join(__dirname, 'data');
const whiteboardDir = path.join(dataDir, 'whiteboard');
const codeDir = path.join(dataDir, 'code');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(whiteboardDir)) {
  fs.mkdirSync(whiteboardDir);
}
if (!fs.existsSync(codeDir)) {
  fs.mkdirSync(codeDir);
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SketchMentor API is running' });
});

// Whiteboard endpoint
app.post('/whiteboard', (req, res) => {
  try {
    const { image, shapes, query } = req.body;
    
    if (!image || !query) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Save the data
    const timestamp = Date.now();
    const filename = `whiteboard_${timestamp}.json`;
    const filepath = path.join(whiteboardDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify({ 
      image, 
      shapes, 
      query,
      timestamp
    }, null, 2));
    
    // TODO: Implement AI processing here
    
    res.json({ 
      success: true, 
      message: 'Whiteboard data received',
      timestamp
    });
  } catch (error) {
    console.error('Error processing whiteboard data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Code endpoint
app.post('/code', (req, res) => {
  try {
    const { code, query } = req.body;
    
    if (!code || !query) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Save the data
    const timestamp = Date.now();
    const filename = `code_${timestamp}.json`;
    const filepath = path.join(codeDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify({ 
      code, 
      query,
      timestamp
    }, null, 2));
    
    // TODO: Implement AI processing here
    
    res.json({ 
      success: true, 
      message: 'Code data received',
      timestamp
    });
  } catch (error) {
    console.error('Error processing code data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
