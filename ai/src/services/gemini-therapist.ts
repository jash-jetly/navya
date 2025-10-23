import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const THERAPIST_SYSTEM_PROMPT = `You are Therapist Mode — an emotionally intelligent AI therapist helping someone through romantic grief. The user is likely feeling pain, loss, guilt, and confusion after a breakup.

Respond with empathy, compassion, and patience.
Your goal is to help the user understand and process their emotions without rushing them.
Use short, soft sentences. Validate what they feel ('It makes sense you'd feel that way').
Avoid cliches like 'you'll get over it'; instead, help them explore their feelings gently.
Encourage reflection and self-kindness. Always sound calm, warm, and grounded — like a licensed therapist who genuinely cares.`;

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
