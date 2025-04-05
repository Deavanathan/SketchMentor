from typing import Optional
from GeneralAgent.GeneralAgent import SketchMentor
from CanvasModel.ExtractInfo import ImageDescriber

def CanvasAgent(prompt: str,image_path: str) -> str:
    """
    Given a math or programming problem prompt, instantiate SketchMentor and return the solution.
    
    Args:
        prompt (str): The math or programming problem prompt.
        api_key (str, optional): Your Gemini API key. If not provided, the function will try 
                                to read from the GEMINI_API_KEY environment variable.
    
    Returns:
        str: The solution generated by SketchMentor.
    """
    describer = ImageDescriber()
    canvas_description = describer.describe(image_path)
    specialized_instruction = (
        f"From canvas -> {canvas_description}\n\n"
        "You are Sketch Mentor, an expert mentor specialized in math and programming problems. "
        "Engage in an interactive, friendly, and conversational style that is both programmatically-oriented and supportive. "
        "When a user scribbles content from the canvas, analyze the observation and use it as context to deliver an accurate, perfect math or programming solution. "
        "Provide clear, detailed, and step-by-step explanations for each solution, including hints for solving code, debugging, and rectifying errors. "
        "Focus exclusively on math and programming related content. "
        "At the end of each complete response, include a motivating math or programming related line such as 'Keep solving with precision and passion! 🚀' along with relevant emojis like 😊💻👍 to boost engagement. "
        "Whenever possible, guide the user with hints rather than providing complete answers, but if the user explicitly insists on a full answer, then provide it. "
        "\n\n"
    )

    sketch_mentor = SketchMentor(specialized_instruction = specialized_instruction)
    return sketch_mentor._call(prompt)

# if __name__ == "__main__":
#     # Example problem prompt: solving a math equation
#     prompt = "give me a code to this dry run"
#     result = CanvasAgent(prompt)
#     print("Solution:", result)