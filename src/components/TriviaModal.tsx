import React, { useState } from 'react';
import { X, HelpCircle, Trophy, CheckCircle, XCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { TriviaQuestion } from '../types';

interface TriviaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TriviaModal: React.FC<TriviaModalProps> = ({ isOpen, onClose }) => {
  const [selectedGenre, setSelectedGenre] = useState('Sci-Fi & Blockbusters');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  if (!isOpen) return null;

  const handleStartQuiz = async () => {
    setLoading(true);
    setError(null);
    setGameFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setAnswered(false);

    try {
      const res = await fetch('/api/gemini/trivia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre: selectedGenre, difficulty }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate trivia quiz questions.');
      }

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('No trivia questions returned.');
      }
    } catch (err: any) {
      setError(err.message || 'Error generating trivia.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    if (answered) return;
    setSelectedOption(optIdx);
    setAnswered(true);

    const currentQ = questions[currentIndex];
    if (optIdx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setGameFinished(true);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-[#0d0e12] rounded-3xl border border-red-600/30 shadow-2xl overflow-hidden my-auto text-white max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-[#12141a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-600/40 text-red-500">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">Cinephile Trivia Challenge</h2>
              <p className="text-xs text-neutral-400">Test your cinema knowledge with AI-generated trivia</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 transition"
            id="trivia-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* SETUP SCREEN */}
          {questions.length === 0 && !loading && (
            <div className="space-y-6">
              
              <div className="space-y-3">
                <label className="text-xs font-bold text-red-500 uppercase tracking-wider block">
                  Select Genre Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Sci-Fi & Blockbusters', 'Oscar Winners & Drama', 'Horror & Thrillers', 'Animation & Classics', 'Action & Adventure', 'General Cinema Knowledge'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`p-3 rounded-xl border text-xs text-left font-medium transition ${
                        selectedGenre === g
                          ? 'bg-red-600/20 border-red-600/50 text-red-300 font-bold'
                          : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                      }`}
                      id={`trivia-genre-${g.toLowerCase().replace(/[^a-z]/g, '')}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  Difficulty Level
                </label>
                <div className="flex items-center gap-2">
                  {['easy', 'medium', 'hard'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold uppercase transition ${
                        difficulty === d
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                      }`}
                      id={`trivia-diff-${d}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
                  {error}
                </div>
              )}

              <button
                onClick={handleStartQuiz}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 uppercase tracking-wider"
                id="start-trivia-btn"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Generate Trivia Challenge</span>
              </button>

            </div>
          )}

          {/* LOADING SCREEN */}
          {loading && (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-red-500 mx-auto" />
              <p className="text-sm font-semibold text-red-400">Generating customized movie questions...</p>
            </div>
          )}

          {/* QUESTION PLAY SCREEN */}
          {questions.length > 0 && !loading && !gameFinished && currentQ && (
            <div className="space-y-6">
              
              {/* Question Progress Header */}
              <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-3">
                <span className="text-red-400 uppercase">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-neutral-300 flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Score: {score}
                </span>
              </div>

              {/* Question Text */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400">
                  {currentQ.movieRelated || 'Cinema Quiz'}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isCorrect = idx === currentQ.correctIndex;
                  const isSelected = selectedOption === idx;

                  let btnStyle = 'bg-white/5 border-white/10 text-neutral-200 hover:bg-white/10';

                  if (answered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-red-500/20 border-red-500/50 text-red-300 font-bold';
                    } else {
                      btnStyle = 'bg-white/5 border-white/5 text-neutral-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={answered}
                      className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition flex items-center justify-between gap-3 ${btnStyle}`}
                      id={`trivia-opt-${idx}`}
                    >
                      <span className="flex-1">{opt}</span>
                      {answered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Trigger */}
              {answered && (
                <div className="space-y-4 pt-2 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-red-600/10 border border-red-600/30 text-xs space-y-1">
                    <span className="font-bold text-red-400 block uppercase tracking-wider">💡 Context & Explanation</span>
                    <p className="text-neutral-200 leading-relaxed">{currentQ.explanation}</p>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-red-600 text-white font-extrabold text-xs rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 uppercase tracking-wider"
                    id="trivia-next-btn"
                  >
                    <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* GAME FINISHED RESULTS */}
          {gameFinished && (
            <div className="py-8 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-600/40 text-red-500 flex items-center justify-center mx-auto shadow-xl">
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white uppercase">Challenge Completed!</h3>
                <p className="text-sm text-neutral-300 mt-1">
                  You scored <span className="text-red-500 font-extrabold text-lg">{score}</span> out of <span className="font-bold">{questions.length}</span> questions!
                </p>
              </div>

              <button
                onClick={() => setQuestions([])}
                className="px-6 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/30 uppercase tracking-wider"
                id="play-again-btn"
              >
                Play Another Challenge
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
