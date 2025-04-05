import os
import google.generativeai as genai
from langchain.llms.base import LLM
from pydantic import Field
from langchain.agents import ZeroShotAgent, Tool
from langchain.agents import AgentType
from langchain.agents import initialize_agent

class GeminiLLM(LLM):
    model: str = Field(default="gemini-2.0-flash")

    def __init__(self, api: str, **kwargs):
        apiKey = os.environ.get(api)
        genai.configure(api_key=apiKey)
        super().__init__(**kwargs)

    @property
    def _llm_type(self) -> str:
        return "gemini"

    def _call(self, prompt: str, stop=None):
        model_instance = genai.GenerativeModel(self.model)
        response = model_instance.generate_content(prompt)
        return response if isinstance(response, str) else response.text

# # Instantiate the custom GeminiLLM with the required API key parameter
# llm = GeminiLLM("GEMINI_API_KEY")

# # Define a dummy tool that simply returns a static message
# def dummy_tool_func(input_str: str) -> str:
#     return "This is a dummy tool response."

# dummy_tool = Tool(
#     name="DummyTool",
#     func=dummy_tool_func,
#     description="A dummy tool for testing purposes."
# )

# # Provide at least one tool to satisfy the agent's requirements
# tools = [dummy_tool]

# # Initialize a zero-shot agent with the custom LLM and the dummy tool
# agent = initialize_agent(
#     tools,
#     llm,
#     agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
#     verbose=True
# )

# # Run the agent with a sample query
# response = agent.run("Tell me a short story about space exploration.")
# print(response)
