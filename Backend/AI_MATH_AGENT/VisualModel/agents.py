import logging
from .utils import clean_code_response
from .prompts import PROMPTS

logger = logging.getLogger(__name__)

class IntentClassificationAgent:
    """Agent responsible for determining if the input is a mathematical equation or programmatic logic."""
    
    def __init__(self, gemini_model):
        self.model = gemini_model
    
    def process(self, prompt):
        """Classify whether the prompt contains a mathematical equation or programmatic logic."""
        logger.info(f"Classifying intent for: {prompt}")
        try:
            response = self.model.generate_content(
                PROMPTS["intent_classification"].format(prompt=prompt)
            )
            intent = response.text.strip()
            logger.info(f"Classified intent: {intent}")
            return intent
        except Exception as e:
            logger.error(f"Error in Gemini API: {str(e)}")
            return "MATH"
        
class PromptAnalysisAgent:
    """Agent responsible for extracting mathematical equations from user prompts."""
    
    def __init__(self, gemini_model):
        self.model = gemini_model
    
    def process(self, prompt):
        """Extract the mathematical equation from the user prompt."""
        logger.info(f"Starting prompt analysis for: {prompt}")
        try:
            response = self.model.generate_content(
                PROMPTS["prompt_analysis"].format(prompt=prompt)
            )
            equation = response.text.strip()
            logger.info(f"Extracted equation From Gemini: {equation}")
            return equation
        except Exception as e:
            logger.error(f"Error in Gemini API: {str(e)}")
            return f"Error in Gemini API: {str(e)}"


class IntentClassificationAgent:
    """Agent responsible for determining if the input is a mathematical equation or programmatic logic."""
    
    def __init__(self, gemini_model):
        self.model = gemini_model
    
    def process(self, prompt):
        """Classify whether the prompt contains a mathematical equation or programmatic logic."""
        logger.info(f"Classifying intent for: {prompt}")
        try:
            response = self.model.generate_content(
                PROMPTS["intent_classification"].format(prompt=prompt)
            )
            intent = response.text.strip()
            logger.info(f"Classified intent: {intent}")
            return intent
        except Exception as e:
            logger.error(f"Error in Gemini API: {str(e)}")
            return "MATH"  # Default to math if classification fails


class MathVerificationAgent:
    """Agent responsible for verifying mathematical correctness of equations."""
    
    def __init__(self, gemini_model):
        self.model = gemini_model
    
    def process(self, equation):
        """Verify the mathematical correctness of the equation."""
        logger.info(f"Verifying equation: {equation}")
        try:
            response = self.model.generate_content(
                PROMPTS["math_verification"].format(equation=equation)
            )
            result = response.text.strip()
            logger.info(f"Verification result: {result}")
            return result
        except Exception as e:
            logger.error(f"Error in Gemini API: {str(e)}")
            return f"Error in Gemini API: {str(e)}"


class LogicFormalizationAgent:
    """Agent responsible for formalizing programmatic logic specifications."""
    
    def __init__(self, gemini_model):
        self.model = gemini_model
    
    def process(self, logic_description):
        """Formalize the programmatic logic description."""
        logger.info(f"Formalizing logic: {logic_description}")
        try:
            response = self.model.generate_content(
                PROMPTS["logic_formalization"].format(logic=logic_description)
            )
            formalized = response.text.strip()
            logger.info(f"Formalized logic: {formalized}")
            return formalized
        except Exception as e:
            logger.error(f"Error in Gemini API: {str(e)}")
            return f"Error in Gemini API: {str(e)}"


