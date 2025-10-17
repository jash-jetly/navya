import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

export async function generateFlowChart(userInput: string) {
  try {
    const prompt = `You are an expert system architect. Based on this app idea: "${userInput}"

    Generate a valid Mermaid.js flowchart that shows the complete user flow and system architecture.
    
    CRITICAL REQUIREMENTS:
    - Start with exactly "flowchart TD" (no extra characters)
    - Use only alphanumeric node IDs (A, B, C, etc.)
    - Use proper arrow syntax: --> for connections
    - Use [] for rectangles, {} for diamonds, () for rounded rectangles
    - No special characters in node IDs
    - Each line must be properly formatted
    - No empty lines between flowchart elements
    
    Return ONLY the Mermaid code, no explanations, no markdown backticks.
    
    Example:
    flowchart TD
        A[Start] --> B[Login Page]
        B --> C{Valid User?}
        C -->|Yes| D[Dashboard]
        C -->|No| B
        D --> E[Features]
    
    Generate for: ${userInput}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let mermaidCode = response.text().trim();
    
    // Clean up the response to ensure valid Mermaid syntax
    mermaidCode = mermaidCode.replace(/```mermaid/g, '').replace(/```/g, '');
    mermaidCode = mermaidCode.trim();
    
    // Ensure it starts with flowchart
    if (!mermaidCode.startsWith('flowchart')) {
      mermaidCode = 'flowchart TD\n' + mermaidCode;
    }
    
    return mermaidCode;
  } catch (error) {
    console.error('Error generating flowchart:', error);
    // Return a fallback flowchart
    return `flowchart TD
        A[User Input] --> B[Process Request]
        B --> C[Generate Response]
        C --> D[Display Result]`;
  }
}