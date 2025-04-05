from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import uvicorn
from VisualModel.pipeline import AgenticPipeline
from VisualModel.config import Config
from VisualModel.utils import clean_code_response

app = FastAPI()

# Add CORS middleware with specific origins for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup logging and initialize clients on startup
logger = Config.setup_logging()
logger.info("Starting the agentic visualization system.")

gemini_flash_model, gemini_learn_model, openrouter_client = Config.initialize_clients()
qwen_model = Config.QWEN_MODEL
logger.info("API clients initialized successfully.")

# Create pipeline
pipeline = AgenticPipeline(gemini_flash_model, gemini_learn_model, openrouter_client, qwen_model)
logger.info("Agentic pipeline created.")

# Request model
class VisualizationRequest(BaseModel):
    prompt: str

class VisualizationResponse(BaseModel):
    generated_code: str
    # Optional: include these if desired
    # test_cases: str
    # documentation: str

@app.post("/generateVisual", response_model=VisualizationResponse)
def generate_visualization(request: VisualizationRequest):
    logger.info(f"Processing user prompt: {request.prompt}")
    try:
        result = pipeline.run(request.prompt)
        if result["status"] == "success":
            code = result["code"]
            test_cases = result["test_cases"]
            documentation = result["documentation"]
            logger.info("Generated Code:\n%s", code)
            logger.info("Test Cases:\n%s", test_cases)
            logger.info("Documentation:\n%s", documentation)
            return VisualizationResponse(generated_code=code)
        else:
            error_message = result["error_message"]
            logger.error(f"Pipeline error: {error_message}")
            raise HTTPException(status_code=400, detail=error_message)
    except Exception as e:
        logger.error(f"Error in generating code: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))