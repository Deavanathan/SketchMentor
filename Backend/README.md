# SketchMentor Backend

This is the backend server for the SketchMentor application, which processes whiteboard drawings and code snippets.

## Setup

1. Install dependencies:
```
npm install
```

2. Start the server:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

The server will run on http://localhost:8080

## API Endpoints

### Whiteboard

**POST /whiteboard**

Accepts whiteboard data including the image, shapes, and query.

Request body:
```json
{
  "image": "data:image/png;base64,...", 
  "shapes": [
    {
      "type": "rectangle",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 150,
      "color": "#FF0000"
    }
  ],
  "query": "This is a test drawing of a rectangle"
}
```

Response:
```json
{
  "success": true,
  "message": "Whiteboard data received",
  "timestamp": 1647532091234
}
```

### Code

**POST /code**

Accepts code snippets and queries.

Request body:
```json
{
  "code": "function helloWorld() {\n  console.log('Hello, world!');\n}\n\nhelloWorld();",
  "query": "This is a simple hello world function"
}
```

Response:
```json
{
  "success": true,
  "message": "Code data received",
  "timestamp": 1647532091234
}
```

## Data Storage

All submitted data is stored in JSON files in the following directories:
- Whiteboard data: `./data/whiteboard/`
- Code data: `./data/code/`

## Future Enhancements

- Add AI processing for code analysis
- Add AI processing for whiteboard drawings
- Implement user authentication
- Add database storage instead of file storage
