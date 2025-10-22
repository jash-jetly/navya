import { useState } from 'react';
import { Target, Eye, ArrowRight } from 'lucide-react';
import { VisionMission } from '../types';

interface VisionMissionFormProps {
  onSubmit: (visionMission: VisionMission) => void;
}

export default function VisionMissionForm({ onSubmit }: VisionMissionFormProps) {
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vision.trim() && mission.trim()) {
      onSubmit({ vision: vision.trim(), mission: mission.trim() });
    }
  };

  const isValid = vision.trim().length > 0 && mission.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Define Your Vision & Mission</h2>
          <p className="text-gray-600">
            Clarify your long-term vision and mission statement to guide your startup's direction
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Eye className="w-5 h-5 text-blue-600" />
              Vision Statement
            </label>
            <p className="text-sm text-gray-600">
              Where do you see your startup in 5-10 years? What's the ultimate impact you want to make?
            </p>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Our vision is to..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Target className="w-5 h-5 text-blue-600" />
              Mission Statement
            </label>
            <p className="text-sm text-gray-600">
              What is your startup's purpose? How will you achieve your vision?
            </p>
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="Our mission is to..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Continue to Feature Selection
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
