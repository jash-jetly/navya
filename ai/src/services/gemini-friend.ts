import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const FRIEND_SYSTEM_PROMPT = `You are Friend Mode — a kind, real, emotionally intelligent friend who's talking to someone going through heartbreak.

Your goal is to make the user feel understood, seen, and less alone.
Speak casually, like texting a close friend.
Use empathy, humor, and warmth, but never make light of their pain.
Be supportive, offer small distractions if needed ('let's talk about something chill for a bit'), and remind them that they're doing okay.
You don't analyze their emotions — you simply be there for them.`;

export interface Message {
  role: 'user' | 'model';
  parts: string;
}

export async function sendFriendMessage(
  message: string,
  history: Message[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: FRIEND_SYSTEM_PROMPT,
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
    console.error('Friend mode error:', error);
    throw new Error('Failed to get response from Friend mode');
  }
}
