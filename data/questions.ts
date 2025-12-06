import { Category, Question, Option } from '../types';

export const OPTIONS: Option[] = [
  { label: 'Always', value: 5 },
  { label: 'Often', value: 4 },
  { label: 'Sometimes', value: 3 },
  { label: 'Rarely', value: 2 },
  { label: 'Never', value: 1 },
];

export const QUESTIONS: Question[] = [
  // Self Awareness
  { id: 1, text: "I can recognize my emotions as I experience them.", category: Category.SELF_AWARENESS },
  { id: 2, text: "I know my strengths and weaknesses clearly.", category: Category.SELF_AWARENESS },
  { id: 3, text: "I understand how my mood affects my behavior.", category: Category.SELF_AWARENESS },
  
  // Self Regulation
  { id: 4, text: "I can stay calm under pressure.", category: Category.SELF_REGULATION },
  { id: 5, text: "I manage my stress effectively.", category: Category.SELF_REGULATION },
  { id: 6, text: "I think before I act, rather than reacting impulsively.", category: Category.SELF_REGULATION },

  // Motivation
  { id: 7, text: "I set measurable goals for myself and work towards them.", category: Category.MOTIVATION },
  { id: 8, text: "I am driven by personal achievement rather than external rewards.", category: Category.MOTIVATION },
  { id: 9, text: "I stay optimistic even when things go wrong.", category: Category.MOTIVATION },

  // Empathy
  { id: 10, text: "I can understand how others are feeling even if they don't say it.", category: Category.EMPATHY },
  { id: 11, text: "I actively listen to others without interrupting.", category: Category.EMPATHY },
  { id: 12, text: "I find it easy to put myself in someone else's shoes.", category: Category.EMPATHY },

  // Social Skills
  { id: 13, text: "I am able to resolve conflicts effectively.", category: Category.SOCIAL_SKILLS },
  { id: 14, text: "I can build and maintain healthy relationships.", category: Category.SOCIAL_SKILLS },
  { id: 15, text: "I communicate clearly and effectively.", category: Category.SOCIAL_SKILLS },
];

export const MAX_SCORE_PER_QUESTION = 5;
export const TOTAL_QUESTIONS = QUESTIONS.length;
export const MAX_TOTAL_SCORE = TOTAL_QUESTIONS * MAX_SCORE_PER_QUESTION;