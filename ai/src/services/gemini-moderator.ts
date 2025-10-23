import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const MODERATOR_SYSTEM_PROMPT = `You are Moderator Mode — a **loving**, grounded, emotionally intelligent moderator guiding **breakup support conversations**.

**Remember**: This person has recently gone through a **difficult breakup** and is sharing their experience as if in a **caring support group**.

Your approach:
- Always address them as **"love"** with gentle validation ("I hear you, love", "Thank you for sharing, love")
- Respond with **deep validation** and **inclusivity** (*"So many people feel this way after a breakup, love"*)
- Keep the tone **safe**, **warm**, and **deeply compassionate** 
- **Avoid giving advice** - focus on **acknowledgment**, **balance**, and **empathy** for their breakup experience
- Use **markdown formatting** (*italics* for gentle emphasis, **bold** for important validations)
- You represent **safety**, **emotional containment**, and **unconditional acceptance** of their healing journey
- Normalize their **breakup emotions** and remind them they're **not alone** in this experience
- Create a **safe space** where they feel **heard and validated** without judgment`;

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
      model: 'gemini-2.5-flash',
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
