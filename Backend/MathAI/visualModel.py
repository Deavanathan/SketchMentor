import logging
import os
import subprocess
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("video-generator")

def generate_video(problem: str, host: str = "localhost:8001", scheme: str = "http"):
    """
    Generates a visualization video for the given problem description.
    
    Parameters:
        problem (str): The problem description to visualize.
        host (str): The hostname used for constructing the video URL.
        scheme (str): The URL scheme (e.g. "http" or "https").
    
    Returns:
        dict: A dictionary with keys "video_path" (the URL to the video) and "status"
              indicating whether the operation was a success or a fallback.
    """
    logger.info(f"Received video generation request for problem: {problem}")
    try:
        # Import the pipeline components
        from VisualModel.pipeline import AgenticPipeline
        # Optionally, import prompts if needed:
        # from AI_MATH_AGENT.VideoModel.prompts import PROMPTS
        
        pipeline = AgenticPipeline()
        pipeline_result = pipeline.run(problem)
        
        if pipeline_result["status"] not in ["success", "fallback"]:
            logger.error(f"Pipeline failed with status: {pipeline_result['status']}")
            raise Exception("Pipeline failed to generate code.")
        
        file_name = f"visual.js"
        file_path = os.path.join(os.getcwd(), file_name)
        
        logger.info(f"Writing generated code to {file_path}")
        with open(file_path, "w") as f:
            f.write(pipeline_result["code"])
        return pipeline_result["code"]
    
    except Exception as e:
        logger.error(f"Error in generating code: {str(e)}")
        return None

if __name__ == "__main__":
    # Example usage:
    problem_input = input("Enter a problem description: ")
    result = generate_video(problem_input)
    print("Video generation result:", result)
