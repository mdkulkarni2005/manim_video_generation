from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBdrruowO3hPqiFsa85zR24IcftwP1KBoM")

genai.configure(api_key=GEMINI_API_KEY)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate-code")
def generate_code(req: PromptRequest):
    prompt = req.prompt
    gemini_prompt = f"""
You are an expert Python developer. Write a Python script using the manim library that fulfills the following user request.

IMPORTANT: You must follow these rules:
1. Return ONLY the Python code with no markdown formatting, no ```python tags, and no backticks.
2. Do not include any explanations, comments or markdown syntax.
3. Start directly with import statements.
4. Provide complete, executable Python code.

User request: {prompt}
"""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(gemini_prompt)
        code = response.text
        
        # Clean the code - remove any potential markdown artifacts
        if code.startswith("```python"):
            code = code.replace("```python", "", 1)
        if code.startswith("```"):
            code = code.replace("```", "", 1)
        if code.endswith("```"):
            code = code[:code.rindex("```")]
        
        # Ensure the code is properly formatted
        code = code.strip()
        
        # Save the generated code to test.py in the test directory
        try:
            with open('/Users/manaskulkarni/test/test.py', 'w') as f:
                f.write(code)
        except Exception as write_error:
            print(f"Error writing to file: {str(write_error)}")
            
        return {"code": code}
    except Exception as e:
        return {"code": f"Error: {str(e)}"}
