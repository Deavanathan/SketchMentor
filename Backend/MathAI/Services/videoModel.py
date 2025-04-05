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
        from ..VideoModel.pipeline import AgenticPipeline
        
        pipeline = AgenticPipeline()
        pipeline_result = pipeline.run(problem)
        
        if pipeline_result["status"] not in ["success", "fallback"]:
            logger.error(f"Pipeline failed with status: {pipeline_result['status']}")
            raise Exception("Pipeline failed to generate code.")
        
        unique_id = uuid.uuid4().hex[:8]
        file_name = f"manim_visualization_{unique_id}.py"
        file_path = os.path.join(os.getcwd(), file_name)
        
        logger.info(f"Writing generated code to {file_path}")
        with open(file_path, "w") as f:
            f.write(pipeline_result["code"])
        
        scene_name = "VisualizationVideo"
        manim_command = ["manim", "-pql", file_path, scene_name]
        logger.info(f"Running Manim command: {' '.join(manim_command)}")
        
        proc_result = subprocess.run(manim_command, capture_output=True, text=True)
        if proc_result.returncode != 0:
            logger.error(f"Manim command failed with error: {proc_result.stderr}")
            raise Exception(f"Manim error: {proc_result.stderr}")
        
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        quality = "480p15"
        output_dir = os.path.join("media", "videos", base_name, quality)
        output_file = os.path.join(output_dir, f"{scene_name}.mp4")
        
        if not os.path.exists(output_file):
            logger.error(f"Output video file not found at: {output_file}")
            expected_dir = os.path.join(os.getcwd(), "media", "videos", base_name)
            if os.path.exists(expected_dir):
                for root, dirs, files in os.walk(expected_dir):
                    for file in files:
                        if file.endswith(".mp4"):
                            found_file = os.path.join(root, file)
                            logger.info(f"Found video at: {found_file}")
                            relative_path = os.path.relpath(found_file, os.path.join(os.getcwd(), "media"))
                            output_file = os.path.join("media", relative_path)
                            break
            else:
                logger.error(f"Expected directory not found: {expected_dir}")
                raise Exception("Video generation failed - output file not found")
        
        video_url = f"{scheme}://{host}/{output_file}"
        logger.info(f"Video generated successfully at: {video_url}")
        
        try:
            os.remove(file_path)
        except Exception as e:
            logger.warning(f"Could not remove temporary file {file_path}: {str(e)}")
        
        return {"video_path": video_url, "status": pipeline_result["status"]}
    
    except Exception as e:
        logger.exception(f"Error in video generation: {str(e)}")
        fallback_video = "videos/manim_visualization_181bc014/480p15/ReliableQuadraticVisualization.mp4"
        fallback_video_path = f"{scheme}://{host}/media/{fallback_video}"
        logger.info(f"Returning fallback video at: {fallback_video_path}")
        return {"video_path": fallback_video_path, "status": "fallback"}

# if __name__ == "__main__":
#     # Example usage:
#     problem_input = input("Enter a problem description: ")
#     result = generate_video(problem_input)
#     print("Video generation result:", result)
