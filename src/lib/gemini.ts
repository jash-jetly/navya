import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generateIdeasResponse(userInput: string) {
  try {
    const prompt = `You are an AI product strategist. The user wants to discuss their idea: "${userInput}". 
    
    Provide helpful insights, suggestions, and questions to help them develop their idea further. 
    Be encouraging, practical, and ask thoughtful follow-up questions.
    
    Keep your response conversational and under 200 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}