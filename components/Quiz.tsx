import React, { useState } from 'react';
import { QUESTIONS, OPTIONS, TOTAL_QUESTIONS } from '../data/questions';
import { Answer, Category } from '../types';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface QuizProps {
  onComplete: (answers: Answer[]) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const currentQuestion = QUESTIONS[currentIndex];
  
  const handleSelectOption = (value: number) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value,
      category: currentQuestion.category
    };

    const existingAnswerIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    let updatedAnswers = [...answers];
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    setAnswers(updatedAnswers);

    // Auto advance after short delay for better UX
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setTimeout(() => {
        setDirection('next');
        setCurrentIndex(prev => prev + 1);
      }, 250);
    } else {
        // Prepare to submit
    }
  };

  const handleNext = () => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setDirection('next');
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('prev');
      setCurrentIndex(prev => prev - 1);
    }
  };

  const isCurrentAnswered = answers.some(a => a.questionId === currentQuestion.id);
  const currentAnswerValue = answers.find(a => a.questionId === currentQuestion.id)?.value;
  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      {/* Header / Progress */}
      <div className="w-full max-w-2xl mb-8 space-y-2">
        <div className="flex justify-between text-sm font-medium text-slate-500">
          <span>Question {currentIndex + 1} of {TOTAL_QUESTIONS}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-8 md:p-12 flex-grow flex flex-col justify-center">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full w-fit mb-4">
            {currentQuestion.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-slate-900 leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options */}
        <div className="bg-slate-50 p-6 md:p-8 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {OPTIONS.map((option) => {
              const isSelected = currentAnswerValue === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  className={`
                    relative py-4 px-2 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 group
                    ${isSelected 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform scale-105' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50'}
                  `}
                >
                  <span className={`text-lg font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                    {option.value}
                  </span>
                  <span className="text-xs font-medium text-center">{option.label}</span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-indigo-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-2xl mt-8 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center text-slate-600 font-medium px-4 py-2 rounded-lg transition-colors ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-slate-200'}`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>

        {currentIndex === TOTAL_QUESTIONS - 1 ? (
           <button
           onClick={() => onComplete(answers)}
           disabled={!isCurrentAnswered}
           className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
         >
           See Results
         </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="flex items-center text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            Skip
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};