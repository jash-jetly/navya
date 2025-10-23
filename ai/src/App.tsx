import { useState, useRef, useEffect } from 'react';
import { ModeSelector, AIMode } from './components/ModeSelector';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { sendTherapistMessage } from './services/gemini-therapist';
import { sendFriendMessage } from './services/gemini-friend';
import { sendCoachMessage } from './services/gemini-coach';
import { sendModeratorMessage } from './services/gemini-moderator';
import { sendGeneralMessage } from './services/gemini-general';

interface Message {
  role: 'user' | 'model';
  parts: string;
}

function App() {
  const [mode, setMode] = useState<AIMode>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModeSwitch, setShowModeSwitch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (userMessage: string) => {
    const newUserMessage: Message = {
      role: 'user',
      parts: userMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setShowModeSwitch(false);

    try {
      let response: string;
      let suggestedMode: AIMode | null = null;
      const history = [...messages];

      switch (mode) {
        case 'general': {
          const generalResponse = await sendGeneralMessage(userMessage, history);
          response = generalResponse.message;
          suggestedMode = generalResponse.suggestedMode;
          break;
        }
        case 'therapist':
          response = await sendTherapistMessage(userMessage, history);
          break;
        case 'friend':
          response = await sendFriendMessage(userMessage, history);
          break;
        case 'coach':
          response = await sendCoachMessage(userMessage, history);
          break;
        case 'moderator':
          response = await sendModeratorMessage(userMessage, history);
          break;
        default:
          response = 'Something went wrong. Please try again.';
      }

      const aiMessage: Message = {
        role: 'model',
        parts: response,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (suggestedMode && suggestedMode !== 'general' && suggestedMode !== mode) {
        setTimeout(() => {
          setShowModeSwitch(true);
          setTimeout(() => {
            setMode(suggestedMode!);
            setShowModeSwitch(false);
          }, 2000);
        }, 500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'model',
        parts: 'I apologize, but I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: AIMode) => {
    setMode(newMode);
    setShowModeSwitch(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            BUB AI
          </h1>
          <p className="text-center text-gray-600 text-sm mb-4">
            Your companion through heartbreak and healing
          </p>
          <ModeSelector selectedMode={mode} onModeChange={handleModeChange} />
          {showModeSwitch && (
            <div className="mt-4 text-center">
              <p className="text-sm text-teal-600 font-medium animate-fade-in">
                Switching to a mode that might help you better...
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-container">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 max-w-md shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Welcome to BUB AI
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  This is a safe space to share what you're feeling. Choose a mode above and start the conversation whenever you're ready.
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.parts} />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white/80 backdrop-blur-md border-t border-gray-200 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
