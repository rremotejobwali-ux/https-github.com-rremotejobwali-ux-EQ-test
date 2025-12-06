// Quiz Core Types
export enum Category {
  SELF_AWARENESS = 'Self Awareness',
  SELF_REGULATION = 'Self Regulation',
  MOTIVATION = 'Motivation',
  EMPATHY = 'Empathy',
  SOCIAL_SKILLS = 'Social Skills'
}

export interface Question {
  id: number;
  text: string;
  category: Category;
}

export interface Option {
  label: string;
  value: number; // 1 to 5
}

export interface Answer {
  questionId: number;
  value: number;
  category: Category;
}

export interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  categoryScores: Record<Category, number>;
  categoryMaxScores: Record<Category, number>;
  level: 'Low' | 'Average' | 'High' | 'Exceptional';
}

// AI Analysis Types
export interface AIAnalysisResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  actionableTips: string[];
}

// Application State
export type AppView = 'HOME' | 'QUIZ' | 'RESULTS';