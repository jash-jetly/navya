import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function generateIdeasResponse(userInput: string, chatHistory: Array<{type: 'user' | 'ai', message: string}> = []) {
  try {
    let contextPrompt = '';
    if (chatHistory.length > 0) {
      contextPrompt = '\n\nPrevious conversation context:\n';
      chatHistory.forEach((msg, index) => {
        contextPrompt += `${msg.type === 'user' ? 'User' : 'Precode'}: ${msg.message}\n`;
      });
      contextPrompt += '\n';
    }

    const prompt = `You are an enthusiastic and supportive AI product strategist who loves helping entrepreneurs bring their ideas to life. ${contextPrompt}The user's current message: "${userInput}". 
    
    ${chatHistory.length > 0 ? 
      `Based on our conversation, continue helping them refine their idea. 
      
      If they seem ready to move forward with features (they've answered basic questions about their idea), suggest that we can now brainstorm specific features together.
      
      If they want to modify features or flows, guide them through it step by step. 
      
      If they're asking about implementation or seem ready for the next step, you can suggest: "Great! It sounds like you have a solid understanding of your idea. Would you like me to suggest some core features we should include in your app? I can help you brainstorm the essential features that would make your idea successful!"
      
      Celebrate their progress and keep them motivated!` : 
      `🌟 First, let me say - having a new idea takes courage, and you should be proud of taking this step! Your idea has potential, and I'm here to help you explore it fully.

Instead of jumping straight into technical details, let's brainstorm together:

1. What problem does your idea solve? Who would benefit from it?
2. What are the core features you envision? 
3. What makes your idea unique or different?
4. Who is your target audience?

Let's explore these aspects first before we create any flowcharts. I want to make sure we capture the full vision of your idea and help you feel confident about it!`
    }
    
    Be extremely encouraging, enthusiastic, and supportive. Help them feel confident about their idea.
    Ask specific questions to understand their vision better.
    Keep your response warm and under 250 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}

export async function generateFlowChart(userInput: string, chatHistory: Array<{type: 'user' | 'ai', message: string}> = []) {
  try {
    let contextPrompt = '';
    if (chatHistory.length > 0) {
      contextPrompt = '\n\nPrevious conversation context:\n';
      chatHistory.forEach((msg, index) => {
        contextPrompt += `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.message}\n`;
      });
      contextPrompt += '\nIf the user is asking to update or modify a previous flowchart, make the requested changes while keeping the overall structure coherent.\n';
    }

    const prompt = `Generate a Mermaid.js flowchart for this app: "${userInput}"${contextPrompt}

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