# router.py
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from Controller.controller import SkethMentorController

router = APIRouter(prefix="/math")

class ProblemRequest(BaseModel):
    problem: str

controller = SkethMentorController()

@router.post("/solve-math-problem")
async def solve_math_problem_endpoint(problem_request: ProblemRequest):
    """
    Endpoint to solve a math problem and return p5.js code.

    Request Body:
        problem (str): The math problem to solve.

    Returns:
        dict: JSON response with the key "code" containing the p5.js code.

    Raises:
        HTTPException: 500 if an error occurs.
    """
    try:
        code = controller.solve_math_problem(problem_request.problem)
        return {"code": code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-video")
async def generate_video_endpoint(problem_request: ProblemRequest, request: Request):
    """
    Endpoint to generate a visualization video for a math problem.

    Request Body:
        problem (str): The problem description to visualize.

    Returns:
        dict: JSON response with "video_path" (URL) and "status".

    Raises:
        HTTPException: 500 if an error occurs.
    """
    try:
        scheme = request.url.scheme 
        host = request.url.netloc   
        result = controller.generate_video(problem_request.problem, host, scheme)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/generate-visual")
async def generate_visual_endpoint(problem_request: ProblemRequest, request: Request):
    """
    Endpoint to generate a visualization video for a math problem.

    Request Body:
        problem (str): The problem description to visualize.

    Returns:
        dict: JSON response with "video_path" (URL) and "status".

    Raises:
        HTTPException: 500 if an error occurs.
    """
    try:
        scheme = request.url.scheme  
        host = request.url.netloc    
        code = controller.generate_visual(problem_request.problem, host, scheme)
        return {"code": code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/general-agent")
async def generalAgent_endpoint(problem_request: ProblemRequest):
    """
    Endpoint to solve a math problem and return p5.js code.

    Request Body:
        problem (str): The math problem to solve.

    Returns:
        dict: JSON response with the key "code" containing the p5.js code.

    Raises:
        HTTPException: 500 if an error occurs.
    """
    try:
        response = controller.generalAgent(problem_request.problem)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/code-agent")
async def codeAgent_endpoint(problem_request: ProblemRequest):
    """
    Endpoint to solve a math problem and return p5.js code.

    Request Body:
        problem (str): The math problem to solve.

    Returns:
        dict: JSON response with the key "code" containing the p5.js code.

    Raises:
        HTTPException: 500 if an error occurs.
    """
    try:
        response = controller.CodeAgent(problem_request.problem)
        return {"code": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/canvas-agent")
async def canvasAgent_endpoint(problem_request: ProblemRequest):
    """
    Endpoint to solve a math problem and return p5.js code.

    Request Body:
        problem (str): The math problem to solve.

    Returns:
        dict: JSON response with the key "code" containing the p5.js code.

    Raises:
        HTTPException: 500 if an error occurs.
    """
    try:
        image_path = "D:\SketchMentor\Backend\MathAI\Assets\canvas.png"
        response = controller.CanvasAgent(problem_request.problem, image_path)
        return {"code": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))