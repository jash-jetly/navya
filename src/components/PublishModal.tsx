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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          {isComplete ? (
            <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          ) : (
            <div className="w-12 h-12 border-2 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
          )}

          <h2 className="text-lg font-medium text-white mb-1">
            {isComplete ? 'Published Successfully' : 'Publishing App'}
          </h2>
          <p className="text-zinc-400 text-sm">
            {isComplete
              ? 'Your app is now live'
              : 'Please wait while we prepare your application'}
          </p>
        </div>

        <div className="space-y-2 mb-6">
          {stages.map((stageInfo, index) => {
            const isDone = index < stage;
            const isCurrent = index === stage;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isDone
                    ? 'bg-green-900/30 border border-green-800'
                    : isCurrent
                    ? 'bg-zinc-800 border border-zinc-700'
                    : 'bg-zinc-800/50 border border-zinc-800'
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader className="w-4 h-4 text-white flex-shrink-0 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-600 flex-shrink-0"></div>
                )}
                <span
                  className={`text-sm ${
                    isDone ? 'text-green-400' : isCurrent ? 'text-white' : 'text-zinc-500'
                  }`}
                >
                  {stageInfo.label}
                </span>
              </div>
            );
          })}
        </div>

        {isComplete && (
          <div className="space-y-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white text-black rounded-lg text-sm font-medium transition-colors hover:bg-zinc-200"
            >
              View in Store
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
