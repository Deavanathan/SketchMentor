from .agents import (
    PromptAnalysisAgent,
    MathVerificationAgent,
    VisualizationSpecAgent,
    CodeStructureAgent,
    CodeGenerationAgent,
    CodeTestingAgent,
    CodeOptimizationAgent,
    ErrorDiagnosisAgent,
    ValidationConsensusAgent,
)
from .config import Config
from .utils import Utils
import time

class AgenticPipeline:
    """Enhanced agentic pipeline for generating perfect, error-free Manim code for advanced mathematical visualizations."""
    
    def __init__(self):
        """Initialize the pipeline with necessary components."""
        self.logger = Config.setup_logging()
        self.logger.info("Initializing Enhanced Agentic Pipeline")
        
        gemini_flash_model, gemini_learn_model, openrouter_client, groq_client = Config.initialize_clients()
        
        self.prompt_analysis = PromptAnalysisAgent(gemini_flash_model, self.logger)
        self.math_verification = MathVerificationAgent(gemini_learn_model, self.logger)
        self.visualization_spec = VisualizationSpecAgent(groq_client, Config.GROQ_MODEL, self.logger)
        self.code_structure = CodeStructureAgent(groq_client, Config.GROQ_MODEL, self.logger)
        self.code_generation = CodeGenerationAgent(groq_client,Config.GROQ_MODEL, self.logger)
        self.code_testing = CodeTestingAgent(gemini_learn_model, self.logger)
        self.code_optimization = CodeOptimizationAgent(gemini_flash_model, self.logger)
        self.error_diagnosis = ErrorDiagnosisAgent(gemini_learn_model, self.logger)
        self.validation_consensus = ValidationConsensusAgent(
            gemini_flash_model, gemini_learn_model, groq_client, Config.GROQ_MODEL, self.logger
        )
        
        self.logger.info("Enhanced Agentic Pipeline initialized")
    
    def run(self, user_prompt):
        """Run the pipeline to generate Manim code for the given prompt."""
        self.logger.info(f"Starting enhanced agentic flow with prompt: {user_prompt}")
        
        # Step 1: Extract mathematical concept
        print("=================================================================================================")
        concept = self.prompt_analysis.process(user_prompt)
        if concept.lower().startswith("error"):
            self.logger.error(f"Failed at prompt analysis: {concept}")
            return {"status": "error", "stage": "prompt_analysis", "message": concept}
        
        # Step 2: Verify mathematical concept
        print("=================================================================================================")
        verified_concept = self.math_verification.process(concept)
        if verified_concept.lower().startswith("error"):
            self.logger.error(f"Failed at math verification: {verified_concept}")
            return {"status": "error", "stage": "math_verification", "message": verified_concept}
        
        # Step 3: Generate visualization specification
        print("=================================================================================================")
        specification = self.visualization_spec.process(verified_concept)
        if specification.lower().startswith("error"):
            self.logger.error(f"Failed at visualization spec: {specification}")
            return {"status": "error", "stage": "visualization_spec", "message": specification}
        
        # Step 4: Generate code structure
        print("=================================================================================================")
        code_struct = self.code_structure.process(specification)
        if code_struct.lower().startswith("error"):
            self.logger.error(f"Failed at code structure: {code_struct}")
            return {"status": "error", "stage": "code_structure", "message": code_struct}
        
        # Step 5: Generate initial code
        print("=================================================================================================")
        code = self.code_generation.process(code_struct)
        if code.lower().startswith("error"):
            self.logger.error(f"Failed at code generation: {code}")
            return {"status": "error", "stage": "code_generation", "message": code}
        
        # Step 6: Test code for potential issues
        print("=================================================================================================")
        test_results = self.code_testing.process(code)
        if not test_results.upper().startswith("CODE PASSES TESTING"):
            self.logger.warning(f"Code testing found issues: {test_results}")
            enhanced_struct = f"{code_struct}\n\nIssues to address:\n{test_results}"
            code = self.code_generation.process(enhanced_struct)
        
        # Step 7: Optimize code
        print("=================================================================================================")
        optimized_code = self.code_optimization.process(code)
        
        # Step 8: Validate and iteratively fix
        max_fix_attempts = 3
        validation_result = self.validation_consensus.process(optimized_code)
        
        for attempt in range(max_fix_attempts):
            if validation_result["result"] == "pass":
                self.logger.info(f"Agentic flow completed successfully after {attempt} fix attempts.")
                return {
                    "status": "success",
                    "stage": "complete",
                    "code": validation_result["code"],
                    "score": validation_result["score"]
                }
            else:
                self.logger.warning(f"Validation failed (attempt {attempt + 1}/{max_fix_attempts}) with score {validation_result['score']}")
                fixed_code = self.error_diagnosis.process(
                    optimized_code,
                    f"Code failed validation with feedback:\n{validation_result['feedback']}"
                )
                validation_result = self.validation_consensus.process(fixed_code)
                optimized_code = fixed_code
        
        # Step 9: Generate fallback if all attempts fail
        self.logger.warning("Code failed validation after all attempts, generating fallback")
        fallback_code = self.validation_consensus.generate_fallback(verified_concept)
        return {
            "status": "fallback",
            "stage": "fallback_generation",
            "code": fallback_code,
            "original_code": optimized_code
        }