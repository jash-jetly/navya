import { useState } from 'react';
import { ArrowRight, Sparkles, Send } from 'lucide-react';
import { generateIdeasResponse } from '../lib/gemini';

interface IdeaInputProps {
  onIdeaCreated: (idea: any) => void;
}

export default function IdeaInput({ onIdeaCreated }: IdeaInputProps) {
  const [description, setDescription] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || loading) return;

    const userMessage = description.trim();
    setDescription('');
    setConversation(prev => [...prev, { type: 'user', message: userMessage }]);
    setLoading(true);

    try {
      const aiResponse = await generateIdeasResponse(userMessage);
      setConversation(prev => [...prev, { type: 'ai', message: aiResponse }]);
      
      // Create a mock idea object for the dashboard
      const idea = {
        id: Date.now().toString(),
        title: userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : ''),
        description: userMessage,
        status: 'flow',
        created_at: new Date().toISOString()
      };
      
      onIdeaCreated(idea);
    } catch (error) {
      setConversation(prev => [...prev, { 
        type: 'ai', 
        message: 'Sorry, I encountered an error. Please make sure your Gemini API key is configured correctly.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-light">Share Your Idea</h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Describe your product idea and get AI-powered insights to help you build it
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
            {loading && (
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product idea, target audience, features, or any challenges you're facing..."
              className="w-full p-6 pr-16 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
              rows={6}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!description.trim() || loading}
              className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Example prompts */}
        {conversation.length === 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-medium mb-6 text-center">Need inspiration? Try these:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "I want to build a fitness app that helps people track their workouts and nutrition",
                "How can I create a platform that connects freelancers with small businesses?",
                "I have an idea for a productivity tool that helps teams collaborate better",
                "What would be the best approach to build a marketplace for handmade crafts?"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setDescription(example)}
                  className="p-4 text-left bg-zinc-900/30 border border-zinc-800 rounded-lg hover:bg-zinc-800/50 transition-colors"
                >
                  <p className="text-sm text-zinc-300">{example}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
