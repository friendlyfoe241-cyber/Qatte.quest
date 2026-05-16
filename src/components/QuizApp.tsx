import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Clock, Play, RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { QUIZZES, Quiz } from '../data/mockQuiz';
import { AntiCheatWrapper } from './AntiCheatWrapper';

type AppState = 'welcome' | 'quiz' | 'locked' | 'results';

export function QuizApp() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [selectedQuizId, setSelectedQuizId] = useState<string>(QUIZZES[0].id);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [violationReason, setViolationReason] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");

  const quiz = QUIZZES.find(q => q.id === selectedQuizId) || QUIZZES[0];
  const currentQuestion = quiz.questions[currentQuestionIdx];

  // Timer logic
  useEffect(() => {
    if (appState !== 'quiz' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [appState, timeLeft]);

  const handleTimeUp = () => {
    // Treat as incorrect, move to next
    nextQuestion(false);
  };

  const startQuiz = () => {
    setAppState('quiz');
    setCurrentQuestionIdx(0);
    setScore(0);
    setTimeLeft(quiz.questions[0].timeLimitSecs);
    setTextAnswer("");
  };

  const resetDemo = () => {
    setAppState('welcome');
    setViolationReason(null);
  };

  const handleViolation = (reason: string) => {
    setViolationReason(reason);
    setAppState('locked');
  };

  const nextQuestion = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 1);

    if (currentQuestionIdx + 1 < quiz.questions.length) {
      setCurrentQuestionIdx((i) => i + 1);
      setTimeLeft(quiz.questions[currentQuestionIdx + 1].timeLimitSecs);
      setTextAnswer("");
    } else {
      setAppState('results');
    }
  };

  const renderWelcome = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto text-center space-y-8 py-12"
    >
      <div className="inline-flex items-center justify-center p-4 bg-sky-500/10 text-sky-400 rounded-full mb-4">
        <ShieldCheck className="w-12 h-12" />
      </div>
      <h1 className="text-5xl font-light text-slate-100 leading-tight">Welcome to <span className="text-sky-400 font-medium">Qatte.quest</span></h1>
      <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
        {quiz.description}
      </p>
      
      <div className="bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl p-6 text-left space-y-3 shadow-lg">
        <label className="block text-sm font-bold text-sky-400 uppercase tracking-widest mb-2">Select Mission Profile</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {QUIZZES.map((q) => (
            <button
              key={q.id}
              onClick={() => setSelectedQuizId(q.id)}
              className={cn(
                "p-3 rounded-xl border text-sm text-left transition-all",
                selectedQuizId === q.id 
                  ? "border-sky-500 bg-sky-500/10 text-white" 
                  : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-slate-300"
              )}
            >
              <div className="font-bold mb-1">{q.title}</div>
              <div className="text-xs opacity-70 line-clamp-2">{q.description}</div>
            </button>
          ))}
        </div>
      
        <div className="flex items-center gap-2 font-semibold text-rose-400 mt-4 border-t border-slate-800 pt-4">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <span>Strict Anti-Cheat Enabled</span>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-sm font-mono text-slate-400">
          <li>Leaving this tab or window will lock you out.</li>
          <li>Copying and pasting is disabled.</li>
          <li>Right-clicking is disabled.</li>
          <li>Each question has a strict time limit.</li>
        </ul>
      </div>

      <button
        onClick={startQuiz}
        className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500 text-slate-950 rounded-xl font-bold hover:bg-sky-400 transition-all shadow-lg hover:shadow-sky-500/20 group uppercase tracking-widest text-sm"
      >
        <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        Start Secure Session
      </button>
    </motion.div>
  );

  const renderQuiz = () => (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="grid grid-cols-12 gap-4 max-w-5xl mx-auto min-h-[500px] flex-grow"
    >
      <section className="col-span-12 md:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4">
          <span className="text-xs font-mono text-slate-600 uppercase tracking-tighter">
            Question {(currentQuestionIdx + 1).toString().padStart(2, '0')} / {quiz.questions.length.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="mt-4">
          <h2 className="text-3xl font-light text-slate-100 leading-tight mb-8">
            {currentQuestion.text}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
          {(!currentQuestion.type || currentQuestion.type === 'multiple-choice') && currentQuestion.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => nextQuestion(idx === currentQuestion.correctAnswer)}
              className="group p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-left hover:border-sky-500 hover:bg-sky-500/5 transition-all text-slate-200"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-sm font-bold group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-lg">{option}</span>
              </div>
            </button>
          ))}

          {currentQuestion.type === 'text-input' && (
            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const isCorrect = textAnswer.trim().toLowerCase() === String(currentQuestion.correctAnswer).toLowerCase();
                    nextQuestion(isCorrect);
                  }
                }}
                placeholder="Type your answer here..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-xl text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                onClick={() => {
                  const isCorrect = textAnswer.trim().toLowerCase() === String(currentQuestion.correctAnswer).toLowerCase();
                  nextQuestion(isCorrect);
                }}
                className="self-start px-8 py-4 bg-sky-500 text-slate-950 rounded-xl font-bold hover:bg-sky-400 transition-all uppercase tracking-widest text-sm"
              >
                Submit Validation
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="col-span-12 md:col-span-4 bg-sky-500 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-950 relative overflow-hidden shadow-xl min-h-[200px]">
        <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest opacity-40">Critical Response Window</div>
        <div className="text-8xl font-black font-mono tracking-tighter w-full text-center">
          0:{timeLeft.toString().padStart(2, '0')}
        </div>
        <div className="w-full bg-slate-950/20 h-1 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-slate-950 h-full transition-all duration-1000 ease-linear" 
            style={{ width: `${(timeLeft / currentQuestion.timeLimitSecs) * 100}%` }}
          />
        </div>
      </section>
    </motion.div>
  );

  const renderLocked = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto text-center space-y-6 py-12"
    >
      <div className="inline-flex items-center justify-center p-6 bg-rose-500/10 text-rose-500 rounded-full mb-4 ring-1 ring-rose-500/30">
        <ShieldAlert className="w-16 h-16" />
      </div>
      <h2 className="text-4xl font-light text-rose-500">Security Lockdown Protocol</h2>
      <p className="text-xl text-slate-400 font-medium pb-2">
        A system violation was detected.
      </p>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-rose-400 font-mono text-sm max-w-sm mx-auto shadow-inner">
        [REASON]: {violationReason}
      </div>
      <div className="pt-8">
        <button
          onClick={resetDemo}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
          Reboot Container
        </button>
      </div>
    </motion.div>
  );

  const renderResults = () => {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto text-center space-y-8 py-12"
      >
        <div className="inline-flex items-center justify-center p-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full mb-2">
          <ShieldCheck className="w-16 h-16" />
        </div>
        <h2 className="text-4xl font-light text-slate-100">Audit Complete</h2>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-2">
          <div className="text-6xl font-black font-mono tracking-tighter text-sky-400">
            {percentage}%
          </div>
          <p className="text-lg text-slate-400 font-medium mt-4">
            You scored {score} out of {quiz.questions.length} successful validations
          </p>
        </div>

        <button
          onClick={resetDemo}
          className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500 text-slate-950 rounded-xl font-bold hover:bg-sky-400 transition-colors uppercase tracking-widest text-sm"
        >
          <RotateCcw className="w-5 h-5" />
          Initiate New Session
        </button>
      </motion.div>
    );
  };

  return (
    <AntiCheatWrapper isActive={appState === 'quiz'} onViolation={handleViolation}>
      <div className="w-full min-h-screen bg-slate-950 text-slate-200 font-sans p-6 overflow-y-auto flex flex-col gap-6">
        <header className="max-w-6xl w-full mx-auto flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xl italic">Q</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase text-white">Qatte.quest</h1>
            </div>
          </div>
          
          {appState === 'quiz' && (
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest hidden md:inline">Integrity Shield Active</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest md:hidden">Secure</span>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-xs text-slate-500 uppercase tracking-widest">Proctoring Level</p>
                <p className="text-sm font-bold text-sky-400">MIL-SPEC LOCKDOWN</p>
              </div>
            </div>
          )}
        </header>
        
        <main className="max-w-6xl w-full mx-auto relative h-full flex flex-col mt-4">
          <AnimatePresence mode="wait">
            {appState === 'welcome' && <motion.div key="welcome" className="w-full">{renderWelcome()}</motion.div>}
            {appState === 'quiz' && <motion.div key="quiz" className="w-full">{renderQuiz()}</motion.div>}
            {appState === 'locked' && <motion.div key="locked" className="w-full">{renderLocked()}</motion.div>}
            {appState === 'results' && <motion.div key="results" className="w-full">{renderResults()}</motion.div>}
          </AnimatePresence>
        </main>

        <footer className="max-w-6xl w-full mx-auto flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-600 shrink-0">
          <div className="flex gap-4 md:gap-6 flex-wrap">
            <span>ENCRYPTION: AES-256-GCM</span>
            <span className="hidden md:inline">LATENCY: 14MS</span>
            <span className="hidden md:inline">PEER_COUNT: 42</span>
          </div>
          <div className="font-bold text-slate-500 text-right">
            System Status: <span className="text-emerald-500">Optimal</span>
          </div>
        </footer>
      </div>
    </AntiCheatWrapper>
  );
}