class VisualizationSpecAgent:
    """Agent responsible for creating visualization specifications."""
    
    def __init__(self, openrouter_client, model_name):
        self.client = openrouter_client
        self.model_name = model_name
    
    def process(self, content, content_type="MATH"):
        """Create a visualization specification for the equation or logic."""
        logger.info(f"Generating visualization spec for {content_type}: {content}")
        try:
            prompt_key = "visualization_spec_math" if content_type == "MATH" else "visualization_spec_logic"
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{
                    "role": "user",
                    "content": PROMPTS[prompt_key].format(content=content)
                }]
            )
            spec = completion.choices[0].message.content.strip()
            logger.info(f"Visualization specification: {spec}")
            return spec
        except Exception as e:
            logger.error(f"Error in OpenRouter API: {str(e)}")
            return f"Error in OpenRouter API: {str(e)}"


class ParallelCodeStructureAgent:
    """Agent responsible for generating code structure with parallel verification."""
    
    def __init__(self, openrouter_client, model_name, gemini_model):
        self.client = openrouter_client
        self.model_name = model_name
        self.gemini_model = gemini_model
    
    def process(self, specification):
        """Generate code structure based on visualization specification with parallel verification."""
        logger.info(f"Generating code structure for spec: {specification}")
        try:
            # Primary structure generation
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{
                    "role": "user",
                    "content": PROMPTS["code_structure"].format(specification=specification)
                }]
            )
            struct = completion.choices[0].message.content.strip()
            
            # Parallel verification using Gemini
            verification = self.gemini_model.generate_content(
                PROMPTS["structure_verification"].format(
                    specification=specification,
                    structure=struct
                )
            )
            verified_struct = verification.text.strip()
            
            # Check if the structure is valid or needs improvements
            if "VALID:" in verified_struct:
                # Structure is valid, use the original struct without verification text
                logger.info("Structure verified as valid, using original structure")
            else:
                # Improvements suggested, use the verified_struct as the revised structure
                logger.info("Structure verification suggested improvements")
                struct = verified_struct
            
            logger.info("Generated and verified code structure completed")
            return struct
        except Exception as e:
            logger.error(f"Error in structure generation: {str(e)}")
            return f"Error in structure generation: {str(e)}"


class EnhancedCodeGenerationAgent:
    """Agent responsible for generating p5.js code with enhanced capabilities."""
    
    def __init__(self, openrouter_client, model_name, gemini_model):
        self.client = openrouter_client
        self.model_name = model_name
        self.gemini_model = gemini_model
    
    def process(self, code_struct, content_type="MATH"):
        """Generate p5.js code based on code structure."""
        logger.info(f"Generating p5.js code from structure for {content_type}")
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{
                    "role": "user",
                    "content": PROMPTS["code_generation"].format(code_struct=code_struct, content_type=content_type)
                }]
            )
            if completion and hasattr(completion, 'choices') and completion.choices:
                code = completion.choices[0].message.content.strip()
                code = clean_code_response(code)
            else:
                logger.error("API response is empty or invalid")
                code = "/* Error: Unable to generate code due to invalid API response */"
        except Exception as e:
            logger.error(f"Error in OpenRouter API: {str(e)}")
            code = f"/* Error: API failure - {str(e)} */"
        
        # Optimization pass with Gemini
        try:
            optimization = self.gemini_model.generate_content(
                PROMPTS["code_optimization"].format(code=code)
            )
            optimized_code = optimization.text.strip()
            optimized_code = clean_code_response(optimized_code)
            logger.info(f"Generated and optimized p5.js code")
            return optimized_code
        except Exception as e:
            logger.error(f"Error in code optimization: {str(e)}")
            return code  # Return original code if optimization fails


