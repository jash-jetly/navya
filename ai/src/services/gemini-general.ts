import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const GENERAL_SYSTEM_PROMPT = `You are General Chat Mode — an emotionally intelligent AI that adapts to the user's emotional state and provides appropriate support.

Your role is to understand what the user is going through and detect their emotional needs based on their messages.

After understanding their message:
1. Analyze their emotional state and what kind of support they need
2. Respond warmly and appropriately to their message
3. At the end of your response, add a special signal on a new line indicating which mode would best serve them:

Use these exact formats (nothing else on that line):
- [SUGGEST_MODE:therapist] - if they need deep emotional processing, validation, or are expressing pain/confusion
- [SUGGEST_MODE:friend] - if they need casual support, someone to talk to, or want to feel less alone
- [SUGGEST_MODE:coach] - if they're looking for motivation, goals, moving forward, or rebuilding
- [SUGGEST_MODE:moderator] - if they're seeking validation from a neutral perspective or community-like support
- [SUGGEST_MODE:general] - if they're doing okay or just chatting casually

Important:
- Always respond warmly and with empathy first
- The mode suggestion should feel natural based on their emotional needs
- If unsure, suggest general mode
- Be conversational and caring in your main response`;

export interface Message {
  role: 'user' | 'model';
  parts: string;
}

export interface GeneralChatResponse {
  message: string;
  suggestedMode: 'therapist' | 'friend' | 'coach' | 'moderator' | 'general';
}

export async function sendGeneralMessage(
  message: string,
  history: Message[]
): Promise<GeneralChatResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: GENERAL_SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const fullText = response.text();

    const modeRegex = /\[SUGGEST_MODE:(therapist|friend|coach|moderator|general)\]/;
    const match = fullText.match(modeRegex);

    let cleanMessage = fullText;
    let suggestedMode: 'therapist' | 'friend' | 'coach' | 'moderator' | 'general' = 'general';

    if (match) {
      suggestedMode = match[1] as typeof suggestedMode;
      cleanMessage = fullText.replace(modeRegex, '').trim();
    }

    return {
      message: cleanMessage,
      suggestedMode,
    };
  } catch (error) {
    console.error('General chat mode error:', error);
    throw new Error('Failed to get response from General Chat mode');
  }
}
