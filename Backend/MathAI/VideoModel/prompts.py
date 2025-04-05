PROMPTS = {
    "prompt_analysis": """You are a mathematical concept parser specializing in advanced animations. 
From the following text, extract the key mathematical concepts, equations, theorems, or problems that need to be visualized in an animated video without voice, relying solely on visual elements. 
Prioritize the core mathematical idea and, for complex concepts, break them down into fundamental components for clarity. 
Additionally, identify any specific visualization requests (e.g., styles, pacing) or constraints (e.g., time limits, Manim features) mentioned. 
Format the output as a clear, detailed description of what needs to be animated, using mathematical elements and techniques, and organize multiple concepts logically if present.

TEXT TO ANALYZE: '{prompt}'

CONCEPT TO ANIMATE:""",

    "math_verification": """You are a mathematical animation expert with deep knowledge of advanced mathematics. 
Analyze the following concept for animation without voice, using only visual elements: '{concept}'

Perform the following:
1. Confirm if this concept can be effectively visualized in a 2D animated video using Manim, considering its capabilities (e.g., limited 3D support).
2. Validate the mathematical accuracy of the concept; highlight any errors or misrepresentations with detailed feedback.
3. Suggest simplifications or modifications to enhance its suitability for animation while preserving its core meaning.

If suitable, return the verified concept with corrections. If not, explain why and propose alternative visual representations.

VERIFIED CONCEPT:""",

    "visualization_spec": """You are an expert in crafting mathematical animations with Manim for advanced concepts. 
For the concept: '{concept}', develop a detailed specification for an animated video without voice, using only Manim’s visual capabilities.

Include:
1. A sequence of animation steps, organized into logical scenes or sections, with approximate durations for pacing.
2. For each step, detail:
   - Mathematical objects to create (e.g., equations, graphs, shapes, vectors) and their initial positions to stay within the screen (-7 < x < 7, -4 < y < 4), avoiding unintended overlaps. Ensure all objects are positioned with a small margin from the edges (e.g., x between -6.5 and 6.5, y between -3.5 and 3.5) to prevent clipping.
   - Transformations to apply (e.g., appear, transform, move, highlight), including how to fade out or remove prior objects to manage space and maintain clarity. When planning movements, ensure objects do not move outside the visible frame or overlap confusingly.
   - Colors, styles, and positioning for visibility and aesthetic appeal. For multiple objects, use alignment techniques to arrange them neatly without overlapping.
3. Ensure step-by-step progression that clearly conveys the concept. Plan the layout carefully to prevent crowding, using techniques like staggering the appearance of objects or using different areas of the screen for different parts of the concept.
4. Specify special effects or techniques (e.g., zooming, coordinate systems, 3D if applicable) that are reliable in Manim. For 3D visualizations, carefully choose the camera angle and object positions to ensure all important parts are visible within the 2D projection.
5. Suggest timing/pacing for complex elements to keep viewers engaged.
6. Guarantee all objects remain within the visible frame and avoid obscuring overlaps. For long equations or text, consider breaking them into multiple lines or scaling them down to fit within the screen width. For graphs, set the x and y ranges appropriately so that all important features are within the visible frame.

Use only well-documented, reliable Manim features.

ANIMATION SPECIFICATION:""",

    "code_structure": """You are a Manim expert programmer specializing in advanced mathematical visualizations. 
Based on the animation specification: '{specification}'

Create a detailed outline for a Python script using Manim. The structure must:
1. List all required imports (e.g., Manim, math libraries).
2. Organize the animation into Scene classes (use multiple scenes for complex concepts).
3. Define helper methods for repeated calculations or object creation to enhance reusability.
4. Structure code to efficiently handle complex calculations or transformations.
5. Set up coordinate systems, 3D spaces, or special visualizations as needed.
6. Include clear, concise comments for maintainability.
7. Adhere to Manim best practices (e.g., using VMobject, VGroup for grouping, optimizing rendering).
8. Ensure UTF-8 encoding compatibility for Unicode characters when saving the file.
9. Plan the scene layout to ensure all elements fit within the screen and do not overlap obstructively.

Focus on maintainable, error-free code without voice-over functionality.

CODE STRUCTURE:""",

    "code_generation": """You are an expert Manim programmer focused on error-free animations for advanced mathematics. 
Using the provided code structure, generate a complete, runnable Python script that:
1. Correctly implements all Manim classes, methods, and calculations.
2. Employs suitable Manim features for each visualization component.
3. Formats mathematical expressions with proper LaTeX syntax (e.g., '\\\\' for escapes).
4. Includes robust error handling for complex operations.
5. Provides detailed comments explaining mathematical and animation logic.
6. Ensures smooth timing and sequencing of animations.
7. Optimizes performance (e.g., precompute values, use rate_func for smooth transitions).
8. Positions all objects within screen boundaries (-7 < x < 7, -4 < y < 4), avoiding unintended overlaps. Use precise positioning methods like `shift`, `move_to`, or `next_to` to place objects accurately, leaving a small margin from the edges to prevent clipping.
9. Manages object visibility with FadeOut or ReplacementTransform to prevent clutter. When introducing new elements, consider fading out or removing previous elements to keep the scene uncluttered.
10. For text or equations that are too wide, use `scale` to reduce their size or break them into multiple lines using `\\` in LaTeX. When creating axes, use `x_range` and `y_range` to ensure the plot fits within the screen. Use `rate_func` to control animation speed, ensuring moving objects stay within the frame. Optionally, include a temporary rectangle or grid to visualize screen boundaries during development, removed for the final render.

**Guidelines:**
- Use explicit coordinates/calculations for precision.
- Avoid deprecated Manim features (refer to latest docs).
- Include fallbacks for complex operations.
- Ensure proper indentation and style.
- Save files with `encoding='utf-8'` for Unicode support.

Code Structure:
{code_struct}

Final Python Code:""",

    "code_testing": """You are a Manim testing expert. Analyze the following code for potential runtime errors, logical flaws, or incorrect API usage. 

Check for:
1. Incorrect parameter types/names in Manim functions.
2. Missing or wrong imports.
3. LaTeX formatting errors (e.g., unescaped backslashes).
4. Mathematical calculation errors (e.g., division by zero).
5. Animation sequencing/timing issues disrupting flow.
6. Performance bottlenecks in complex visualizations.
7. Misuse of advanced features (e.g., 3D, shaders).
8. Objects outside the screen (-7 < x < 7, -4 < y < 4) or obscuring overlaps.
9. Failure to fade out/remove old objects, causing clutter.
10. Unpositioned objects defaulting to the origin.
11. Hard-coded coordinates beyond the visible frame.
12. Verify that all objects are positioned intentionally and do not overlap in a way that hinders understanding. Test the animation by rendering partial scenes or using `manim --preview` to check if all objects are within the frame and do not overlap obstructively.

Also, confirm the animation logically represents the concept.

Code to test:
{code}

For each issue:
1. Specify the line/section.
2. Describe the problem.
3. Provide a fix.

If none, return "CODE PASSES TESTING".

TESTING RESULTS:""",

    "code_optimization": """You are a Manim optimization expert. Enhance the following code for performance, readability, and reliability without altering its core functionality.

Focus on:
1. Eliminating redundant calculations (e.g., caching results).
2. Boosting animation performance (e.g., VGroup, rate_func, minimal updates).
3. Improving readability with modular functions/classes and docstrings.
4. Adding error handling for runtime issues.
5. Ensuring mathematical precision.
6. Reducing rendering time/memory usage.
7. Optimizing object positions to avoid overlaps and stay within screen (-7 < x < 7, -4 < y < 4). Optimize positions to maximize use of screen space without crowding.
8. Enhancing visibility management (e.g., FadeOut, ReplacementTransform). Optimize the use of `add` and `remove` methods to minimize the number of objects on screen at any time.

Code to optimize:
{code}

Return the optimized code with comments on key improvements.

OPTIMIZED CODE:""",

    "error_diagnosis": """You are a Manim debugging expert. Diagnose the following error from running Manim code:

Error message:
{error}

Code that produced it:
{code}

Provide:
1. A detailed explanation of the error’s cause, considering Manim version/context.
2. The exact code location of the issue.
3. A specific fix.
4. Tips to avoid similar errors (e.g., check LaTeX, test partial renders). Check if the error is related to objects being positioned outside the visible frame or overlapping in a way that causes rendering issues.

Suggest debugging strategies like `manim --preview` for troubleshooting.

DIAGNOSIS AND FIX:""",

    "fallback_generation": """You are a Manim expert programmer. The original code for '{concept}' failed. Create a simplified, reliable Python script that:
1. Uses basic Manim techniques (e.g., Tex, MathTex, Dot, Line, FadeIn/FadeOut).
2. Visualizes only the core concept, simplifying complex elements.
3. Includes extensive error handling (e.g., try-except for LaTeX/animations).
4. Relies on explicit calculations, avoiding advanced features.
5. Uses conservative LaTeX formatting.
6. Ensures objects stay within screen (-7 < x < 7, -4 < y < 4) without overlap. Ensure all elements in the fallback animation are clearly visible within the screen boundaries and do not overlap.
7. Manages visibility with FadeOut/Removal for clarity.

Prioritize error-free execution over full detail.

RELIABLE FALLBACK CODE:""",

    "validation_consensus": """You are assessing a Manim code implementation for correctness and reliability. Review the code and answer:

1. Does it accurately implement the mathematical concept? Cite examples if inaccurate.
2. Are Manim methods/functions used correctly? Note misuse with line numbers.
3. Is the animation sequence logical and clear?
4. Are there potential runtime errors/exceptions? Specify risks.
5. Is the code well-structured and maintainable (comments, organization)?
6. Does it handle complex calculations/transformations accurately?
7. Is it optimized for performance?
8. Are objects within screen (-7 < x < 7, -4 < y < 4) without obscuring overlaps? Is the layout of objects clear and well-organized, making effective use of the available screen space?
9. Does it manage visibility to avoid clutter?
10. Does it offer good educational value/user experience? Verify that during the animation, at no point do objects move outside the visible area or overlap in a confusing manner.

Code to validate:
{code}

Answer YES/NO with explanations and examples/line numbers where applicable.

VALIDATION RESULTS:"""
}