import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Save data to specific Supabase storage file, replacing content each time
export async function saveChatLogToStorage(chatLog: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Create the data object with timestamp and user info
    const appData = {
      userId,
      timestamp: new Date().toISOString(),
      chatLog,
      generatedAt: new Date().toLocaleString()
    };

    const dataString = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataString], { type: 'text/plain' });

    // Upload to the specific file, replacing existing content
    const { error } = await supabase.storage
      .from('dumo')
      .upload('user.txt', blob, {
        cacheControl: '3600',
        upsert: true // This replaces the existing file
      });

    if (error) {
      console.error('Supabase storage error:', error);
      // Fallback to localStorage if Supabase fails
      const key = `chatlog_${userId}`;
      localStorage.setItem(key, chatLog);
      console.log('**Saved to localStorage as fallback**');
      return { success: true };
    }

    console.log('**Chat log saved to Supabase storage successfully!** Data replaced in user.txt');
    return { success: true };
  } catch (error) {
    console.error('Save error:', error);
    // Fallback to localStorage
    try {
      const key = `chatlog_${userId}`;
      localStorage.setItem(key, chatLog);
      console.log('**Saved to localStorage as fallback**');
      return { success: true };
    } catch (localError) {
      return { success: false, error: String(error) };
    }
  }
}

export async function getChatLogFromStorage(userId: string): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    // First try to get from Supabase storage
    const { data, error } = await supabase.storage
      .from('dumo')
      .download('user.txt');

    if (!error && data) {
      const text = await data.text();
      const parsedData = JSON.parse(text);
      return { success: true, data: parsedData.chatLog };
    }

    // Fallback to localStorage
    const key = `chatlog_${userId}`;
    const localData = localStorage.getItem(key);
    
    if (!localData) {
      return { success: false, error: 'No chat log found' };
    }

    return { success: true, data: localData };
  } catch (error) {
    console.error('Read error:', error);
    
    // Fallback to localStorage
    try {
      const key = `chatlog_${userId}`;
      const localData = localStorage.getItem(key);
      
      if (!localData) {
        return { success: false, error: 'No chat log found' };
      }

      return { success: true, data: localData };
    } catch (localError) {
      return { success: false, error: String(error) };
    }
  }
}

// Enhanced function to save complete app data including detailed conversation
export async function saveAppDataToStorage(appData: {
  userId: string;
  chatMessages: Array<{ role: string; content: string; timestamp?: string }>;
  visionMission?: { vision: string; mission: string };
  selectedFeatures?: string[];
  mermaidCode?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Format conversation history with clear structure
    const conversationHistory = appData.chatMessages.map((msg, index) => ({
      messageNumber: index + 1,
      speaker: msg.role === 'user' ? 'USER' : 'AI_ASSISTANT',
      timestamp: msg.timestamp || new Date().toISOString(),
      content: msg.content
    }));

    const completeData = {
      // Metadata
      userId: appData.userId,
      timestamp: new Date().toISOString(),
      generatedAt: new Date().toLocaleString(),
      version: '2.0',
      
      // Complete conversation history
      conversationHistory,
      
      // Structured conversation for easy reading
      formattedConversation: appData.chatMessages.map(msg => 
        `${msg.role.toUpperCase()}: ${msg.content}`
      ).join('\n\n'),
      
      // Vision and Mission
      visionMission: appData.visionMission || null,
      
      // Selected features
      selectedFeatures: appData.selectedFeatures || [],
      
      // Generated flowchart code
      mermaidCode: appData.mermaidCode || null,
      
      // Summary for context
      summary: {
        totalMessages: appData.chatMessages.length,
        userMessages: appData.chatMessages.filter(msg => msg.role === 'user').length,
        aiResponses: appData.chatMessages.filter(msg => msg.role === 'assistant').length,
        hasVisionMission: !!appData.visionMission,
        featuresSelected: appData.selectedFeatures?.length || 0,
        hasFlowchart: !!appData.mermaidCode
      }
    };

    const dataString = JSON.stringify(completeData, null, 2);
    const blob = new Blob([dataString], { type: 'text/plain' });

    // Upload to the specific file, replacing existing content
    const { error } = await supabase.storage
      .from('dumo')
      .upload('user.txt', blob, {
        cacheControl: '3600',
        upsert: true // This replaces the existing file
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return { success: false, error: String(error) };
    }

    console.log('**Complete app data saved to Supabase storage!** Previous data replaced.');
    console.log(`Saved: ${conversationHistory.length} messages, vision/mission: ${!!appData.visionMission}, features: ${appData.selectedFeatures?.length || 0}`);
    return { success: true };
  } catch (error) {
    console.error('Save app data error:', error);
    return { success: false, error: String(error) };
  }
}

// Function to get complete app data from storage
export async function getCompleteAppDataFromStorage(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from('dumo')
      .download('user.txt');

    if (error || !data) {
      return { success: false, error: 'Failed to download user data' };
    }

    const text = await data.text();
    const parsedData = JSON.parse(text);
    
    return { success: true, data: parsedData };
  } catch (error) {
    console.error('Error reading complete app data:', error);
    return { success: false, error: String(error) };
  }
}
