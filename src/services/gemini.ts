import { ChatMessage } from '../types';
import { getCompleteAppDataFromStorage } from './supabase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function sendGeminiMessage(messages: ChatMessage[], userPrompt: string): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const conversationHistory = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are an incredibly supportive and encouraging AI mentor for startup founders. Your mission is to inspire, motivate, and guide entrepreneurs to build amazing businesses. 

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

export async function generatePersonalizedFeatures(chatLog: string, visionMission?: { vision: string; mission: string }): Promise<{ success: boolean; features?: Array<{id: string, name: string, description: string}>; error?: string }> {
  try {
    const vmText = visionMission ? `Vision: ${visionMission.vision}\nMission: ${visionMission.mission}\n\n` : '';
    
    const prompt = `**INCREDIBLE!** Based on this founder's amazing startup idea, generate 8-10 **PERSONALIZED FEATURES** that are specifically tailored to their business concept!

${vmText}**Chat Log:**
${chatLog}

**YOUR MISSION:** Analyze their startup idea and create features that are:
- **HIGHLY RELEVANT** to their specific business model
- **STRATEGICALLY IMPORTANT** for their target market
- **TECHNICALLY FEASIBLE** for an MVP
- **BUSINESS-CRITICAL** for their success

**RESPONSE FORMAT (JSON ONLY):**
Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "feature-slug",
    "name": "Feature Name",
    "description": "Detailed description of why this feature is crucial for their startup"
  }
]

**EXAMPLE FEATURES TO INSPIRE YOU:**
- User onboarding flows
- Core business functionality
- Payment/monetization features
- User engagement tools
- Analytics and insights
- Communication features
- Content management
- Search and discovery
- Social features
- Admin tools

**Generate personalized features NOW - make this founder's vision come alive!**`;

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
    let featuresText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up the response to extract JSON
    featuresText = featuresText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const features = JSON.parse(featuresText);
      return { success: true, features };
    } catch (parseError) {
      console.error('Failed to parse features JSON:', parseError);
      // Fallback to default features if parsing fails
      const defaultFeatures = [
        { id: 'user-auth', name: 'User Authentication', description: 'Essential user registration and login system' },
        { id: 'core-feature', name: 'Core Business Feature', description: 'The main functionality that drives your business value' },
        { id: 'dashboard', name: 'User Dashboard', description: 'Central hub for users to manage their experience' },
        { id: 'payments', name: 'Payment System', description: 'Monetization and transaction processing' },
        { id: 'analytics', name: 'Analytics & Insights', description: 'Track performance and user behavior' }
      ];
      return { success: true, features: defaultFeatures };
    }
  } catch (error) {
    console.error('Gemini features generation error:', error);
    return { success: false, error: String(error) };
  }
}

export async function generateFlowchartFromChatLog(chatLog: string, selectedFeatures: string[]): Promise<{ success: boolean; mermaidCode?: string; error?: string }> {
  try {
    // First, try to get complete context from user.txt file
    const storageResult = await getCompleteAppDataFromStorage();
    let contextData: any = null;
    
    if (storageResult.success && storageResult.data) {
      contextData = storageResult.data;
      console.log('**Using complete context from user.txt file for flowchart generation**');
    } else {
      console.log('**Fallback: Using provided chat log for flowchart generation**');
    }

    const featuresText = selectedFeatures.join(', ');

    // Build comprehensive context from stored data
    let fullContext = '';
    
    if (contextData) {
      fullContext = `
**COMPLETE USER CONTEXT:**

**CONVERSATION HISTORY:**
${contextData.formattedConversation || chatLog}

**VISION & MISSION:**
${contextData.visionMission ? `Vision: ${contextData.visionMission.vision}\nMission: ${contextData.visionMission.mission}` : 'Not provided'}

**SELECTED FEATURES:**
${contextData.selectedFeatures ? contextData.selectedFeatures.join(', ') : featuresText}

**CONVERSATION SUMMARY:**
- Total Messages: ${contextData.summary?.totalMessages || 'Unknown'}
- User Messages: ${contextData.summary?.userMessages || 'Unknown'}
- AI Responses: ${contextData.summary?.aiResponses || 'Unknown'}
`;
    } else {
      fullContext = `
**CHAT LOG:**
${chatLog}

**SELECTED FEATURES:**
${featuresText}
`;
    }

    const prompt = `**CONGRATULATIONS!** You're about to create an amazing flowchart that will bring this startup vision to life! 

You have access to the COMPLETE context of this user's startup journey. Use ALL of this information to create the most comprehensive and accurate flowchart possible.

${fullContext}

**YOUR MISSION:** Create a detailed flowchart that maps the user-flows for this incredible app, incorporating:
- **The complete conversation context** - understand what the user really wants
- **Their vision and mission** - align the flowchart with their goals
- **All selected features** - ensure every feature is properly represented
- **User journey flows** - from onboarding to core functionality

**CRITICAL MERMAID SYNTAX RULES:**
- Use ONLY alphanumeric characters and underscores for node IDs (no spaces, special characters, or parentheses)
- Node labels should be in square brackets: [Label Text]
- Use simple arrow connections: A --> B
- Avoid complex shapes or special characters in node IDs
- Keep node IDs short and descriptive like: start, login, dashboard, etc.

**EXAMPLE FORMAT:**
flowchart TD
    start[Start] --> login[User Login]
    login --> dashboard[Dashboard]
    dashboard --> feature1[Feature 1]
    feature1 --> end[Complete]

**REQUIREMENTS:**
- Return ONLY the Mermaid.js code block without any markdown formatting or explanation
- Use simple, clean node IDs without special characters
- Make it comprehensive and professional - this founder deserves the best!
- Include ALL the features they selected
- Reflect their actual business vision and user needs

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

    // Clean up the mermaid code
    mermaidCode = mermaidCode.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Additional cleanup for common syntax issues
    const cleanedLines = mermaidCode.split('\n').map((line: string) => {
      // Remove parentheses and special characters from node IDs
      return line.replace(/\([^)]*\)/g, '').replace(/[^\w\[\]\->\s:]/g, '');
    });
    
    mermaidCode = cleanedLines.join('\n');

    console.log('**Flowchart generated using complete user context!**');
    return { success: true, mermaidCode };
  } catch (error) {
    console.error('Gemini flowchart generation error:', error);
    return { success: false, error: String(error) };
  }
}
