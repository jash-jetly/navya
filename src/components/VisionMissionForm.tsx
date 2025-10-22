import { useState } from 'react';
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
    <div className="min-h-screen bg-black text-green-400 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full terminal-bg border border-green-600 rounded-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold glow-text mb-4">
            **DEFINE YOUR VISION & MISSION**
          </h2>
          <p className="text-green-300 text-lg">
            *Clarify your long-term vision and mission to guide your startup's direction*
          </p>
          <div className="text-green-500 text-sm">
            [SYSTEM] STRATEGIC FOUNDATION REQUIRED FOR OPTIMAL FEATURE GENERATION
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vision Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded border-2 border-green-400 flex items-center justify-center">
                <span className="text-green-400 font-bold">👁</span>
              </div>
              <h3 className="text-2xl font-bold text-green-300">
                **VISION STATEMENT**
              </h3>
            </div>
            <p className="text-green-300/80 font-mono text-sm leading-relaxed">
              {'>>> WHERE DO YOU SEE YOUR STARTUP IN 5-10 YEARS?'}<br/>
              {'>>> WHAT\'S THE ULTIMATE IMPACT YOU WANT TO MAKE ON THE WORLD?'}
            </p>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Enter your vision statement here... (e.g., 'To revolutionize how people connect and collaborate globally through innovative technology')"
              className="w-full h-32 terminal-input resize-none"
              required
            />
          </div>

          {/* Mission Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded border-2 border-green-400 flex items-center justify-center">
                <span className="text-green-400 font-bold">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-green-300">
                **MISSION STATEMENT**
              </h3>
            </div>
            <p className="text-green-300/80 font-mono text-sm leading-relaxed">
              {'>>> WHAT IS YOUR STARTUP\'S CORE PURPOSE?'}<br/>
              {'>>> HOW WILL YOU ACHIEVE YOUR VISION AND SERVE YOUR CUSTOMERS?'}
            </p>
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="Enter your mission statement here... (e.g., 'To provide accessible, user-friendly tools that empower small businesses to compete in the digital marketplace')"
              className="w-full h-32 terminal-input resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={!isValid}
              className={`
                terminal-button px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300
                ${!isValid 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-lg hover:shadow-green-400/30'
                }
              `}
            >
              **PROCEED TO FEATURE SELECTION**
            </button>
            
            {!isValid && (
              <p className="text-green-600 mt-3 text-sm">
                *Please complete both vision and mission statements*
              </p>
            )}
          </div>
        </form>

        {/* Motivational Footer */}
        <div className="text-center mt-8 p-4 border border-green-600 rounded-lg">
          <p className="text-green-300">
            **"A clear vision and mission are the foundation of every successful startup!"**
          </p>
          <p className="text-green-500 mt-2 text-sm">
            *Take your time to craft meaningful statements that will guide your journey*
          </p>
        </div>
      </div>
    </div>
  );
}
