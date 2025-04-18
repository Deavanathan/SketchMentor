import os
import logging
import google.generativeai as genai
from openai import OpenAI
from groq import Groq

class Config:
    """Configuration class for API keys and clients."""
    
    # API Keys (should be environment variables in production)
    GEMINI_API_KEY = "AIzaSyATN9rdEWavfKDmknDsczcoES0lhqN5HF0"
    OPENROUTER_API_KEY = "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"
    GROQ_API_KEY = "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"  # Add your Groq API key
    
    # Model names
    QWEN_MODEL = "qwen/qwen2.5-vl-72b-instruct:free"
    GROQ_MODEL = "deepseek-r1-distill-llama-70b"
    
    @classmethod
    def setup_logging(cls):
        """Configure logging for the application."""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler("agentic_flow.log"),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    @classmethod
    def initialize_clients(cls):
        """Initialize and return API clients."""
        # Set up Gemini clients
        genai.configure(api_key=cls.GEMINI_API_KEY)
        gemini_flash_model = genai.GenerativeModel("gemini-2.0-flash-thinking-exp-01-21")
        gemini_learn_model = genai.GenerativeModel("learnlm-1.5-pro-experimental")
        
        # Set up OpenRouter client for Qwen
        openrouter_client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=cls.OPENROUTER_API_KEY,
        )
        
        # Set up Groq client
        groq_client = Groq(api_key=cls.GROQ_API_KEY)
        
        return gemini_flash_model, gemini_learn_model, openrouter_client, groq_client