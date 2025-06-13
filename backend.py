from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import google.generativeai as genai
import os
import glob
import time
import re
import subprocess

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
            
        # Extract class name from the code
        class_name = extract_class_name(code)
        
        # Run manim if class name was found
        if class_name:
            try:
                # Create a directory for manim output if it doesn't exist
                os.makedirs('/Users/manaskulkarni/test/media/videos/test/1080p60', exist_ok=True)
                
                # Run manim in the test directory
                cmd = f"cd /Users/manaskulkarni/test && manim test.py {class_name} -pqh"
                print(f"Running command: {cmd}")
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                print(f"Command output: {result.stdout}")
                if result.stderr:
                    print(f"Command error: {result.stderr}")
            except Exception as e:
                print(f"Error running manim: {str(e)}")
                
        # Return the code and check for latest video
        latest_video = get_latest_video()
        return {"code": code, "videoUrl": latest_video, "className": class_name}
    except Exception as e:
        return {"code": f"Error: {str(e)}", "videoUrl": None}

@app.get("/latest-video")
def latest_video():
    video_url = get_latest_video()
    return {"videoUrl": video_url}

def get_latest_video():
    """Find the latest video file in the media directory"""
    try:
        video_dir = '/Users/manaskulkarni/test/media/videos/test/1080p60/'
        if not os.path.exists(video_dir):
            return None
            
        video_files = glob.glob(f"{video_dir}*.mp4")
        if not video_files:
            return None
            
        # Get the most recently modified video file
        latest_video = max(video_files, key=os.path.getmtime)
        
        # Return a URL that can be accessed from the frontend
        return f"/media/videos/test/1080p60/{os.path.basename(latest_video)}"
    except Exception as e:
        print(f"Error finding latest video: {str(e)}")
        return None

def extract_class_name(code):
    """Extract the main Scene class name from the code"""
    try:
        # Look for a class that inherits from Scene
        class_match = re.search(r'class\s+(\w+)\s*\(\s*Scene\s*\)', code)
        if class_match:
            return class_match.group(1)
        return None
    except Exception as e:
        print(f"Error extracting class name: {str(e)}")
        return None

# Mount the media directory to serve video files
try:
    app.mount("/media", StaticFiles(directory="/Users/manaskulkarni/test/media"), name="media")
except Exception as e:
    print(f"Error mounting media directory: {str(e)}")
