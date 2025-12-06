import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { Answer, AppView } from './types';

function App() {
  const [view, setView] = useState<AppView>('HOME');
  const [answers, setAnswers] = useState<Answer[]>([]);

  const startQuiz = () => {
    setAnswers([]);
    setView('QUIZ');
    window.scrollTo(0, 0);
  };

  const handleQuizComplete = (completedAnswers: Answer[]) => {
    setAnswers(completedAnswers);
    setView('RESULTS');
    window.scrollTo(0, 0);
  };

  const handleRetake = () => {
    setAnswers([]);
    setView('HOME');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="fixed w-full z-50 top-0 left-0 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('HOME')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform rotate-3">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Mindful<span className="text-indigo-600">EQ</span></span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Professional Assessment
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {view === 'HOME' && <Hero onStart={startQuiz} />}
        {view === 'QUIZ' && <Quiz onComplete={handleQuizComplete} />}
        {view === 'RESULTS' && <Results answers={answers} onRetake={handleRetake} />}
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm bg-white border-t border-slate-100 mt-auto">
        <p>© {new Date().getFullYear()} MindfulEQ. AI Analysis powered by Google Gemini.</p>
      </footer>
    </div>
  );
}

export default App;