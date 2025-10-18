import React, { useState } from 'react';
import { CheckCircle, Circle, Play, Download, Eye } from 'lucide-react';
import { Feature, generateFeatureFlowchart, generateFinalAppFlowchart } from '../lib/featureFlowcharts';
import FlowChart from './FlowChart';

interface FeatureManagerProps {
  features: Feature[];
  onFeaturesUpdate: (features: Feature[]) => void;
  onFinalFlowchart: (flowchart: string) => void;
  chatHistory: Array<{type: 'user' | 'ai', message: string}>;
}

const FeatureManager: React.FC<FeatureManagerProps> = ({ 
  features, 
  onFeaturesUpdate, 
  onFinalFlowchart,
  chatHistory 
}) => {
  const [loadingFeatureId, setLoadingFeatureId] = useState<string | null>(null);
  const [viewingFlowchart, setViewingFlowchart] = useState<string | null>(null);
  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleGenerateFeatureFlowchart = async (feature: Feature) => {
    setLoadingFeatureId(feature.id);
    try {
      const flowchart = await generateFeatureFlowchart(feature, chatHistory);
      const updatedFeatures = features.map(f => 
        f.id === feature.id 
          ? { ...f, flowchart, isGenerated: true }
          : f
      );
      onFeaturesUpdate(updatedFeatures);
    } catch (error) {
      console.error('Error generating feature flowchart:', error);
    } finally {
      setLoadingFeatureId(null);
    }
  };

  const handleGenerateFinalFlowchart = async () => {
    setIsGeneratingFinal(true);
    try {
      const finalFlowchart = await generateFinalAppFlowchart(features, chatHistory);
      onFinalFlowchart(finalFlowchart);
    } catch (error) {
      console.error('Error generating final flowchart:', error);
    } finally {
      setIsGeneratingFinal(false);
    }
  };

  const allFeaturesGenerated = features.every(f => f.isGenerated);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🎯 Your Feature Roadmap</h3>
        <p className="text-zinc-400 text-sm mb-6">
          Great work! Now let's bring each feature to life with visual flowcharts. These will help you see exactly how users will experience your amazing idea.
        </p>
        
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {feature.isGenerated ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-500" />
                    )}
                    <h4 className="font-medium text-white">{feature.name}</h4>
                  </div>
                  <p className="text-sm text-zinc-400 ml-8">{feature.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {feature.isGenerated && feature.flowchart && (
                    <button
                      onClick={() => setViewingFlowchart(feature.id)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="View Flowchart"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleGenerateFeatureFlowchart(feature)}
                    disabled={loadingFeatureId === feature.id}
                    className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingFeatureId === feature.id ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {allFeaturesGenerated && (
          <div className="mt-6 pt-6 border-t border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white mb-1">🚀 You're Almost There!</h4>
                <p className="text-sm text-zinc-400">
                  Fantastic! All features are mapped out beautifully. Ready to see your complete app vision come together?
                </p>
              </div>
              <button
                onClick={() => setShowConfirmDialog(true)}
                disabled={isGeneratingFinal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isGeneratingFinal ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Generate Final Flowchart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Flowchart Modal */}
      {viewingFlowchart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {features.find(f => f.id === viewingFlowchart)?.name} Flowchart
                </h3>
                <button
                  onClick={() => setViewingFlowchart(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="bg-white rounded-lg p-4">
                <FlowChart 
                  chart={features.find(f => f.id === viewingFlowchart)?.flowchart || ''} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              🎉 Time to Bring It All Together!
            </h3>
            <p className="text-zinc-300 mb-6">
              You've done amazing work defining these features! Ready to see your complete app vision in one beautiful, comprehensive user flow diagram? 
              This will show exactly how users will experience your incredible idea from start to finish.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  handleGenerateFinalFlowchart();
                }}
                disabled={isGeneratingFinal}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isGeneratingFinal ? 'Generating...' : 'Yes, Generate Flow'}
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Not Yet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureManager;