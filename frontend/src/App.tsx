import { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { Leaderboard } from './components/Leaderboard';
import { ChatPanel } from './components/ChatPanel';
import { screenResumes } from './api';
import type { Candidate } from './api';
import { Brain, Loader2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [jd, setJd] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isScreening, setIsScreening] = useState(false);

  const handleScreen = async () => {
    if (files.length === 0 || !jd.trim()) return;
    
    setIsScreening(true);
    try {
      const results = await screenResumes(files, jd);
      setCandidates(results);
    } catch (error) {
      console.error('Screening error:', error);
      alert('Failed to screen resumes. Please check if the backend is running.');
    } finally {
      setIsScreening(false);
    }
  };

  const contextString = candidates.map(c => 
    `Name: ${c.name}, Score: ${c.score}, Summary: ${c.summary}, Strengths: ${c.strengths.join(', ')}, Gaps: ${c.gaps.join(', ')}`
  ).join('\n\n');

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-2xl">
            <Brain className="text-primary" size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">TalentPulse <span className="text-secondary text-sm font-normal">AI</span></h1>
            <p className="text-white/50 text-sm">Intelligent Resume Screening & Candidate Analysis</p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-6 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            <span>AI Fastpass Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Gemini 1.5 Powered</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input */}
        <div className="lg:col-span-8 space-y-8">
          <section className="glass rounded-3xl p-6 md:p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-primary/60 px-1">1. Set the Target</label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the Job Description here. Be specific about skills and experience..."
                className="w-full h-48 bg-white/5 rounded-2xl p-4 border border-white/10 focus:border-primary/50 focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-primary/60 px-1">2. Upload Resumes</label>
              <UploadZone onFilesChange={setFiles} />
            </div>

            <button
              onClick={handleScreen}
              disabled={isScreening || files.length === 0 || !jd.trim()}
              className="w-full group relative overflow-hidden rounded-2xl bg-primary py-4 text-background font-bold text-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isScreening ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Play size={20} fill="currentColor" />
                    <span>Run AI Screening</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-white/50 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </section>

          {/* Results Area */}
          <AnimatePresence>
            {candidates.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4"
              >
                <Leaderboard candidates={candidates} />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Chat */}
        <div className="lg:col-span-4 h-[600px] lg:h-[calc(100vh-200px)] lg:sticky lg:top-8">
          <ChatPanel context={contextString} />
        </div>
      </main>

      <footer className="mt-20 py-8 border-t border-white/5 w-full text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/40 text-sm font-medium">
            &copy; 2026 TalentPulse AI Systems
          </p>

        </div>
      </footer>
    </div>
  );
}

export default App;
