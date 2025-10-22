import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Using localStorage instead of Supabase storage to avoid RLS policy issues
export async function saveChatLogToStorage(chatLog: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const key = `chatlog_${userId}`;
    localStorage.setItem(key, chatLog);
    console.log('**Chat log saved successfully!** Your startup journey is being tracked locally.');
    return { success: true };
  } catch (error) {
    console.error('Save error:', error);
    return { success: false, error: String(error) };
  }
}

export async function getChatLogFromStorage(userId: string): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const key = `chatlog_${userId}`;
    const data = localStorage.getItem(key);
    
    if (!data) {
      return { success: false, error: 'No chat log found' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Read error:', error);
    return { success: false, error: String(error) };
  }
}
