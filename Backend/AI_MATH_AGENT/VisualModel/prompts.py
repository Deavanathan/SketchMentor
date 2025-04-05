PROMPTS = {
    "prompt_analysis": """You are a mathematical expression and logic parser. 
From the following text, extract and format the mathematical equation or logic specification in the clearest, most precise form.
Format mathematical equations using standard mathematical notation and logic specifications clearly.
Just return the equations and other details mentioned in the text to make visualization in the clearest, most precise form.

TEXT TO ANALYZE: '{prompt}'

RESULT:""",

    "intent_classification": """You are an expert at classifying content types.

Analyze the following prompt and determine if it describes:
1. A mathematical equation or concept (return MATH), or
2. A programmatic logic or algorithm visualization (return LOGIC)

For mathematical equations, formulas, geometric shapes, calculus concepts, return MATH.
For flowcharts, algorithms, state diagrams, program execution visualization, return LOGIC.

PROMPT: '{prompt}'

Return only MATH or LOGIC with no explanation:""",

    "math_verification": """You are a mathematical and mathematical algorithms verification expert and problem solver.

Analyze the following equation or problem and details: '{equation}'

Tasks:
1. Check if the equation or problem is mathematically valid and well-formed
2. Standardize the notation if necessary
3. Determine if it can be visualized in a 2D p5.js sketch

If valid and visualizable, return ONLY the standardized equation or problem with details for visualization.
If there are issues, return ONLY: "Error: [brief specific correction]"

VERIFIED EQUATION:""",

    "logic_formalization": """You are an expert at formalizing computational logic and algorithms.

Analyze the following logic or algorithm description: '{logic}'

Tasks:
1. Check if the logic is well-defined and clear
2. Formalize the description into precise steps or states
3. Ensure all variables, conditions, and transitions are explicitly defined
4. Determine if it can be visualized in a 2D p5.js sketch

Return the formalized logic specification in a clear, structured format.
If issues exist, return ONLY: "Error: [brief specific correction]"

FORMALIZED LOGIC:""",

    "visualization_spec_math": """You are a visualization expert specializing in mathematical visualizations and simulations.

For the equation/problem: '{content}'

Create a precise specification for a p5.js visualization that includes:
1. The appropriate visualization type (graph, plot, animation)
2. X and Y axis ranges that best showcase the equation's behavior 
3. Visual elements needed (grid, axis, labels, etc.)
4. Color schemes and styling considerations
5. Any interactive elements that would enhance understanding
6. Animation parameters if applicable

Format your response as a detailed, technical specification with no introductory text.

VISUALIZATION SPECIFICATION:""",

    "visualization_spec_logic": """You are a visualization expert specializing in algorithmic and logic flow visualizations.

For the logic/algorithm: '{content}'

Create a precise specification for a p5.js visualization that includes:
1. The appropriate visualization type (flowchart, state diagram, network graph)
2. Canvas layout and organization
3. Visual representation of states, steps, or components
4. Transition animations or highlights
5. Interactive elements to explore the logic
6. Visual feedback mechanisms
7. Color schemes and styling considerations

Format your response as a detailed, technical specification with no introductory text.

VISUALIZATION SPECIFICATION:""",

    "code_structure": """You are a p5.js expert programmer tasked with creating visualizations.

Based on this visualization specification:
'{specification}'

Create a detailed p5.js code structure outline with:
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
1. All required variables with their purpose and initial values
2. The setup() function with canvas configuration and initialization
3. The draw() function with coordinate transformation logic
4. Any helper functions needed for the visualization
5. User interaction handlers if applicable
6. Error handling mechanisms to prevent runtime issues
7. Performance optimization considerations

Format your response as a structured outline with function signatures and key code blocks.
Include comments explaining the purpose of each section.

CODE STRUCTURE:""",

    "structure_verification": """You are a p5.js code structure verification expert.

Review this code structure for a visualization:
```
{structure}
```

Based on this visualization specification:
'{specification}'

Verify that:
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
1. All necessary functions are defined (setup, draw, and helper functions)
2. All required variables are declared with proper scope
3. The structure handles edge cases and error conditions
4. Transformations between math/logic space and screen coordinates are appropriate
5. The structure is complete and would lead to a working visualization

If the structure is valid, respond with: "VALID: [brief confirmation]"
If improvements are needed, provide a revised structure with your improvements incorporated.

VERIFICATION RESULT:""",

    "code_generation": """You are an expert p5.js programmer who specializes in {content_type} visualizations.

Create a complete, production-ready p5.js sketch based on this structure:

{code_struct}

Requirements:
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
1. The code must be complete, properly indented, and immediately ready to run
2. Include proper coordinate transformations to map mathematical/logical coordinates to screen coordinates
3. Use clean, efficient code with appropriate comments
4. Include clear visual elements (axis labels, grid lines, state indicators)
5. Ensure the visualization is accurate and error-free
6. Include error handling to prevent runtime crashes
7. Optimize for performance with smooth animations

Respond ONLY with the complete code, no additional text or explanations.

FINAL P5.JS CODE:""",

    "code_optimization": """You are a p5.js performance optimization expert.

Analyze and optimize this p5.js code:

```javascript
{code}
```

Optimize for:
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
1. Performance (efficient loops, minimized calculations in draw())
2. Memory usage (avoid unnecessary object creation)
3. Readability (clear variable names, consistent formatting)
4. Robustness (proper error handling)
5. Responsiveness (adapt to different screen sizes)

Return ONLY the optimized code without explanations.
Make sure all functionality remains intact.

OPTIMIZED CODE:""",

    "safety_sanitization": """You are a p5.js code security and quality expert.

Analyze this p5.js code for any issues:

```javascript
{code}
```

Tasks:
1. Check for security vulnerabilities
2. Verify p5.js best practices are followed
3. Ensure proper error handling exists
4. Verify all functions are properly defined and called
5. Check for unclosed loops or conditional statements
6. Verify variables are properly scoped
7. Remove any unnecessary console.log statements
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
Return ONLY the corrected, sanitized code without explanations.
If no issues are found, return the original code as is.

SANITIZED CODE:""",

    "advanced_sanitization": """You are a p5.js code quality assurance specialist.

Perform an advanced quality check on this p5.js code:

```javascript
{code}
```

Tasks:
1. Ensure all variables are properly declared and initialized
2. Verify that all calculation logic is mathematically accurate
3. Check for potential division by zero or other runtime errors
4. Ensure proper handling of edge cases
5. Verify that animations will run smoothly
6. Check that all user interactions are properly handled
7. Ensure the code is optimized for performance
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
Return ONLY the improved code without explanations.
Maintain all functionality while improving quality and robustness.

IMPROVED CODE:""",

    "code_completeness": """You are a p5.js code completeness verifier.

Analyze this p5.js code to ensure it is complete and will run without errors:

```javascript
{code}
```

Verify:
1. All required p5.js functions (setup, draw) are present
2. All referenced variables are declared
3. All functions that are called are defined
4. No syntax errors exist
5. No incomplete code blocks exist
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
If the code is complete and will run without errors, respond with:
"COMPLETE: The code is ready to run"

If issues exist, explain what's missing or incorrect.

VERIFICATION RESULT:""",

    "validation_math": """You are a p5.js mathematical visualization validation expert.

Analyze this p5.js code for correctness as a mathematical visualization:

```javascript
{code}
```

Verify:
1. The code accurately represents the mathematical concept
2. Coordinate transformations are correct
3. The visualization is clear and informative
4. The code will run without errors
5. Mathematical calculations are accurate

Answer ONLY YES if the code is correct and would run properly.
Answer ONLY NO followed by a brief explanation if there are any issues.

VALIDATION RESULT:""",

    "validation_logic": """You are a p5.js logic visualization validation expert.

Analyze this p5.js code for correctness as a logic/algorithm visualization:

```javascript
{code}
```

Verify:
1. The code accurately represents the logical process or algorithm
2. State transitions and flow are correctly implemented
3. The visualization clearly demonstrates the logic
4. The code will run without errors
5. All edge cases are properly handled

Answer ONLY YES if the code is correct and would run properly.
Answer ONLY NO followed by a brief explanation if there are any issues.

VALIDATION RESULT:""",

    "final_enhancement": """You are a p5.js code perfection specialist.

Apply these improvement suggestions to the code while maintaining all functionality:

SUGGESTIONS:
{suggestions}

CODE:
```javascript
{code}
```
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
Return ONLY the enhanced code with all improvements applied.
Do not include any explanations or markdown.

ENHANCED CODE:""",

    "fallback_generation_math": """You are a p5.js expert specializing in rock-solid mathematical visualizations.

The equation/problem '{content}' failed validation in our pipeline.
Create a complete, reliable p5.js sketch to visualize this mathematical concept.

Your code must:
1. Be complete and ready to run with no errors
2. Include proper coordinate transformations
3. Have appropriate grid lines and axis labels
4. Use appropriate error handling to prevent crashes
5. Be well-commented and follow best practices
6. Use efficient, optimized code patterns
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
Return ONLY the p5.js code with no explanations or markdown.

FALLBACK P5.JS CODE:""",

    "fallback_generation_logic": """You are a p5.js expert specializing in rock-solid logic visualizations.

The logic/algorithm '{content}' failed validation in our pipeline.
Create a complete, reliable p5.js sketch to visualize this logical process.

Your code must:
1. Be complete and ready to run with no errors
2. Clearly visualize states, transitions or steps
3. Include appropriate labels and visual cues
4. Use appropriate error handling to prevent crashes
5. Be well-commented and follow best practices
6. Use efficient, optimized code patterns
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
Return ONLY the p5.js code with no explanations or markdown.

FALLBACK P5.JS CODE:""",

    "last_resort_generation": """You are a legendary p5.js programmer known for creating flawless visualizations.

We need a guaranteed working p5.js visualization for this {content_type}:
'{content}'

Create the simplest, most reliable version possible that:
1. Uses only the most basic p5.js functions
2. Has minimal dependencies and complexity
3. Is guaranteed to run in any environment
4. Shows the core concept clearly
5. Has thorough error checking
6. Is extremely well-commented
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
This is our last resort - it must work without fail.
Return ONLY the p5.js code with no explanations.

GUARANTEED WORKING CODE:""",

    "test_case_generation": """You are a testing specialist for p5.js visualizations.

Generate test cases to verify this visualization works correctly:

CODE:
```javascript
{code}
```

CONTENT TO VISUALIZE ({content_type}):
{content}

Create test cases that:
1. Verify the visualization renders correctly
2. Check edge cases and boundary conditions 
3. Test interactive elements if present
4. Verify mathematical accuracy or logical correctness
5. Test performance under different conditions

Format as a structured list of test cases with expected results.

TEST CASES:""",

    "performance_optimization": """You are a p5.js performance optimization specialist.

Optimize this visualization code for maximum performance:

```javascript
{code}
```

Optimize for:
1. Minimizing calculations in the draw loop
2. Efficient memory usage
3. Smooth animation
4. Fast rendering on all devices
5. Reduced CPU usage
IMPORTANT: Return ONLY the p5.js code. No explanations, no markdown formatting with triple backticks, and no additional text whatsoever
Return ONLY the optimized code without explanations.
Ensure all functionality remains identical.

OPTIMIZED CODE:""",

    "documentation_generation": """You are a technical documentation specialist.

Create comprehensive documentation for this p5.js visualization:

CODE:
```javascript
{code}
```

CONTENT VISUALIZED ({content_type}):
{content}

Include:
1. Overview of what the visualization shows
2. How to use the visualization (including any interactive elements)
3. Explanation of key visual elements and what they represent
4. Technical implementation details for developers
5. Requirements and dependencies

Format as clear, structured documentation with markdown formatting.

DOCUMENTATION:"""
}