import hashlib
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
from parser import extract_text_from_pdf
from ai_handler import screen_resume, get_chat_response

app = FastAPI(title="AI Resume Screener API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for demo purposes (In production, use Redis or DB)
# Key: MD5 hash of (PDF content + JD), Value: AI Screening Result
screening_cache = {}

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    context: str

@app.post("/screen")
async def screen_resumes(
    files: List[UploadFile] = File(...),
    jd: str = Form(...)
):
    results = []
    
    for file in files:
        content = await file.read()
        file_hash = hashlib.md5(content + jd.encode()).hexdigest()
        
        # Check cache
        if file_hash in screening_cache:
            results.append(screening_cache[file_hash])
            continue
            
        # Parse PDF
        text = extract_text_from_pdf(content)
        if not text:
            results.append({
                "name": file.filename,
                "score": 0,
                "strengths": [],
                "gaps": [],
                "summary": "Could not extract text from PDF.",
                "filename": file.filename
            })
            continue
            
        # Screen with AI
        result = await screen_resume(text, jd)
        result["filename"] = file.filename
        
        # Cache result only if it was successful
        if result.get("score", 0) > 0:
            screening_cache[file_hash] = result
            
        results.append(result)
        
        # Add a small delay between requests to avoid rate limits
        await asyncio.sleep(1)
        
    # Sort results by score descending
    results.sort(key=lambda x: x["score"], reverse=True)
    
    return results

@app.post("/chat")
async def chat_resumes(request: ChatRequest):
    async def event_generator():
        async for chunk in get_chat_response(request.messages, request.context):
            yield chunk
            
    return StreamingResponse(event_generator(), media_type="text/plain")

@app.get("/health")
def health_check():
    return {"status": "healthy"}

import os
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
