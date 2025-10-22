import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, StopCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendGeminiMessage } from '../services/gemini';

interface BrainstormingChatProps {
  messages: ChatMessage[];
  onMessagesUpdate: (messages: ChatMessage[]) => void;
  onEndBrainstorming: () => void;
}

// Function to format Gemini responses with bold and italic text
const formatGeminiResponse = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-green-400 glow-text">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-green-300">$1</em>')
    .replace(/\n/g, '<br />');
};

export default function BrainstormingChat({ messages, onMessagesUpdate, onEndBrainstorming }: BrainstormingChatProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: ChatMessage = {
        role: 'ai',
        content: "**Welcome, future entrepreneur!** I'm absolutely *thrilled* to help you brainstorm your startup idea. **Let's build something incredible together!** \n\nWhat **problem** are you passionate about solving? Tell me about the challenge that keeps you up at night - the one you *know* you can tackle better than anyone else!"
      };
      onMessagesUpdate([initialMessage]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim()
    };

    const updatedMessages = [...messages, userMessage];
    onMessagesUpdate(updatedMessages);
    setInput('');
    setIsLoading(true);

    const result = await sendGeminiMessage(messages, input.trim());

    if (result.success && result.response) {
      const aiMessage: ChatMessage = {
        role: 'ai',
        content: result.response
      };
      onMessagesUpdate([...updatedMessages, aiMessage]);
    } else {
      const errorMessage: ChatMessage = {
        role: 'ai',
        content: '**No worries!** Even the best entrepreneurs face technical hiccups. *Let\'s try that again* - your idea is too important to let a small glitch stop us!'
      };
      onMessagesUpdate([...updatedMessages, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col matrix-bg">
      <div className="terminal-bg border-b border-green-500 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold terminal-text glow-text">BRAINSTORMING SESSION</h2>
          <p className="text-sm text-green-400">Building the future, one idea at a time...</p>
        </div>
        <button
          onClick={onEndBrainstorming}
          className="terminal-button font-semibold px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          <StopCircle className="w-5 h-5" />
          END SESSION
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl px-6 py-4 rounded-lg ${
                msg.role === 'user'
                  ? 'terminal-bg border-green-400 text-green-300'
                  : 'terminal-bg border-green-500 terminal-text'
              }`}
            >
              {msg.role === 'ai' ? (
                <div 
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatGeminiResponse(msg.content) }}
                />
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="terminal-bg px-6 py-4 rounded-lg border-green-500">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-green-400" />
                <span className="text-green-400 font-mono">Processing your brilliant idea...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="terminal-bg border-t border-green-500 px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your vision..."
            className="flex-1 terminal-input px-4 py-3 rounded-lg"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="terminal-button disabled:opacity-50 disabled:cursor-not-allowed font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
