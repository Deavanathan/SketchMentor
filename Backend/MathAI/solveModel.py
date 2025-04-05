from SolveProblem.agent import GeminiP5JSGenerator, FullcodeGenerator
from SolveProblem.visualAndSolve import MathProblemSolver

def solve_math_problem(problem: str) -> str:
    """
    Solve the math problem and generate the corresponding p5.js visualization code.

    Args:
        problem (str): The math problem to be solved.

    Returns:
        str: The generated p5.js code.
    """
    solver = MathProblemSolver()
    text_to_code = GeminiP5JSGenerator()
    full_code_generator = FullcodeGenerator()
    
    final_result = solver.solve_math_problem(problem)
    separate_code = ""
    for i, segment in enumerate(final_result.values()):
        if segment["type"] == "text":
            code = text_to_code.generate_p5js_code(segment["content"])
            separate_code += f"{i} th order/segment code\n"
            separate_code += code
        else:
            separate_code += f"{i} th order/segment code\n"
            separate_code += segment["content"]
    
    full_code = full_code_generator.generate_p5js_code(separate_code)
    return full_code

# if __name__ == "__main__":
#     # Example usage:
#     problem_input = "Solve the quadratic equation x² + 3x + 2 = 0"
#     generated_code = solve_math_problem(problem_input)
#     print("Generated Code:\n")
#     print(generated_code)
