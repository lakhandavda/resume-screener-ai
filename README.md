<<<<<<< HEAD
# resume-screener-ai
=======
# TalentPulse AI: Smart Resume Screener

An AI-powered recruitment assistant that screens multiple resumes against a job description, provides a ranked leaderboard, and offers an interactive chat to query candidate data.

![TalentPulse AI Demo](https://raw.githubusercontent.com/username/project/main/demo-placeholder.png)

## 🚀 Live Demo
- **Frontend**: [Vercel Deployment URL]
- **Backend**: [Render Deployment URL]

## ✨ Features
- **Batch Processing**: Upload multiple PDF resumes simultaneously.
- **AI Ranking**: Semantic analysis using Gemini 1.5 Flash to score candidates 0-100.
- **Detailed Insights**: Automatically extracts key strengths and gaps for every candidate.
- **Interactive Chat**: Ask questions like "Which candidate has the most SQL experience?" or "Compare the top 2 candidates."
- **Professional UI**: Modern, responsive dark-mode interface built with Framer Motion and Tailwind CSS.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: FastAPI (Python 3.12+), Google Generative AI (Gemini), pdfplumber.
- **Deployment**: Vercel (Frontend), Render (Backend).

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.12+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend` folder:
```env
GEMINI_API_KEY=your_key_here
PORT=8000
```
Run the server:
```bash
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:8000
```
Run the development server:
```bash
npm run dev
```

## 🌍 Deployment

### Backend (Render)
1. New -> Web Service.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `python main.py`
4. Environment Variables:
   - `GEMINI_API_KEY`: [Your Key]
   - `PORT`: 10000 (Render sets this automatically)

### Frontend (Vercel)
1. New Project -> Import from GitHub.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_URL`: [Your Render Backend URL]

## ⚠️ Known Limitations
- **Gemini Free Quota**: The free tier has rate limits. The app includes a 1-second delay between screenings and exponential backoff retry logic to mitigate this.
- **In-Memory Cache**: The backend uses an in-memory dictionary for results. In a production environment with high traffic, this should be replaced with Redis or a persistent database.
- **PDF Extraction**: Complex multi-column PDF layouts might occasionally cause extraction artifacts.

---
Built for the **Resume Screener AI** Hiring Assignment.
>>>>>>> b2af4ea (Initial commit: AI Resume Screener with FastAPI and React)
