import React, { useState } from 'react';
import { 
  Flame, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Terminal,
  Brain,
  Shield,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizCard } from '../types';
import { CYBER_QUIZ_CARDS } from '../data/cyberFlashcards';
import { playQuizAnswer, playSuccessChime } from '../utils/audioUtils';

export const QuizBoosterView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const filteredCards = selectedDomain === 'all'
    ? CYBER_QUIZ_CARDS
    : CYBER_QUIZ_CARDS.filter((c) => c.domain === selectedDomain);

  const currentCard: QuizCard = filteredCards[currentIndex % filteredCards.length];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentCard.correctIndex;
    playQuizAnswer(isCorrect);

    if (isCorrect) {
      setScore((s) => s + 1);
    }
    setTotalAnswered((t) => t + 1);

    if (isCorrect && (score + 1) % 5 === 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswered(0);
  };

  const domains = ['all', ...Array.from(new Set(CYBER_QUIZ_CARDS.map((c) => c.domain)))];

  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Brain className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Daily Quiz & Final Exam Booster
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Rapid-fire technical drill cards designed to sharpen your recall for the 13 daily quizzes and ensure you score in the top tier on the <span className="text-rose-400 font-bold">Final Main Test (Nov 22)</span>.
            </p>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">ACCURACY SCORE</span>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {accuracy}% ({score}/{totalAnswered})
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
              title="Reset stats"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-500 font-mono mr-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Domain:
          </span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => {
                setSelectedDomain(dom);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDomain === dom
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {dom === 'all' ? 'All Cybersecurity Domains' : dom}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Card */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Card Top Indicator */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
              {currentCard.domain}
            </span>
            <span className="text-slate-500">
              Question {(currentIndex % filteredCards.length) + 1} of {filteredCards.length}
            </span>
          </div>

          {/* Question Prompt */}
          <h3 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk'] leading-relaxed">
            {currentCard.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentCard.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentCard.correctIndex;

              let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-800/40 text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-800/80 text-slate-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {isAnswered && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                <Terminal className="w-4 h-4" />
                <span>Technical Rationale:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentCard.explanation}
              </p>
            </div>
          )}

          {/* Bottom Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-500 font-mono">
              {isAnswered ? 'Select Next to continue drill' : 'Pick the best answer'}
            </span>

            {isAnswered && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
