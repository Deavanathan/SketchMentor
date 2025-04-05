import os
import google.generativeai as genai
from langchain.llms.base import LLM
from pydantic import Field
from dotenv import load_dotenv
from typing import Optional
from Config.LLMs.Gemini.gemini_2_0_flash_thinking_exp_01_21 import GeminiLLM

class SketchMentor():
    """
    A custom LLM wrapper for Google's Gemini model, specialized for solving math 
    and programming problems. SketchMentor leverages enhanced reasoning capabilities 
    to provide clear, step-by-step solutions and explanations.
    """
    def __init__(self, specialized_instruction, **kwargs):
        self.LLM = GeminiLLM()
        self.specialized_instruction = specialized_instruction
        if specialized_instruction == None:
            specialized_instruction =  (
            "You are Sketch Mentor, an expert mentor specialized in math and programming problems. "
            "Provide clear, detailed, and step-by-step explanations for each solution. "
            "Focus only on math and programming related content. \n\n"
        )
    def _call(self, prompt: str, stop=None):
        full_prompt = self.specialized_instruction + prompt
        
        try:
            response = self.LLM._call(full_prompt)
            return response.text if hasattr(response, 'text') else str(response)
        except Exception as e:
            raise RuntimeError(f"Error calling Gemini API: {str(e)}")
