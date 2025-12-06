import React from 'react';
import { Brain, Heart, ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in-up">
        
        <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-100 mb-4">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-medium text-slate-600">Powered by Gemini 2.5 AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
          Discover Your <span className="text-indigo-600">Emotional Intelligence</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Self-awareness is the first step to growth. Take our scientifically-structured assessment to understand your EQ score, uncover your strengths, and receive AI-personalized advice for improvement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto py-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-blue-100 rounded-xl mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-slate-800">Self-Awareness</h3>
            <p className="text-sm text-slate-500 mt-2">Understand your emotions and their impact.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-rose-100 rounded-xl mb-4">
              <Heart className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="font-semibold text-lg text-slate-800">Empathy</h3>
            <p className="text-sm text-slate-500 mt-2">Connect deeper with the people around you.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-indigo-100 rounded-xl mb-4">
              <Zap className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-lg text-slate-800">Regulation</h3>
            <p className="text-sm text-slate-500 mt-2">Manage stress and reactions effectively.</p>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-xs text-slate-400 mt-8">
          Takes approx. 3 minutes • 15 Questions • Instant Results
        </p>
      </div>
    </div>
  );
};