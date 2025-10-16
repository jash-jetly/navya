import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { generateIdeasResponse } from '../lib/gemini';

export default function LandingPage() {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    setUserInput('');
    setConversation(prev => [...prev, { type: 'user', message: userMessage }]);
    setIsLoading(true);

    try {
      const aiResponse = await generateIdeasResponse(userMessage);
      setConversation(prev => [...prev, { type: 'ai', message: aiResponse }]);
    } catch (error) {
      setConversation(prev => [...prev, { 
        type: 'ai', 
        message: 'Sorry, I encountered an error. Please make sure your Gemini API key is configured correctly.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Minimal grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-8 flex justify-center items-center max-w-7xl mx-auto">
          <div className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Navya
          </div>
        </header>

        {/* Main content */}
        <main className="px-6 pt-12 pb-32 max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
              Discuss your ideas
              <br />
              <span className="text-zinc-500">with AI</span>
            </h1>

            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Share your product ideas and get instant AI-powered insights, suggestions, and strategic guidance.
            </p>
          </div>

          {/* Conversation Area */}
          {conversation.length > 0 && (
            <div className="mb-8 max-h-96 overflow-y-auto space-y-4 p-6 bg-zinc-900/30 rounded-lg border border-zinc-800">
              {conversation.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-white text-black' 
                      : 'bg-zinc-800 text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tell me about your product idea..."
                className="w-full p-6 pr-16 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                rows={4}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isLoading}
                className="absolute bottom-4 right-4 p-2 bg-white text-black rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

          {conversation.length === 0 && (
            <div className="text-center mt-12">
              <p className="text-sm text-zinc-500">
                Start by describing your product idea, target audience, or any challenges you're facing
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
