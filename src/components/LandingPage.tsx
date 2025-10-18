import React, { useState } from 'react';
import { Sparkles, Send, Github, Mic, FileText, ArrowRight } from 'lucide-react';
import { generateIdeasResponse, generateFlowChart } from '../lib/gemini';
import { Feature, suggestFeatures, generateFeatureFlowchart, generateFinalAppFlowchart } from '../lib/featureFlowcharts';
import FlowChart from './FlowChart';
import ResultPage from './ResultPage';

export default function LandingPage() {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [fullChatHistory, setFullChatHistory] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flowChart, setFlowChart] = useState('');
  const [isGeneratingChart, setIsGeneratingChart] = useState(false);
  const [showFlowChart, setShowFlowChart] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);
  const [currentUserInput, setCurrentUserInput] = useState('');
  const [currentAiResponse, setCurrentAiResponse] = useState('');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'brainstorming' | 'features' | 'flowcharts' | 'final'>('brainstorming');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    setCurrentUserInput(userMessage);
    setUserInput('');
    
    // Add to both conversation and full history
    const newUserMessage = { type: 'user' as const, message: userMessage };
    setConversation(prev => [...prev, newUserMessage]);
    setFullChatHistory(prev => [...prev, newUserMessage]);
    
    // Navigate to result page immediately
    setShowResultPage(true);
    setIsLoading(true);

    try {
      // Generate AI response with full chat context
      const aiResponse = await generateIdeasResponse(userMessage, fullChatHistory);
      setCurrentAiResponse(aiResponse);
      
      // Add AI response to both conversation and full history
      const newAiMessage = { type: 'ai' as const, message: aiResponse };
      setConversation(prev => [...prev, newAiMessage]);
      setFullChatHistory(prev => [...prev, newAiMessage]);
      
      // Don't generate flowchart immediately - let the AI guide the brainstorming process first
      setFlowChart('');
      setShowFlowChart(false);
    } catch (error) {
      const errorMessage = 'Sorry, I encountered an error. Please make sure your Gemini API key is configured correctly.';
      setCurrentAiResponse(errorMessage);
      setConversation(prev => [...prev, { 
        type: 'ai', 
        message: errorMessage
      }]);
    } finally {
      setIsLoading(false);
      // Don't set isGeneratingChart to false here since we're not generating charts initially
    }
  };

  const handleBackToLanding = () => {
    setShowResultPage(false);
    setShowFlowChart(false);
    setFlowChart('');
    setCurrentUserInput('');
    setCurrentAiResponse('');
  };

  const handleFollowUp = async (message: string) => {
    // Add user message to chat history
    const newUserMessage = { type: 'user' as const, message };
    const updatedHistory = [...fullChatHistory, newUserMessage];
    setFullChatHistory(updatedHistory);

    // Set loading states
    setIsLoading(true);
    setCurrentUserInput(message);
    setCurrentAiResponse('');

    try {
      // Generate AI response with context
      const aiResponse = await generateIdeasResponse(message, updatedHistory);
      setCurrentAiResponse(aiResponse);
      
      // Add AI response to chat history
      const aiMessage = { type: 'ai' as const, message: aiResponse };
      const finalHistory = [...updatedHistory, aiMessage];
      setFullChatHistory(finalHistory);
      
      setIsLoading(false);

      // Check if AI suggests moving to feature phase
      if (aiResponse.toLowerCase().includes('suggest features') || 
          aiResponse.toLowerCase().includes('core features') ||
          message.toLowerCase().includes('features') ||
          message.toLowerCase().includes('what should it do')) {
        
        try {
          // Generate feature suggestions
          const suggestedFeatures = await suggestFeatures(message, finalHistory);
          setFeatures(suggestedFeatures);
          setCurrentPhase('features');
        } catch (error) {
          console.error('Error generating features:', error);
        }
      }

      // Only generate flowchart if not in feature phase
      if (currentPhase === 'brainstorming') {
        setIsGeneratingChart(true);
        try {
          const newFlowChart = await generateFlowChart(aiResponse, finalHistory);
          setFlowChart(newFlowChart);
        } catch (error) {
          console.error('Error generating flowchart:', error);
        }
        setIsGeneratingChart(false);
      }
    } catch (error) {
      console.error('Error in follow-up:', error);
      setIsLoading(false);
      setIsGeneratingChart(false);
    }
  };

  // Show ResultPage if user has submitted a prompt
  if (showResultPage) {
    return (
      <ResultPage
        userInput={currentUserInput}
        aiResponse={currentAiResponse}
        flowChart={flowChart}
        onBack={handleBackToLanding}
        isLoadingAI={isLoading && !currentAiResponse}
        isLoadingChart={isGeneratingChart}
        onFollowUp={handleFollowUp}
        fullChatHistory={fullChatHistory}
        features={features}
        onFeaturesUpdate={setFeatures}
        onFinalFlowchart={setFlowChart}
        currentPhase={currentPhase}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            PRECODE
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors">
              Buy Credits
            </button>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
              J
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-6 pt-16 pb-32 max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-8 leading-[0.9]">
              Your idea deserves to exist
            </h1>

            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Every successful app started with someone just like you, having a simple idea. Let's turn yours into reality through guided conversations and expert support.
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-16">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Your AI product strategist is ready to help</span>
              </div>
            </div>
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

          {/* FlowChart Area */}
          {showFlowChart && (
            <div className="mb-8">
              {isGeneratingChart ? (
                <div className="p-8 bg-zinc-900/30 rounded-lg border border-zinc-800 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <p className="text-zinc-400">Generating app flow diagram...</p>
                </div>
              ) : flowChart ? (
                <FlowChart chart={flowChart} title="App Flow Architecture" />
              ) : null}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative mb-8">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="I have this idea for an app that... (don't worry, every great app started with someone sharing their idea!)"
                className="w-full p-6 pr-32 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 text-lg"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!userInput.trim() || isLoading}
                  className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Model selector and options */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Sparkles className="w-4 h-4" />
                Claude 4.5 Sonnet
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Public
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
