from Services.solveModel import solve_math_problem
from Services.videoModel import generate_video
from Services.visualModel import generate_visual
from Services.CodeAgent import CodeAgent
from Services.GeneralAgent import GeneralAgent
from Services.CanvasAgent import CanvasAgent

class SkethMentorController:
    def solve_math_problem(self, problem: str) -> str:

        try:
            return solve_math_problem(problem)
        except Exception as e:
            raise Exception(f"Error solving math problem: {str(e)}")

    def generate_video(self, problem: str, host: str, scheme: str) -> dict:
        
        try:
            return generate_video(problem, host, scheme)
        except Exception as e:
            raise Exception(f"Error generating video: {str(e)}")

    def generate_visual(self, problem: str, host: str, scheme: str) -> dict:
        
        try:
            return generate_visual(problem, host, scheme)
        except Exception as e:
            raise Exception(f"Error generating video: {str(e)}")

    def generalAgent(self, prompt: str) -> dict:
        
        try:
            return GeneralAgent(prompt)
        except Exception as e:
            raise Exception(f"Error generating General Agent: {str(e)}")
        
    def CodeAgent(self, prompt: str) -> dict:
        
        try:
            return CodeAgent(prompt)
        except Exception as e:
            raise Exception(f"Error generating code Agent: {str(e)}")
    
    def CanvasAgent(self, prompt: str,image_path: str) -> dict:
        
        try:
            return CanvasAgent(prompt,image_path=image_path)
        except Exception as e:
            raise Exception(f"Error generating code Agent: {str(e)}")
    