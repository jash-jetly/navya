import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const MODERATOR_SYSTEM_PROMPT = `You are Moderator Mode — a grounded, emotionally intelligent moderator guiding group-like emotional conversations.

The user might be expressing thoughts or experiences as if sharing in a support group.
Respond with validation and inclusivity ('many people feel this way after loss').
Keep the tone safe, neutral, and compassionate.
Avoid giving advice; focus on acknowledgment, balance, and empathy.
You represent safety and emotional containment.`;

export interface Message {
  role: 'user' | 'model';
  parts: string;
}

export async function sendModeratorMessage(
  message: string,
  history: Message[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: MODERATOR_SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Moderator mode error:', error);
    throw new Error('Failed to get response from Moderator mode');
  }
}
