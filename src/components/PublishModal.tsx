import { useState, useEffect } from 'react';
import { X, CheckCircle, Loader } from 'lucide-react';

interface PublishModalProps {
  onClose: () => void;
}

export default function PublishModal({ onClose }: PublishModalProps) {
  const [stage, setStage] = useState(0);

  const stages = [
    { label: 'Validating build', duration: 1500 },
    { label: 'Optimizing assets', duration: 2000 },
    { label: 'Running tests', duration: 1800 },
    { label: 'Preparing deployment', duration: 1500 },
    { label: 'Publishing to store', duration: 2200 },
  ];

  useEffect(() => {
    if (stage < stages.length) {
      const timer = setTimeout(() => {
        setStage(stage + 1);
      }, stages[stage].duration);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  const isComplete = stage === stages.length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#121218] to-[#0B0B0F] border border-white/10 rounded-2xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          {isComplete ? (
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          ) : (
            <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          )}

          <h2 className="text-2xl font-bold text-white mb-2">
            {isComplete ? 'Published Successfully!' : 'Publishing Your App'}
          </h2>
          <p className="text-gray-400">
            {isComplete
              ? 'Your app is now live and ready for users'
              : 'Please wait while we prepare your application'}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {stages.map((stageInfo, index) => {
            const isDone = index < stage;
            const isCurrent = index === stage;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isDone
                    ? 'bg-green-500/10 border border-green-500/20'
                    : isCurrent
                    ? 'bg-blue-500/10 border border-blue-500/20'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader className="w-5 h-5 text-blue-400 flex-shrink-0 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0"></div>
                )}
                <span
                  className={`text-sm font-medium ${
                    isDone ? 'text-green-400' : isCurrent ? 'text-blue-400' : 'text-gray-500'
                  }`}
                >
                  {stageInfo.label}
                </span>
              </div>
            );
          })}
        </div>

        {isComplete && (
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
            >
              View in Store
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
