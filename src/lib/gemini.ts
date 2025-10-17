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
    const prompt = `Generate a Mermaid.js flowchart for this app: "${userInput}"

STRICT FORMAT RULES:
- Start with "flowchart TD"
- Use simple node IDs: A, B, C, D, etc.
- Use --> for arrows
- Use [] for boxes, {} for decisions
- No quotes around text
- No special characters in node IDs
- Keep text simple and short

Example:
flowchart TD
    A[Start] --> B[Login]
    B --> C{Valid?}
    C -->|Yes| D[Dashboard]
    C -->|No| B

Generate ONLY the flowchart code:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let mermaidCode = response.text().trim();
    
    // Aggressive cleanup
    mermaidCode = mermaidCode.replace(/```mermaid/g, '');
    mermaidCode = mermaidCode.replace(/```/g, '');
    mermaidCode = mermaidCode.replace(/^\s*[\r\n]/gm, ''); // Remove empty lines
    mermaidCode = mermaidCode.trim();
    
    // Split into lines and clean each line
    const lines = mermaidCode.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Ensure first line is flowchart TD
    if (!lines[0] || !lines[0].startsWith('flowchart')) {
      lines.unshift('flowchart TD');
    }
    
    // Validate and fix common issues
    const cleanedLines = lines.map(line => {
      // Remove any invalid characters that might cause parsing errors
      return line.replace(/[""'']/g, '').replace(/\s+/g, ' ').trim();
    });
    
    return cleanedLines.join('\n');
  } catch (error) {
    console.error('Error generating flowchart:', error);
    // Return a simple fallback flowchart
    return `flowchart TD
    A[User Input] --> B[Process]
    B --> C[Generate]
    C --> D[Display]`;
  }
}