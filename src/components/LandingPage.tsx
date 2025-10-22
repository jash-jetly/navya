import { Rocket } from 'lucide-react';

interface LandingPageProps {
  onCreateApp: () => void;
}

export default function LandingPage({ onCreateApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 matrix-bg">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="terminal-bg p-6 rounded-lg">
            <Rocket className="w-16 h-16 text-green-400" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold terminal-text glow-text">
            BUILD YOUR STARTUP VISION
          </h1>
          <p className="text-xl text-green-300 max-w-xl mx-auto font-mono">
            Transform your idea into a structured plan with AI-powered brainstorming and automated flow mapping
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onCreateApp}
            className="terminal-button font-semibold px-8 py-4 rounded-lg text-lg"
          >
            INITIALIZE STARTUP
          </button>

          <div className="flex items-center justify-center gap-8 text-sm text-green-400 font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              AI BRAINSTORMING
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              FLOW MAPPING
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              FEATURE PLANNING
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
