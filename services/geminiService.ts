import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResponse, AssessmentResult } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateEQAnalysis = async (result: AssessmentResult): Promise<AIAnalysisResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `
    Analyze the following Emotional Intelligence (EQ) test results.
    Total Score: ${result.totalScore} / ${result.maxScore}
    Level: ${result.level}
    
    Category Breakdowns (Score / Max):
    ${Object.entries(result.categoryScores).map(([cat, score]) => `- ${cat}: ${score} / ${result.categoryMaxScores[cat as keyof typeof result.categoryMaxScores]}`).join('\n')}

    Provide a professional, psychological analysis in JSON format.
    The tone should be encouraging but honest.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "A 2-3 sentence overview of the user's emotional intelligence profile." },
      strengths: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 2-3 key strengths based on high scoring categories."
      },
      weaknesses: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 2-3 areas for improvement based on lower scores."
      },
      actionableTips: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3 specific, actionable exercises or habits to improve EQ."
      }
    },
    required: ["summary", "strengths", "weaknesses", "actionableTips"]
  };

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = result.text;
    if (!text) {
        throw new Error("Empty response from AI");
    }
    return JSON.parse(text) as AIAnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return a fallback if AI fails to ensure app doesn't crash
    return {
      summary: "We calculated your score but could not generate a personalized analysis at this moment.",
      strengths: ["Self-Reflection", "Completing the assessment"],
      weaknesses: ["AI Connectivity"],
      actionableTips: ["Review your category scores manually", "Reflect on the questions you scored lowest on"]
    };
  }
};