class ComprehensiveSanitizationAgent:
    """Agent responsible for checking and sanitizing the code with multiple passes."""
    
    def __init__(self, gemini_model, openrouter_client, model_name):
        self.gemini_model = gemini_model
        self.client = openrouter_client
        self.model_name = model_name
    
    def process(self, code):
        """Perform multi-pass sanitization of p5.js code."""
        logger.info(f"Beginning comprehensive sanitization")
        
        try:
            # First pass with Gemini
            response1 = self.gemini_model.generate_content(
                PROMPTS["safety_sanitization"].format(code=code)
            )
            sanitized1 = response1.text.strip()
            sanitized1 = clean_code_response(sanitized1)
            
            # Second pass with Qwen
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{
                    "role": "user", 
                    "content": PROMPTS["advanced_sanitization"].format(code=sanitized1)
                }]
            )
            sanitized2 = completion.choices[0].message.content.strip()
            sanitized2 = clean_code_response(sanitized2)
            
            # Final validation with Gemini
            validation = self.gemini_model.generate_content(
                PROMPTS["code_completeness"].format(code=sanitized2)
            )
            final_result = validation.text.strip()
            
            # If validation indicates problems, revert to first sanitization
            if not final_result.startswith("COMPLETE:"):
                logger.warning(f"Second sanitization caused issues, reverting to first pass")
                return sanitized1
                
            logger.info(f"Comprehensive sanitization completed")
            return sanitized2
            
        except Exception as e:
            logger.error(f"Error in sanitization: {str(e)}")
            return code  # Return original code if sanitization fails


class EnhancedValidationConsensusAgent:
    """Agent responsible for validating code with multiple models and enhanced error handling."""
    
    def __init__(self, gemini_flash_model, gemini_learn_model, openrouter_client, qwen_model):
        self.gemini_flash_model = gemini_flash_model
        self.gemini_learn_model = gemini_learn_model
        self.openrouter_client = openrouter_client
        self.qwen_model = qwen_model
    
    def process(self, code, content_type="MATH"):
        """Validate the code using advanced consensus mechanism."""
        logger.info(f"Starting enhanced validation for {content_type} code")
        
        try:
            # Use different validation prompts based on content type
            validation_prompt = PROMPTS["validation_math"] if content_type == "MATH" else PROMPTS["validation_logic"]
            
            # First validator: Gemini Flash
            gemini_flash_result = self.gemini_flash_model.generate_content(
                validation_prompt.format(code=code)
            ).text.strip()
            logger.info(f"Gemini flash validation result: {gemini_flash_result}")
            
            # Second validator: Gemini Learn
            gemini_learn_result = self.gemini_learn_model.generate_content(
                validation_prompt.format(code=code)
            ).text.strip()
            logger.info(f"Gemini learn validation result: {gemini_learn_result}")
            
            # Third validator: Qwen
            qwen_result = self.openrouter_client.chat.completions.create(
                model=self.qwen_model,
                messages=[{"role": "user", "content": validation_prompt.format(code=code)}]
            ).choices[0].message.content.strip()
            logger.info(f"Qwen validation result: {qwen_result}")

            # Check if at least 2 out of 3 models say YES
            validations = [
                gemini_flash_result.strip().upper().startswith("YES"),
                gemini_learn_result.strip().upper().startswith("YES"),
                qwen_result.strip().upper().startswith("YES")
            ]
            
            if sum(validations) >= 2:
                logger.info("Code passed validation consensus.")
                
                # Even if passed, collect improvement suggestions for perfect output
                suggestions = []
                if not validations[0] and len(gemini_flash_result) > 3:
                    suggestions.append(gemini_flash_result[3:].strip())
                if not validations[1] and len(gemini_learn_result) > 3:
                    suggestions.append(gemini_learn_result[3:].strip())
                if not validations[2] and len(qwen_result) > 3:
                    suggestions.append(qwen_result[3:].strip())
                
                # If any valid suggestions exist, apply them through final enhancement
                if suggestions:
                    enhancement = self.gemini_flash_model.generate_content(
                        PROMPTS["final_enhancement"].format(
                            code=code,
                            suggestions="\n".join(suggestions)
                        )
                    ).text.strip()
                    enhanced_code = clean_code_response(enhancement)
                    return enhanced_code
                
                return code
            
            # If code failed validation, collect reasons
            reasons = []
            if not validations[0] and len(gemini_flash_result) > 3:
                reasons.append(f"Gemini Flash: {gemini_flash_result[3:].strip()}")
            if not validations[1] and len(gemini_learn_result) > 3:
                reasons.append(f"Gemini Learn: {gemini_learn_result[3:].strip()}")
            if not validations[2] and len(qwen_result) > 3:
                reasons.append(f"Qwen: {qwen_result[3:].strip()}")
                
            failure_message = "Code validation failed. " + " ".join(reasons)
            logger.warning(failure_message)
            return failure_message
        except Exception as e:
            logger.error(f"Error during validation: {str(e)}")
            return f"Error during validation: {str(e)}"
    
    def generate_fallback(self, content, content_type="MATH"):
        try:
            prompt_key = "fallback_generation_math" if content_type == "MATH" else "fallback_generation_logic"
            try:
                prompt = PROMPTS[prompt_key].format(content=content)
            except Exception as e:
                logger.error(f"Error formatting {prompt_key}: {str(e)}")
                return f"Error formatting prompt {prompt_key}: {str(e)}"
            fallback_retry = self.gemini_flash_model.generate_content(prompt).text.strip()
            fallback_code = clean_code_response(fallback_retry)
            validation_result = self.process(fallback_code, content_type)
            if not "failed" in validation_result.lower():
                logger.info(f"Generated valid fallback code")
                return fallback_code
            
            try:
                prompt = PROMPTS["last_resort_generation"].format(content=content, content_type=content_type)
            except Exception as e:
                logger.error(f"Error formatting last_resort_generation: {str(e)}")
                return f"Error formatting prompt last_resort_generation: {str(e)}"
            last_resort = self.gemini_learn_model.generate_content(prompt).text.strip()
            last_resort_code = clean_code_response(last_resort)
            logger.info(f"Generated last resort fallback code")
            return last_resort_code
        except Exception as e:
            logger.error(f"Error generating fallback code: {str(e)}")
            return f"Error generating fallback code: {str(e)}"


