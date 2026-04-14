import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GEMINI_API_KEY not found in environment variables.")

import asyncio
import random

# Use a stable alias for the flash model to avoid 404 errors
model = genai.GenerativeModel('gemini-flash-latest')

def get_screening_prompt(resume_text: str, jd_text: str) -> str:
    return f"""
    You are an expert HR recruiter. Analyze the following resume against the job description (JD).
    
    ### JOB DESCRIPTION:
    {jd_text}
    
    ### CANDIDATE RESUME:
    {resume_text}
    
    ### INSTRUCTIONS:
    1. Extract the candidate's name.
    2. Provide a match score (0-100) based on how well the candidate fits the JD.
    3. Identify the top 3 strengths of the candidate relative to the JD.
    4. Identify the top 2 gaps or areas for improvement.
    5. Write a one-line summary of why this candidate was ranked this way.
    
    ### OUTPUT FORMAT (JSON ONLY):
    {{
        "name": "Candidate Name",
        "score": 85,
        "strengths": ["Strength 1", "Strength 2", "Strength 3"],
        "gaps": ["Gap 1", "Gap 2"],
        "summary": "One-line summary here."
    }}
    """

async def screen_resume(resume_text: str, jd_text: str, max_retries: int = 3) -> Dict[str, Any]:
    """
    Screens a single resume against a JD using Gemini with retry logic for rate limits.
    """
    prompt = get_screening_prompt(resume_text, jd_text)
    
    for attempt in range(max_retries):
        try:
            # Using thread-safe pool if needed, but for simple async we can call generate_content
            # Note: genai generate_content is synchronous, so we run it in a thread to not block the event loop
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, lambda: model.generate_content(prompt))
            
            # Extract JSON from response
            content = response.text.strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            return json.loads(content)
            
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                wait_time = (2 ** attempt) + random.random() * 2
                print(f"Rate limit hit (429). Retrying in {wait_time:.2f}s... (Attempt {attempt + 1}/{max_retries})")
                await asyncio.sleep(wait_time)
                continue
            
            print(f"Error in LLM screening: {e}")
            return {
                "name": "Unknown",
                "score": 0,
                "strengths": [],
                "gaps": [],
                "summary": f"Error during screening: {error_msg}"
            }
            
    return {
        "name": "Unknown",
        "score": 0,
        "strengths": [],
        "gaps": [],
        "summary": "Exceeded maximum retries due to rate limits. Please try again later."
    }

async def get_chat_response(messages: List[Dict[str, str]], resumes_context: str):
    """
    Generates a chat response based on the screened resumes context.
    Supports streaming.
    """
    system_prompt = f"""
    You are an AI recruiting assistant. You have access to the following screened resumes context:
    
    ### SCREENED RESUMES CONTEXT:
    {resumes_context}
    
    Answer the recruiter's questions based on this context. Be concise, professional, and highlight specific candidates when asked.
    If you don't know the answer or it's not in the context, say so gracefully.
    """
    
    # Construct history for Gemini
    chat = model.start_chat(history=[])
    
    # Send system context first (as a hidden prompt or part of the first message)
    # Gemini doesn't have a direct "system" role like OpenAI, so we prepend it to the latest query
    # or use it as instructions.
    
    full_prompt = f"{system_prompt}\n\nUser: {messages[-1]['content']}"
    
    try:
        response = model.generate_content(full_prompt, stream=True)
        for chunk in response:
            yield chunk.text
    except Exception as e:
        yield f"Error: {str(e)}"
