import logging
from .agents import (
    IntentClassificationAgent,
    PromptAnalysisAgent,
    MathVerificationAgent,
    LogicFormalizationAgent,
    VisualizationSpecAgent,
    ParallelCodeStructureAgent,
    EnhancedCodeGenerationAgent,
    ComprehensiveSanitizationAgent,
    EnhancedValidationConsensusAgent,
    TestCaseGenerationAgent,
    PerformanceOptimizationAgent,
    DocumentationGenerationAgent
)

logger = logging.getLogger(__name__)

class AgenticPipeline:
    """Coordinates the agentic flow for generating p5.js visualization code."""
    
    def __init__(self, gemini_flash_model, gemini_learn_model, openrouter_client, qwen_model):
        """Initialize the pipeline with the required models and clients."""
        self.intent_classification = IntentClassificationAgent(gemini_flash_model)
        self.prompt_analysis = PromptAnalysisAgent(gemini_flash_model)
        self.math_verification = MathVerificationAgent(gemini_learn_model)
        self.logic_formalization = LogicFormalizationAgent(gemini_learn_model)
        self.visualization_spec = VisualizationSpecAgent(openrouter_client, qwen_model)
        self.code_structure = ParallelCodeStructureAgent(openrouter_client, qwen_model, gemini_flash_model)
        self.code_generation = EnhancedCodeGenerationAgent(openrouter_client, qwen_model, gemini_flash_model)
        self.sanitization = ComprehensiveSanitizationAgent(gemini_flash_model, openrouter_client, qwen_model)
        self.validation = EnhancedValidationConsensusAgent(gemini_flash_model, gemini_learn_model, openrouter_client, qwen_model)
        self.test_case_generation = TestCaseGenerationAgent(gemini_learn_model)
        self.performance_optimization = PerformanceOptimizationAgent(gemini_flash_model)
        self.documentation_generation = DocumentationGenerationAgent(gemini_learn_model)
    
    def run(self, user_prompt):
        """Execute the full agentic flow pipeline."""
        logger.info(f"Starting agentic flow with prompt: {user_prompt}")
        
        # Step 1: Classify intent
        intent = self.intent_classification.process(user_prompt)
        if intent not in ["MATH", "LOGIC"]:
            return {"status": "error", "error_message": "Invalid intent. Please specify a mathematical equation or programmatic logic."}

        # Step 2: Extract or formalize content based on intent
        if intent == "MATH":
            content = self.prompt_analysis.process(user_prompt)
            if "Error" in content:
                return {"status": "error", "error_message": content}
            verified_content = self.math_verification.process(content)
            if "Error" in verified_content:
                return {"status": "error", "error_message": verified_content}
        else:  # LOGIC
            verified_content = self.logic_formalization.process(user_prompt)
            if "Error" in verified_content:
                return {"status": "error", "error_message": verified_content}

        # Step 3: Generate visualization specification
        spec = self.visualization_spec.process(verified_content, intent)
        if "Error" in spec:
            return {"status": "error", "error_message": spec}

        # Step 4: Generate code structure
        code_struct = self.code_structure.process(spec)
        if "Error" in code_struct:
            return {"status": "error", "error_message": code_struct}

        # Step 5: Generate p5.js code
        code = self.code_generation.process(code_struct, intent)
        if "Error" in code:
            return {"status": "error", "error_message": code}

        # Step 6: Sanitize the code
        sanitized_code = self.sanitization.process(code)
        if "Error" in sanitized_code:
            return {"status": "error", "error_message": sanitized_code}

        # Step 7: Validate the code
        validation_result = self.validation.process(sanitized_code, intent)
        if "failed" in validation_result.lower():
            logger.warning("Validation failed, attempting fallback")
            fallback_code = self.validation.generate_fallback(verified_content, intent)
            if "Error" not in fallback_code:
                sanitized_code = fallback_code
            else:
                return {"status": "error", "error_message": fallback_code}

        # Step 8: Generate test cases
        test_cases = self.test_case_generation.process(sanitized_code, verified_content, intent)
        if "Error" in test_cases:
            logger.warning("Test case generation failed")
            test_cases = "Test case generation failed."

        # Step 9: Optimize performance
        optimized_code = self.performance_optimization.process(sanitized_code)
        if "Error" in optimized_code:
            logger.warning("Performance optimization failed, using sanitized code")
            optimized_code = sanitized_code

        # Step 10: Generate documentation
        documentation = self.documentation_generation.process(optimized_code, verified_content, intent)
        if "Error" in documentation:
            logger.warning("Documentation generation failed")
            documentation = "Documentation generation failed."

        logger.info("Agentic flow completed successfully")
        return {
            "status": "success",
            "code": optimized_code,
            "test_cases": test_cases,
            "documentation": documentation
        }