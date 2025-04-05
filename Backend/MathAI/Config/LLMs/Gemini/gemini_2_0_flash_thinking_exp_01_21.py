import os
import google.generativeai as genai
from langchain.llms.base import LLM
from pydantic import Field
from langchain.agents import Tool, AgentType, initialize_agent
from dotenv import load_dotenv
from typing import Optional

class GeminiLLM(LLM):
    """Custom LLM wrapper for Google's Gemini model."""
    
    model: str = Field(default="gemini-2.0-flash-thinking-exp-01-21")
    api_key: str = Field(...)  # Declare api_key as a required field

    def __init__(self, api_key: Optional[str] = None, **kwargs):
        """
        Initialize the Gemini LLM.
        
        Args:
            api_key (str, optional): API key for Gemini. If not provided, looks for GEMINI_API_KEY in environment.
            **kwargs: Additional arguments to pass to the LLM.
        """
        # Load environment variables
        load_dotenv()
        
        # Determine API key: use provided one or load from environment
        key = api_key or os.environ.get("GEMINI_API_KEY")
        if not key:
            raise ValueError("Gemini API key is required. Provide it as an argument or set GEMINI_API_KEY environment variable.")
        
        # Call the parent's __init__ with the API key so that internal fields like __pydantic_extra__ are set
        super().__init__(api_key=key, **kwargs)
        
        # Now configure the genai library with the API key
        genai.configure(api_key=self.api_key)
    
    @property
    def _llm_type(self) -> str:
        """Return type of LLM."""
        return "gemini"
    
    def _call(self, prompt: str, stop=None):
        """
        Call the Gemini model with the given prompt.
        
        Args:
            prompt (str): The prompt to send to the model.
            stop (list, optional): List of stop sequences.
            
        Returns:
            str: The generated text.
        """
        try:
            model_instance = genai.GenerativeModel(self.model)
            response = model_instance.generate_content(prompt)
            return response.text if hasattr(response, 'text') else str(response)
        except Exception as e:
            raise RuntimeError(f"Error calling Gemini API: {str(e)}")


# Example usage:
# def run_test():
#     # Create a dummy tool for the agent to use
#     def dummy_tool_func(input_str: str) -> str:
#         """A dummy tool that simply returns a message."""
#         return f"Tool received: {input_str}"

#     dummy_tool = Tool(
#         name="DummyTool",
#         func=dummy_tool_func,
#         description="A dummy tool for testing purposes."
#     )

#     try:
#         # Initialize the LLM (will use environment variable if no api_key is provided)
#         llm = GeminiLLM()
        
#         # Initialize an agent with the LLM and tool
#         agent = initialize_agent(
#             tools=[dummy_tool],
#             llm=llm,
#             agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
#             verbose=True
#         )
        
#         # Run a test query
#         response = agent.run("Tell me a short story about space exploration.")
#         print(response)
#         return True
#     except Exception as e:
#         print(f"Test failed: {str(e)}")
#         return False


# if __name__ == "__main__":
#     run_test()
