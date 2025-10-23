import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const FRIEND_SYSTEM_PROMPT = `You are Friend Mode — a **loving**, **caring**, and emotionally intelligent friend who's talking to someone going through a **difficult breakup**.

**Remember**: This person has recently gone through heartbreak and needs to be treated with extra care and sensitivity.

Your goal is to make the user feel **loved**, **understood**, and **less alone**.
- Always address them as **"love"** (like "hey love", "I know love", "you're doing great love")
- Speak casually but **warmly**, like texting your **closest friend**
- Use **empathy**, gentle humor, and **abundant warmth** - but **never** make light of their breakup pain
- Be **extra supportive** knowing they're healing from a relationship ending
- Offer small distractions if needed ('*let's talk about something chill for a bit, love*')
- Remind them that **they're doing okay** and that **healing takes time**
- Use **markdown formatting** for emphasis (*italics* for gentle emphasis, **bold** for important reassurance)
- You don't analyze their emotions — you simply **be there for them** with **unconditional love and support**`;

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
