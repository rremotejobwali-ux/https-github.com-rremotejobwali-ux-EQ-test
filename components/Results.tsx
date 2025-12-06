import React, { useEffect, useState } from 'react';
import { Answer, AssessmentResult, Category, AIAnalysisResponse } from '../types';
import { MAX_SCORE_PER_QUESTION, MAX_TOTAL_SCORE, QUESTIONS } from '../data/questions';
import { generateEQAnalysis } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Loader2, Share2, RotateCcw, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface ResultsProps {
  answers: Answer[];
  onRetake: () => void;
}

export const Results: React.FC<ResultsProps> = ({ answers, onRetake }) => {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);

  useEffect(() => {
    calculateResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const calculateResults = () => {
    let totalScore = 0;
    const categoryScores: Record<Category, number> = {
      [Category.SELF_AWARENESS]: 0,
      [Category.SELF_REGULATION]: 0,
      [Category.MOTIVATION]: 0,
      [Category.EMPATHY]: 0,
      [Category.SOCIAL_SKILLS]: 0
    };
    
    // Calculate max possible scores per category
    const categoryCounts: Record<Category, number> = {
       [Category.SELF_AWARENESS]: 0,
       [Category.SELF_REGULATION]: 0,
       [Category.MOTIVATION]: 0,
       [Category.EMPATHY]: 0,
       [Category.SOCIAL_SKILLS]: 0
    };
    
    QUESTIONS.forEach(q => categoryCounts[q.category]++);
    const categoryMaxScores = {} as Record<Category, number>;
    Object.keys(categoryCounts).forEach(key => {
        categoryMaxScores[key as Category] = categoryCounts[key as Category] * MAX_SCORE_PER_QUESTION;
    });

    answers.forEach(ans => {
      totalScore += ans.value;
      if (ans.category) {
        categoryScores[ans.category] += ans.value;
      }
    });

    let level: AssessmentResult['level'] = 'Average';
    const percentage = (totalScore / MAX_TOTAL_SCORE) * 100;
    if (percentage < 50) level = 'Low';
    else if (percentage < 70) level = 'Average';
    else if (percentage < 85) level = 'High';
    else level = 'Exceptional';

    const calculatedResult = {
      totalScore,
      maxScore: MAX_TOTAL_SCORE,
      categoryScores,
      categoryMaxScores,
      level
    };

    setResult(calculatedResult);
    
    // Automatically trigger AI analysis
    fetchAIAnalysis(calculatedResult);
  };

  const fetchAIAnalysis = async (res: AssessmentResult) => {
    setLoadingAI(true);
    try {
      const aiResponse = await generateEQAnalysis(res);
      setAnalysis(aiResponse);
    } catch (err) {
      setErrorAI("Could not connect to AI service. Please check your internet connection.");
    } finally {
      setLoadingAI(false);
    }
  };

  if (!result) return null;

  // Prepare data for chart
  const chartData = Object.keys(result.categoryScores).map((key) => {
    const category = key as Category;
    return {
      name: category,
      score: result.categoryScores[category],
      max: result.categoryMaxScores[category],
      percentage: Math.round((result.categoryScores[category] / result.categoryMaxScores[category]) * 100)
    };
  });

  const getBarColor = (val: number) => {
    if (val < 50) return '#fb7185'; // rose-400
    if (val < 75) return '#fbbf24'; // amber-400
    return '#818cf8'; // indigo-400
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Your EQ Profile</h2>
          <div className="inline-flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-lg border border-indigo-100">
            <span className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-2">Total Score</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-6xl font-black text-indigo-600">{result.totalScore}</span>
              <span className="text-xl text-slate-400">/ {result.maxScore}</span>
            </div>
            <div className="mt-4 px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full font-semibold text-sm">
              Level: {result.level}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
               <span className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></span>
               Category Breakdown
             </h3>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                   <XAxis type="number" domain={[0, 100]} hide />
                   <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{fontSize: 12, fill: '#64748b'}} 
                    interval={0}
                   />
                   <Tooltip 
                     cursor={{fill: '#f1f5f9'}}
                     contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                   />
                   <Bar dataKey="percentage" barSize={24} radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                    ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* AI Analysis Section */}
          <div className="bg-gradient-to-br from-white to-indigo-50/50 p-6 rounded-2xl shadow-sm border border-indigo-100 relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                  <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
                  AI Insights
                </h3>
                {loadingAI && <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />}
             </div>
             
             {loadingAI ? (
               <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-4">
                 <div className="animate-pulse bg-slate-200 h-4 w-3/4 rounded"></div>
                 <div className="animate-pulse bg-slate-200 h-4 w-1/2 rounded"></div>
                 <div className="animate-pulse bg-slate-200 h-4 w-5/6 rounded"></div>
                 <p className="text-sm">Analyzing your responses...</p>
               </div>
             ) : analysis ? (
                <div className="space-y-6">
                  <div className="bg-white/80 p-4 rounded-xl border border-indigo-50">
                    <p className="text-slate-700 leading-relaxed italic">"{analysis.summary}"</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <h4 className="text-sm font-bold text-green-700 uppercase tracking-wide flex items-center">
                         <CheckCircle className="w-4 h-4 mr-1" /> Strengths
                       </h4>
                       <ul className="text-sm text-slate-600 space-y-1">
                         {analysis.strengths.map((s, i) => (
                           <li key={i} className="flex items-start">
                             <span className="mr-2">•</span>{s}
                           </li>
                         ))}
                       </ul>
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-sm font-bold text-rose-700 uppercase tracking-wide flex items-center">
                         <AlertCircle className="w-4 h-4 mr-1" /> Growth Areas
                       </h4>
                       <ul className="text-sm text-slate-600 space-y-1">
                         {analysis.weaknesses.map((w, i) => (
                           <li key={i} className="flex items-start">
                             <span className="mr-2">•</span>{w}
                           </li>
                         ))}
                       </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-indigo-100">
                    <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-3">Action Plan</h4>
                    <div className="space-y-3">
                      {analysis.actionableTips.map((tip, i) => (
                        <div key={i} className="flex items-start bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-slate-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
             ) : (
                <div className="text-center text-slate-500 py-10">
                  <p>{errorAI || "Unable to generate analysis."}</p>
                </div>
             )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-8">
           <button 
             onClick={onRetake}
             className="flex items-center px-6 py-3 bg-white text-slate-700 font-medium rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
           >
             <RotateCcw className="w-4 h-4 mr-2" />
             Retake Test
           </button>
           <button 
             onClick={() => window.print()}
             className="flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
           >
             <Share2 className="w-4 h-4 mr-2" />
             Save Results
           </button>
        </div>

      </div>
    </div>
  );
};