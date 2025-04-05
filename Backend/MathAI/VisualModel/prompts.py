PROMPTS = {
    "prompt_analysis": """You are a mathematical and programming concept parser for interactive visualizations. 
From the following text, extract the key mathematical concepts, equations, theorems, programming problems, or logical questions that need to be visualized interactively using p5.js. 
Also, note any specific visualization requests or constraints mentioned. 
Format the output as a clear, detailed description of what needs to be visualized, emphasizing interactive elements. 
For complex concepts, break them down into fundamental components that can be interacted with.

TEXT TO ANALYZE: '{prompt}'

CONCEPT TO VISUALIZE INTERACTIVELY:""",
    
    "math_verification": """You are an expert in interactive visualizations with deep knowledge of advanced mathematics and programming. 
Analyze the following concept for interactive visualization using p5.js: '{concept}'

Please do three things:
1. Verify if this concept can be effectively visualized interactively using p5.js
2. Check if the mathematical or programming concept is correctly stated or if there are any errors
3. Suggest any simplifications or modifications to make it more suitable for interactive visualization

If the concept is suitable, return the verified concept with any necessary corrections. 
If not, explain why and suggest alternatives.

VERIFIED CONCEPT:""",
    
    "visualization_spec": """You are an expert in creating interactive visualizations with p5.js for advanced mathematical and programming concepts. 
For the concept: '{concept}', create a detailed specification for an interactive visualization using p5.js.

Include:
1. A description of the interactive elements and how users can interact with the visualization (e.g., sliders, buttons, mouse interactions, keyboard inputs)
2. Specify what mathematical or programming objects to display (equations, graphs, geometric shapes, data structures, etc.) and their initial states
3. Describe how these objects change or respond to user interactions
4. Suggest visual styles, colors, and layouts that enhance understanding and engagement
5. Ensure that the visualization is clear and that interactive elements do not obscure the content
6. If applicable, include any animations that occur in response to interactions or over time
7. Consider the use of text or labels to explain parts of the visualization
8. Ensure that the visualization is responsive and works well on different screen sizes

Use only p5.js features and techniques that are well-documented and reliable.

INTERACTIVE VISUALIZATION SPECIFICATION:""",
    
    "code_structure": """You are a p5.js expert programmer specializing in interactive visualizations for advanced mathematical and programming concepts. 
Based on the interactive visualization specification: '{specification}'

Create a detailed outline for a p5.js sketch that implements the interactive visualization. The structure should:
1. Define all necessary global variables and constants
2. Outline the setup() function, including canvas creation, initial object setups, and any preload() if needed
3. Outline the draw() function, specifying what gets drawn each frame and how it responds to interactions
4. Include any additional functions for handling specific interactions (e.g., mousePressed(), keyPressed())
5. Structure the code to handle any complex calculations or data processing
6. Ensure proper use of p5.js features for interactivity and animation
7. Include comments for clarity

Your outline should be comprehensive but focus on creating maintainable, error-free code that follows p5.js best practices.

CODE STRUCTURE:""",
    
    "code_generation": """You are an expert p5.js programmer specializing in creating error-free interactive visualizations for advanced mathematical and programming concepts. 
Based on the provided code structure, generate a complete, runnable p5.js sketch that:
1. Implements all necessary p5.js functions and calculations correctly
2. Uses appropriate p5.js features for each visualization component
3. Formats all text and mathematical expressions correctly (note that p5.js uses HTML5 canvas, so mathematical expressions might need to be rendered using libraries like MathJax if necessary)
4. Includes robust error handling for complex operations
5. Provides clear, detailed comments explaining the implementation
6. Ensures smooth interactivity and responsiveness
7. Optimizes performance for complex visualizations
8. Ensures that all visual elements are positioned within the canvas and do not overlap in a way that obscures the content
9. Manages the visibility of elements appropriately to avoid clutter

IMPORTANT GUIDELINES:
- Use p5.js's built-in functions for drawing and interaction
- Handle user inputs correctly (mouse, keyboard, etc.)
- Use variables and functions to organize code
- Avoid global variables when possible, use let and const appropriately
- Ensure proper indentation and code style
- Use p5.js's positioning and transformation functions to place objects accurately
- Consider using p5.js's push() and pop() for managing drawing states

Code Structure:
{code_struct}

Final p5.js Code:""",
    
    "code_testing": """You are a p5.js testing expert. Analyze the following code for potential runtime errors, logical issues, or incorrect p5.js API usage.

Focus on these common issues:
1. Incorrect function names or parameters in p5.js functions
2. Missing or incorrect variable declarations
3. Errors in mathematical calculations or logic
4. Issues with event handling (e.g., mousePressed, keyPressed)
5. Potential performance problems with complex drawings or calculations in draw()
6. Incorrect use of p5.js features (e.g., wrong coordinate systems, misuse of angles)
7. Elements drawn outside the canvas or overlapping in a way that obscures the content
8. Failure to update or reset states properly in interactive elements
9. Hard-coded values that might not work on different screen sizes
10. Syntax errors or JavaScript-specific issues (e.g., == vs ===)

Code to test:
{code}

For each issue found, provide:
1. The specific line or section with the issue
2. What the problem is
3. How to fix it

If no issues are found, respond with "CODE PASSES TESTING".

TESTING RESULTS:""",
    
    "code_optimization": """You are a p5.js optimization expert. Analyze and improve the following code for better performance, readability, and reliability without changing its core functionality.

Focus on:
1. Reducing redundant calculations, especially in draw()
2. Improving drawing performance (e.g., minimizing draw calls, using buffers if necessary)
3. Enhancing code readability and structure (e.g., using functions, avoiding global variables)
4. Adding appropriate error handling and input validation
5. Ensuring mathematical accuracy in calculations
6. Optimizing for frame rate and responsiveness
7. Optimizing the positioning of elements to prevent overlaps and ensure they stay within the canvas
8. Improving the management of element visibility and state to reduce clutter and enhance clarity

Code to optimize:
{code}

Provide the optimized code version with comments explaining key optimizations.

OPTIMIZED CODE:""",
    
    "error_diagnosis": """You are a p5.js debugging expert. Analyze the following error that occurred when running the p5.js sketch:

Error message:
{error}

Code that produced the error:
{code}

Please provide:
1. A detailed explanation of what caused the error
2. The exact location in the code where the error occurred
3. A specific fix for the issue
4. Any additional recommendations to prevent similar errors

DIAGNOSIS AND FIX:""",
    
    "fallback_generation": """You are a p5.js expert programmer. The original code for the concept '{concept}' encountered issues. Create a simplified, ultra-reliable p5.js sketch that:

1. Uses only the most basic and proven p5.js functions
2. Focuses on visualizing just the core aspects of the concept
3. Includes extensive error handling and checks
4. Uses explicit calculations and avoids complex libraries or features
5. Ensures that all visual elements are positioned within the canvas and do not overlap
6. Manages visibility and state simply to avoid clutter

Prioritize creating code that will run without errors over implementing all details of the original concept.

RELIABLE FALLBACK CODE:""",
    
    "validation_consensus": """You are evaluating a p5.js code implementation for correctness and reliability. Review the code carefully and answer the following questions:

1. Does the code correctly implement the mathematical or programming concept?
2. Are all p5.js functions and methods used correctly?
3. Is the interactive visualization logical and clear?
4. Are there any potential runtime errors or exceptions?
5. Is the code well-structured and maintainable?
6. Does the code handle user interactions and state changes properly?
7. Is the code optimized for performance, especially in the draw() loop?
8. Are all visual elements positioned within the canvas and do not overlap in a way that obscures the content?
9. Does the code properly manage the visibility and state of elements to avoid clutter?

Code to validate:
{code}

Respond with YES or NO to each question, followed by a brief explanation.

VALIDATION RESULTS:"""
}