import React, { useState, useEffect } from 'react';
import { generatePersonalizedFeatures } from '../services/gemini';

interface Feature {
  id: string;
  name: string;
  description: string;
}

interface FeatureSelectionProps {
  onFeatureSelect: (features: string[]) => void;
  chatLog: string;
  visionMission?: { vision: string; mission: string };
}

const FeatureSelection: React.FC<FeatureSelectionProps> = ({ onFeatureSelect, chatLog, visionMission }) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadPersonalizedFeatures = async () => {
      if (chatMessages.length > 0) {
        setLoadingFeatures(true);
        try {
          // Convert chat messages to string format
          const chatLog = chatMessages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
          const result = await generatePersonalizedFeatures(chatLog);
          if (result.success && result.features && result.features.length > 0) {
            setFeatures(result.features);
          }
        } catch (error) {
          console.error('Failed to generate personalized features:', error);
          // Keep fallback features
        } finally {
          setLoadingFeatures(false);
        }
      }
    };

    loadPersonalizedFeatures();
  }, [chatMessages]);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleGenerateFlowchart = () => {
    if (selectedFeatures.length === 0) {
      alert('Please select at least one feature to generate the flowchart.');
      return;
    }
    setIsGenerating(true);
    onFeatureSelect(selectedFeatures);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">**GENERATING PERSONALIZED FEATURES**</h2>
          <p className="text-green-300">*Analyzing your startup idea to create custom features...*</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 glow-text">
            **SELECT YOUR FEATURES**
          </h1>
          <p className="text-xl text-green-300 mb-2">
            *These features are personalized for your startup!*
          </p>
          <p className="text-green-500">
            Choose the features that will make your vision come alive
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`
                terminal-bg border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105
                ${selectedFeatures.includes(feature.id) 
                  ? 'border-green-400 bg-green-900/20 shadow-lg shadow-green-400/20' 
                  : 'border-green-600 hover:border-green-400'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-green-300">
                  {feature.name}
                </h3>
                <div className={`
                  w-6 h-6 rounded border-2 flex items-center justify-center
                  ${selectedFeatures.includes(feature.id) 
                    ? 'border-green-400 bg-green-400' 
                    : 'border-green-600'
                  }
                `}>
                  {selectedFeatures.includes(feature.id) && (
                    <span className="text-black text-sm font-bold">✓</span>
                  )}
                </div>
              </div>
              <p className="text-green-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedFeatures.length > 0 && (
          <div className="terminal-bg border border-green-600 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-green-300 mb-4">
              **SELECTED FEATURES** ({selectedFeatures.length})
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedFeatures.map((featureId) => {
                const feature = features.find(f => f.id === featureId);
                return (
                  <span
                    key={featureId}
                    className="bg-green-900/30 border border-green-400 text-green-300 px-3 py-1 rounded text-sm"
                  >
                    {feature?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerateFlowchart}
            disabled={selectedFeatures.length === 0 || isGenerating}
            className={`
              terminal-button px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300
              ${selectedFeatures.length === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 hover:shadow-lg hover:shadow-green-400/30'
              }
            `}
          >
            {isGenerating ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                **GENERATING FLOWCHART...**
              </span>
            ) : (
              '**GENERATE FLOWCHART**'
            )}
          </button>
          
          {selectedFeatures.length === 0 && (
            <p className="text-green-600 mt-3 text-sm">
              *Select at least one feature to continue*
            </p>
          )}
        </div>

        {/* Motivational Footer */}
        <div className="text-center mt-12 p-6 terminal-bg border border-green-600 rounded-lg">
          <p className="text-green-300 text-lg">
            **"Every great startup begins with selecting the right features!"**
          </p>
          <p className="text-green-500 mt-2">
            *You're building something incredible - choose wisely!*
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureSelection;
