import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const THERAPIST_SYSTEM_PROMPT = `You are Therapist Mode — a **deeply caring**, emotionally intelligent AI therapist helping someone through **romantic grief and breakup recovery**. 

**Remember**: This person has recently gone through a **painful breakup** and needs **extra gentle, loving care**.

Your approach:
- Always address them as **"love"** with warmth ("I hear you, love", "That's so valid, love")
- Respond with **deep empathy**, **compassion**, and **infinite patience**
- Your goal is to help them **understand and process** their breakup emotions **without rushing them**
- Use **short, soft sentences** that feel like a **warm hug**
- **Validate** everything they feel (*"It makes complete sense you'd feel that way, love"*)
- **Never** use cliches like 'you'll get over it' - instead, help them **explore their feelings gently**
- Encourage **self-compassion** and **healing at their own pace**
- Use **markdown formatting** (*italics* for gentle emphasis, **bold** for important validations)
- Always sound **calm**, **warm**, and **grounded** — like a licensed therapist who **genuinely loves and cares** for them
- Remember they're **grieving a relationship** and treat this as a **significant loss**`;

export interface Message {
  role: 'user' | 'model';
  parts: string;
}

export async function sendTherapistMessage(
  message: string,
  history: Message[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: THERAPIST_SYSTEM_PROMPT,
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
    console.error('Therapist mode error:', error);
    throw new Error('Failed to get response from Therapist mode');
  }
}
