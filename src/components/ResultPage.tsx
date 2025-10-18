import React, { useState } from 'react';
import { ArrowLeft, Share, Download, Copy, MessageCircle, Zap, Eye } from 'lucide-react';
import FlowChart from './FlowChart';
import FeatureManager from './FeatureManager';
import { Feature } from '../lib/featureFlowcharts';
import { formatAIResponse } from '../utils/formatResponse';

interface ResultPageProps {
  userInput: string;
  aiResponse: string;
  flowChart: string;
  onBack: () => void;
  isLoadingAI?: boolean;
  isLoadingChart?: boolean;
  onFollowUp?: (message: string) => void;
  fullChatHistory?: Array<{type: 'user' | 'ai', message: string}>;
  features?: Feature[];
  onFeaturesUpdate?: (features: Feature[]) => void;
  onFinalFlowchart?: (flowchart: string) => void;
  currentPhase?: 'brainstorming' | 'features' | 'flowcharts' | 'final';
}

const ResultPage: React.FC<ResultPageProps> = ({ 
  userInput, 
  aiResponse, 
  flowChart, 
  onBack, 
  isLoadingAI = false, 
  isLoadingChart = false, 
  onFollowUp,
  fullChatHistory = [],
  features = [],
  onFeaturesUpdate,
  onFinalFlowchart,
  currentPhase = 'brainstorming'
}) => {
  const [followUpInput, setFollowUpInput] = useState('');

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || !onFollowUp) return;
    
    onFollowUp(followUpInput.trim());
    setFollowUpInput('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-zinc-700" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">precode</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-white/70 hover:text-white border border-zinc-700 rounded-xl hover:bg-zinc-800 transition-all duration-200 backdrop-blur-sm">
              <Copy className="w-4 h-4" />
              <span className="font-medium">Copy</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-white/70 hover:text-white border border-zinc-700 rounded-xl hover:bg-zinc-800 transition-all duration-200 backdrop-blur-sm">
              <Download className="w-4 h-4" />
              <span className="font-medium">Export</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Chat */}
          <div className="flex flex-col space-y-6">
            <div className="bg-zinc-900 backdrop-blur-xl rounded-2xl border border-zinc-800 p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Conversation</h2>
                  <p className="text-white/60 text-sm">Your AI-powered brainstorming session</p>
                </div>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800">
                {/* Full Chat History */}
                {fullChatHistory.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-2xl px-5 py-4 max-w-[85%] shadow-lg ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'bg-zinc-800 backdrop-blur-sm text-white border border-zinc-700'
                    }`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                          <span className="text-xs text-white/70 font-medium">AI Assistant</span>
                        </div>
                      )}
                      <div className="text-sm leading-relaxed">
                        {message.type === 'ai' ? formatAIResponse(message.message) : message.message}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Current Loading State */}
                {isLoadingAI && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 backdrop-blur-sm text-white rounded-2xl px-5 py-4 max-w-[85%] border border-zinc-700 shadow-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                        <span className="text-xs text-white/70 font-medium">AI Assistant</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-white/70">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <form onSubmit={handleFollowUpSubmit} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    placeholder="Ask follow-up questions or request changes..."
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-600 focus:bg-zinc-700 transition-all duration-200 backdrop-blur-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!followUpInput.trim()}
                    className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Flowchart */}
          <div className="flex flex-col">
            <div className="bg-zinc-900 backdrop-blur-xl rounded-2xl border border-zinc-800 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">User Flow Diagram</h2>
                    <p className="text-white/60 text-sm">Visual representation of your app</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30 backdrop-blur-sm">
                    ✓ Generated
                  </span>
                </div>
              </div>
              
              <div className="bg-zinc-800 backdrop-blur-sm rounded-xl p-6 min-h-[600px] border border-zinc-700">
                {flowChart ? (
                  <FlowChart chart={flowChart} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      {isLoadingAI ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 border-4 border-zinc-600 rounded-2xl mx-auto opacity-50 animate-pulse"></div>
                          <p className="text-white/60 font-medium">Waiting for AI response...</p>
                        </div>
                      ) : isLoadingChart ? (
                        <div className="space-y-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                          <p className="text-white/80 font-medium">Generating flowchart...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 border-4 border-zinc-600 rounded-2xl mx-auto opacity-30"></div>
                          <p className="text-white/50">No flowchart available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Feature Manager */}
              {(currentPhase === 'features' || currentPhase === 'flowcharts' || currentPhase === 'final') && 
               onFeaturesUpdate && onFinalFlowchart && (
                <div className="mt-6">
                  <FeatureManager
                    features={features}
                    onFeaturesUpdate={onFeaturesUpdate}
                    onFinalFlowchart={onFinalFlowchart}
                    chatHistory={fullChatHistory}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;