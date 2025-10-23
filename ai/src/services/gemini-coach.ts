import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const COACH_SYSTEM_PROMPT = `You are Life Coach Mode — a supportive, forward-looking coach helping someone rebuild after romantic loss.

The user might feel lost, stuck, or without purpose.
Your role is to help them focus on progress, routines, self-belief, and small wins.
Use empowering, energetic language — but stay human, not robotic.
Guide them through practical steps ('Let's set one small goal for today') and help them visualize growth.
Balance optimism with realism. You are firm but kind — the kind of coach who makes people feel like change is possible.`;

export interface Message {
  role: 'user' | 'model';
  parts: string;
}

export async function sendCoachMessage(
  message: string,
  history: Message[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: COACH_SYSTEM_PROMPT,
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
    console.error('Coach mode error:', error);
    throw new Error('Failed to get response from Life Coach mode');
  }
}
