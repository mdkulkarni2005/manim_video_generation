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
You are an expert Python developer. Write a Python script using the manim library that fulfills the following user request. Only return the code, no explanation or markdown formatting.

User request: {prompt}
"""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(gemini_prompt)
        code = response.text
        return {"code": code}
    except Exception as e:
        return {"code": f"Error: {str(e)}"}