class TestCaseGenerationAgent:
    """Agent responsible for generating test cases to verify visualization correctness."""
    
    def __init__(self, gemini_model):
        self.model = gemini_model
    
    def process(self, code, content, content_type="MATH"):
        """Generate test cases for the visualization code."""
        logger.info(f"Generating test cases for {content_type} visualization")
        try:
            response = self.model.generate_content(
                PROMPTS["test_case_generation"].format(
                    code=code,
                    content=content,
                    content_type=content_type
                )
            )
            test_cases = response.text.strip()
            logger.info(f"Generated test cases successfully")
            return test_cases
        except Exception as e:
            logger.error(f"Error generating test cases: {str(e)}")
            return f"Error generating test cases: {str(e)}"


class PerformanceOptimizationAgent:
    """Agent responsible for optimizing p5.js code performance."""
    
    def __init__(self, gemini_model):
        self.model = gemini_model
    
    def process(self, code):
        """Optimize p5.js code for performance."""
        logger.info(f"Optimizing code performance")
        try:
            response = self.model.generate_content(
                PROMPTS["performance_optimization"].format(code=code)
            )
            optimized = response.text.strip()
            optimized = clean_code_response(optimized)
            logger.info(f"Performance optimization completed")
            return optimized
        except Exception as e:
            logger.error(f"Error in performance optimization: {str(e)}")
            return code  # Return original code if optimization fails


class DocumentationGenerationAgent:
    """Agent responsible for generating documentation for the visualization."""
    
    def __init__(self, gemini_model):
        self.model = gemini_model
    
    def process(self, code, content, content_type="MATH"):
        """Generate documentation for the visualization code."""
        logger.info(f"Generating documentation for {content_type} visualization")
        try:
            response = self.model.generate_content(
                PROMPTS["documentation_generation"].format(
                    code=code,
                    content=content,
                    content_type=content_type
                )
            )
            documentation = response.text.strip()
            logger.info(f"Generated documentation successfully")
            return documentation
        except Exception as e:
            logger.error(f"Error generating documentation: {str(e)}")
            return f"Error generating documentation: {str(e)}"