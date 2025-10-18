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

    const prompt = `You are an enthusiastic and encouraging technical product strategist who specializes in helping new entrepreneurs bring their app ideas to life. You understand that many people feel uncertain about their ideas and need both technical guidance and emotional support. Be warm, supportive, and genuinely excited about their vision while focusing on technical app development. ${contextPrompt}The user's current message: "${userInput}". 
    
    ${chatHistory.length > 0 ? 
      `**I love seeing your idea evolve!** 🚀 Based on our conversation, let's continue building something amazing together.
      
      **You're doing great!** Every successful app started exactly where you are now. Let's focus on:
      - **User Flow**: How users will navigate through your app (this is where the magic happens!)
      - **Core Features**: Essential functionality that will make users love your app
      - **Technical Requirements**: What your app needs to accomplish (we'll make it happen!)
      - **User Experience**: How users will interact with each feature (this is your competitive advantage!)
      
      **✨ Your idea has real potential!** If you're feeling ready to move forward, I'd love to help you define the core features for your app. Once we finalize all features, I'll create a comprehensive user flow diagram that shows exactly how users will navigate through your amazing creation.
      
      **Ready to take the next step?** Would you like to finalize these features and create a user flow diagram that brings your vision to life?` : 
      `**🎉 Welcome to App Development Planning - You're in the right place!** 

**First, let me say this: Having an app idea puts you ahead of 99% of people!** 💡 Every successful app started with someone just like you, sitting where you are right now, wondering if their idea could work. Spoiler alert: it absolutely can!

**🚀 Let's turn your vision into reality! Here's what we'll discover together:**

**🔧 Technical Discovery (The Fun Part!):**
1. **Core Functionality**: What amazing things will your app do? (I'm already excited!)
2. **User Journey**: How will users fall in love with your app experience?
3. **Key Screens**: What screens will make users go "wow, this is exactly what I needed!"
4. **User Actions**: What will users be able to accomplish with your app?

**📱 Development Focus (Your Success Blueprint):**
- User flow and navigation (making it intuitive and delightful)
- Feature requirements (building what users actually want)
- Technical functionality (making it work seamlessly)
- User experience design (creating something users can't live without)

**💪 Remember: Every great app started with someone believing in their idea. I believe in yours too!**

Let's start by understanding your app's core functionality and user flow. What problem does your app solve, and how do you envision users interacting with it?`
    }
    
    **🎯 Your response should be:**
    - **Encouraging and supportive** - remind them their idea has value
    - **Technically focused** but accessible and exciting
    - **Confidence-building** - use phrases like "This is exactly the kind of thinking that leads to successful apps!"
    - **Action-oriented** - help them see clear next steps
    
    **Format guidelines:**
    - **Bold headings** for sections with encouraging language
    - Clear bullet points that build excitement
    - Proper spacing between sections
    - Use emojis sparingly but effectively to convey enthusiasm
    - Always end on an encouraging, forward-looking note
    
    Keep response under 350 words. Remember: You're not just giving technical advice, you're helping someone believe in their vision while providing expert guidance!`;

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

CRITICAL MERMAID SYNTAX RULES:
- Start with exactly "flowchart TD"
- Use ONLY alphanumeric node IDs: A, B, C, D, etc. (NO spaces, NO special chars)
- Use --> for arrows
- Use [] for rectangular boxes
- Use {} for diamond decision nodes
- Use () for rounded boxes
- Use |text| for arrow labels
- NO quotes around any text
- NO line breaks within node definitions
- Keep node text under 20 characters
- Each line must be a complete statement

VALID Example:
flowchart TD
    A[App Start] --> B[User Login]
    B --> C{Credentials Valid}
    C -->|Yes| D[Main Dashboard]
    C -->|No| E[Error Message]
    E --> B
    D --> F[Feature Access]

Generate ONLY the mermaid flowchart code with NO markdown formatting:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let mermaidCode = response.text().trim();
    
    // Comprehensive cleanup
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
      // Skip the flowchart TD line
      if (line.startsWith('flowchart')) return line;
      
      // Remove invalid characters and fix common syntax issues
      let cleanLine = line
        .replace(/[""'']/g, '') // Remove quotes
        .replace(/\s+/g, ' ') // Normalize spaces
        .replace(/-->/g, ' --> ') // Ensure proper arrow spacing
        .replace(/\|\s*([^|]+)\s*\|/g, '|$1|') // Fix arrow labels
        .trim();
      
      // Validate node IDs (must be alphanumeric)
      cleanLine = cleanLine.replace(/([A-Z]\d*)\s*\[/g, '$1['); // Fix node ID spacing
      cleanLine = cleanLine.replace(/([A-Z]\d*)\s*\{/g, '$1{'); // Fix decision node spacing
      cleanLine = cleanLine.replace(/([A-Z]\d*)\s*\(/g, '$1('); // Fix rounded node spacing
      
      return cleanLine;
    });
    
    // Filter out invalid lines
    const validLines = cleanedLines.filter(line => {
      if (line.startsWith('flowchart')) return true;
      // Must contain either --> or be a valid node definition
      return line.includes('-->') || /^[A-Z]\d*[\[\{\(]/.test(line);
    });
    
    return validLines.join('\n');
  } catch (error) {
    console.error('Error generating flowchart:', error);
    // Return a simple fallback flowchart
    return `flowchart TD
    A[User Input] --> B[Process]
    B --> C[Generate]
    C --> D[Display]`;
  }
}