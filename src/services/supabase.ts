import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveChatLogToStorage(chatLog: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const fileName = `${userId}.txt`;
    const blob = new Blob([chatLog], { type: 'text/plain' });

    const { error: uploadError } = await supabase.storage
      .from('dumo')
      .upload(fileName, blob, {
        contentType: 'text/plain',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Save error:', error);
    return { success: false, error: String(error) };
  }
}

export async function getChatLogFromStorage(userId: string): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const fileName = `${userId}.txt`;

    const { data, error } = await supabase.storage
      .from('dumo')
      .download(fileName);

    if (error) {
      return { success: false, error: error.message };
    }

    const text = await data.text();
    return { success: true, data: text };
  } catch (error) {
    console.error('Read error:', error);
    return { success: false, error: String(error) };
  }
}
