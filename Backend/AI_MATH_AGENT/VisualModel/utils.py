def clean_code_response(code):
    """Clean code response by removing markdown code blocks if present."""
    # Remove markdown code block at start if present
    if code.startswith("```javascript"):
        code = code[len("```javascript"):].strip()
    elif code.startswith("```js"):
        code = code[len("```js"):].strip()
    elif code.startswith("```"):
        first_newline = code.find("\n")
        if first_newline != -1:
            code = code[first_newline:].strip()
    
    # Remove ending code block
    if code.endswith("```"):
        code = code[:-3].strip()
    
    return code