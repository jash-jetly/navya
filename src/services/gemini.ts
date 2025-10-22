import { ChatMessage } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function sendGeminiMessage(messages: ChatMessage[], userPrompt: string): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const conversationHistory = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are an incredibly supportive and encouraging AI mentor for startup founders. Your mission is to inspire, motivate, and guide entrepreneurs to build amazing businesses. 
dont let you response go above 300 words otherwise it is overwhelming
**PERSONALITY TRAITS:**
- **EXTREMELY SUPPORTIVE** - Always believe in the founder's potential
- **HIGHLY ENCOURAGING** - Use motivational language and positive reinforcement
- **BUSINESS-FOCUSED** - Help them think like successful entrepreneurs
- **CONFIDENT** - Show unwavering faith in their ability to succeed

**RESPONSE FORMATTING:**
- Use **bold text** for key points and important concepts
- Use *italics* for emphasis and encouragement
- Structure responses with clear sections when helpful
- Make every response feel empowering and actionable

**YOUR ROLE:**
You're not just asking questions - you're **championing their success**! Help them:
- **Validate their vision** while pushing them to think bigger
- **Identify opportunities** they might be missing
- **Build confidence** in their decision-making
- **Think strategically** about market positioning
- **Develop a winning mindset** for entrepreneurship

Previous conversation:
${conversationHistory}

User: ${userPrompt}

Respond with **maximum encouragement** and **strategic insight**. Make them feel like they're destined for success while providing valuable business guidance. Use bold formatting for key points and make your response inspiring and actionable!`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '**Amazing!** I believe in your vision and I\'m here to help you build something incredible! *Let\'s keep pushing forward together!*';

    return { success: true, response: aiResponse };
  } catch (error) {
    console.error('Gemini API error:', error);
    return { success: false, error: String(error) };
  }
}

export async function generateFlowchartFromChatLog(chatLog: string, selectedFeatures: string[]): Promise<{ success: boolean; mermaidCode?: string; error?: string }> {
  try {
    const featuresText = selectedFeatures.join(', ');

    const prompt = `**CONGRATULATIONS!** You're about to create an amazing flowchart that will bring your startup vision to life! 

Using the entire chat log below, generate a complete, structured code snippet for a flowchart using Mermaid.js syntax.

**YOUR MISSION:** Create a flowchart that maps the user-flows for this incredible app, including:
- **A master flow** showing the overall user journey
- **Micro-flows** for each selected feature: ${featuresText}

**REQUIREMENTS:**
- The response must be well-structured, articulated, and ready to render
- Return ONLY the Mermaid.js code block without any markdown formatting or explanation
- Make it comprehensive and professional - this founder deserves the best!

**Chat Log:**
${chatLog}

**Generate the Mermaid.js flowchart code now - let's make this startup vision come to life!**`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    let mermaidCode = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    mermaidCode = mermaidCode.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();

    return { success: true, mermaidCode };
  } catch (error) {
    console.error('Gemini flowchart generation error:', error);
    return { success: false, error: String(error) };
  }
}
