import React from 'react';
import { Trophy, Star, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Candidate } from '../api';

interface LeaderboardProps {
  candidates: Candidate[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ candidates }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="text-primary" />
          Ranked Candidates
        </h2>
        <span className="text-sm text-white/50">{candidates.length} analyzed</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {candidates.map((candidate, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
              index === 0 
                ? 'bg-primary/10 border-2 border-primary/20 glow' 
                : 'bg-surface border border-white/5 hover:border-white/10'
            }`}
          >
            {index === 0 && (
              <div className="absolute top-4 right-4 animate-bounce">
                <Trophy className="text-secondary" size={24} />
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-start md:gap-8">
              {/* Score Badge */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className={`relative h-20 w-20 rounded-full flex items-center justify-center border-4 ${
                  candidate.score >= 80 ? 'border-secondary' : candidate.score >= 50 ? 'border-primary' : 'border-white/10'
                }`}>
                  <span className="text-2xl font-bold">{candidate.score}%</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{candidate.name}</h3>
                  <p className="text-sm text-white/60 italic">{candidate.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                      <Star size={12} /> Top Strengths
                    </p>
                    <ul className="space-y-1">
                      {candidate.strengths.map((str, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 size={14} className="mt-0.5 text-secondary shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle size={12} /> Key Gaps
                    </p>
                    <ul className="space-y-1">
                      {candidate.gaps.map((gap, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <AlertCircle size={14} className="mt-0.5 text-primary/60 shrink-0" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
