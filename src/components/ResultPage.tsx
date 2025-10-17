import React from 'react';
import { ArrowLeft, Share, Download, Copy } from 'lucide-react';
import FlowChart from './FlowChart';

interface ResultPageProps {
  userInput: string;
  aiResponse: string;
  flowChart: string;
  onBack: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ userInput, aiResponse, flowChart, onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-zinc-700" />
            <h1 className="text-xl font-semibold text-white">precode</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-zinc-400 hover:text-white border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-zinc-400 hover:text-white border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]">
          {/* Left Column - Chat */}
          <div className="flex flex-col space-y-6">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex-1 flex flex-col">
              <h2 className="text-lg font-semibold text-white mb-4">Conversation</h2>
              
              <div className="flex-1 space-y-4 overflow-y-auto">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-white text-black rounded-lg px-4 py-3 max-w-[80%]">
                    <p className="text-sm">{userInput}</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-white rounded-lg px-4 py-3 max-w-[80%]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-zinc-400">AI Assistant</span>
                    </div>
                    <p className="text-sm leading-relaxed">{aiResponse}</p>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Ask follow-up questions..."
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                  <button className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Next Steps</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-300 text-sm">Review the generated flow diagram</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-300 text-sm">Export or share your app architecture</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-300 text-sm">Start building your application</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Flowchart */}
          <div className="flex flex-col">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">User Flow Diagram</h2>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                    Generated
                  </span>
                </div>
              </div>
              
              <div className="bg-zinc-800 rounded-lg p-4 flex-1 min-h-[500px]">
                {flowChart ? (
                  <FlowChart chart={flowChart} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-zinc-400">Generating flowchart...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;