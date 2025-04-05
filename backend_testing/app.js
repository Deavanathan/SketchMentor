const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8081;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for base64 images

// Temporary storage for different types of data
const dataStore = {
    whiteboard: null,
    video: null,
    visual: null,
    interactive: null,
    codevisual: null
};

// POST routes for different endpoints
app.post('/whiteboard', (req, res) => {
    const { image, query } = req.body;
    
    // Store the data
    dataStore.whiteboard = { image, query };
    
    // Log to console
    console.log('Whiteboard Data Received:');
    console.log('Query:', query);
    console.log('Image:', image ? `Image received (${image.length} characters)` : 'No image');
    
    res.json({ 
        message: 'Whiteboard data received successfully',
        data: dataStore.whiteboard 
    });
});

app.post('/video', (req, res) => {
    const { query } = req.body;
    
    // Store the data
    dataStore.video = { query };
    
    // Log to console
    console.log('Video Request Received:', query);
    
    res.json({ 
        message: 'Video request received successfully',
        data: dataStore.video 
    });
});

app.post('/visual', (req, res) => {
    const { query } = req.body;
    
    // Store the data
    dataStore.visual = { query };
    
    // Log to console
    console.log('Visual Request Received:', query);
    
    res.json({ 
        message: 'Visual request received successfully',
        data: dataStore.visual 
    });
});

app.post('/interactive', (req, res) => {
    const { query } = req.body;
    
    // Store the data
    dataStore.interactive = { query };
    
    // Log to console
    console.log('Interactive Request Received:', query);
    
    res.json({ 
        message: 'Interactive request received successfully',
        data: dataStore.interactive 
    });
});

// GET routes to retrieve stored data
app.get('/whiteboard', (req, res) => {
    if (dataStore.whiteboard) {
        res.json(dataStore.whiteboard);
    } else {
        res.status(404).json({ message: 'No whiteboard data found' });
    }
});

app.get('/video', (req, res) => {
    if (dataStore.video) {
        res.json(dataStore.video);
    } else {
        res.status(404).json({ message: 'No video data found' });
    }
});

app.get('/visual', (req, res) => {
    if (dataStore.visual) {
        res.json(dataStore.visual);
    } else {
        res.status(404).json({ message: 'No visual data found' });
    }
});

app.get('/interactive', (req, res) => {
    if (dataStore.interactive) {
        res.json(dataStore.interactive);
    } else {
        res.status(404).json({ message: 'No interactive data found' });
    }
});


app.post('/code', (req, res) => {
    const { code, query } = req.body;
    
    // Store the data
    dataStore.code = { code, query };
    console.log('Received Request Details:');
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
    
    // Log to console with full code and query details
    console.log('Code Data Received:');
    console.log('Query:', query);
    console.log('Full Code:\n', code || 'No code provided');
    
    res.json({ 
        message: 'Code data received successfully',
        data: dataStore.code 
    });
});

// Corresponding GET route for code
app.get('/code', (req, res) => {
    if (dataStore.code) {
        res.json(dataStore.code);
    } else {
        res.status(404).json({ message: 'No code data found' });
    }
});


app.use(cors({
    origin: 'http://localhost:8080', // Explicitly allow frontend origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Waiting for frontend requests...');
});