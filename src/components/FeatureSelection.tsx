import { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, Loader2 } from 'lucide-react';
import { Feature } from '../types';

interface FeatureSelectionProps {
  onSubmit: (selectedFeatures: string[]) => void;
  isGenerating: boolean;
}

const AVAILABLE_FEATURES: Feature[] = [
  {
    id: 'user-auth',
    name: 'User Authentication',
    description: 'Sign up, login, password reset, and user profile management'
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Overview of key metrics and personalized user data'
  },
  {
    id: 'search',
    name: 'Search & Filter',
    description: 'Advanced search functionality with filters and sorting'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Real-time alerts and notification preferences'
  },
  {
    id: 'payments',
    name: 'Payment Processing',
    description: 'Secure payment integration and subscription management'
  },
  {
    id: 'messaging',
    name: 'Messaging',
    description: 'In-app messaging and communication features'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Track user behavior and generate insights'
  },
  {
    id: 'social',
    name: 'Social Features',
    description: 'User profiles, following, likes, and social interactions'
  },
  {
    id: 'admin',
    name: 'Admin Panel',
    description: 'Backend management and content moderation tools'
  },
  {
    id: 'api',
    name: 'API Integration',
    description: 'Third-party API connections and webhooks'
  }
];

export default function FeatureSelection({ onSubmit, isGenerating }: FeatureSelectionProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());

  const toggleFeature = (featureId: string) => {
    const newSelected = new Set(selectedFeatures);
    if (newSelected.has(featureId)) {
      newSelected.delete(featureId);
    } else {
      newSelected.add(featureId);
    }
    setSelectedFeatures(newSelected);
  };

  const handleSubmit = () => {
    if (selectedFeatures.size > 0 && !isGenerating) {
      const featureNames = Array.from(selectedFeatures).map(
        id => AVAILABLE_FEATURES.find(f => f.id === id)?.name || id
      );
      onSubmit(featureNames);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Select Your App Features</h2>
          <p className="text-gray-600">
            Choose the features you want to include in your app. We'll generate a comprehensive flowchart based on your selections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_FEATURES.map((feature) => {
            const isSelected = selectedFeatures.has(feature.id);
            return (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.name}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                {selectedFeatures.size} feature{selectedFeatures.size !== 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-gray-600">
                Select at least one feature to generate your flowchart
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={selectedFeatures.size === 0 || isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Flowchart...
                </>
              ) : (
                <>
                  Generate Flowchart
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
