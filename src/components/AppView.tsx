import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import PublishModal from './PublishModal';

interface AppViewProps {
  ideaId: string;
}

export default function AppView({ ideaId }: AppViewProps) {
  const [screens] = useState<any[]>([
    {
      id: 1,
      name: 'Home Screen',
      type: 'mobile',
      content: '<div class="p-4 bg-gray-100 h-screen"><h1 class="text-2xl font-bold">Welcome</h1><p>Your app home screen</p></div>'
    },
    {
      id: 2,
      name: 'Profile Screen',
      type: 'mobile',
      content: '<div class="p-4 bg-white h-screen"><h2 class="text-xl font-semibold">Profile</h2><p>User profile information</p></div>'
    }
  ]);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [loading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const nextScreen = () => {
    setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
  };

  const prevScreen = () => {
    setCurrentScreenIndex((prev) => (prev - 1 + screens.length) % screens.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Building preview...</p>
        </div>
      </div>
    );
  }

  if (screens.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400">No app screens available</p>
      </div>
    );
  }

  const currentScreen = screens[currentScreenIndex];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-white mb-2">App Preview</h2>
            <p className="text-gray-400 text-sm">Navigate through your app's screens</p>
          </div>
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Deploy
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <div className="max-w-sm mx-auto">
            <div className="bg-black rounded-2xl p-2 border border-gray-800">
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="h-6 bg-gray-100 flex items-center justify-center">
                  <div className="w-16 h-3 bg-gray-300 rounded-full"></div>
                </div>

                <div className="bg-white h-96 p-4 overflow-auto">
                  {currentScreen.name === 'Welcome' && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                      </div>
                      <h1 className="text-xl font-medium text-gray-900 mb-2">Welcome</h1>
                      <p className="text-gray-600 text-sm mb-6 max-w-xs">
                        Get started with your amazing new application
                      </p>
                      <button className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium">
                        Get Started
                      </button>
                    </div>
                  )}

                  {currentScreen.name === 'Dashboard' && (
                    <div className="h-full">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Dashboard</h2>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-gray-200 rounded mb-2"></div>
                            <p className="text-xs font-medium text-gray-900">Metric {i}</p>
                            <p className="text-xs text-gray-500">Value</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-3">Recent Activity</p>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentScreen.name === 'Feature View' && (
                    <div className="h-full">
                      <div className="flex items-center gap-2 mb-4">
                        <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          ←
                        </button>
                        <h2 className="text-lg font-medium text-gray-900">Feature</h2>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg mb-3">
                        <div className="aspect-video bg-gray-200 rounded mb-3"></div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">Feature Title</h3>
                        <p className="text-xs text-gray-600 mb-3">
                          Detailed description of the feature and how it works
                        </p>
                        <button className="w-full py-2 bg-black text-white rounded text-xs font-medium">
                          Take Action
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-12 bg-gray-100 flex items-center justify-around">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-300"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={prevScreen}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          <div className="flex gap-2">
            {screens.map((screen, index) => (
              <button
                key={screen.id}
                onClick={() => setCurrentScreenIndex(index)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentScreenIndex === index
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {screen.name}
              </button>
            ))}
          </div>

          <button
            onClick={nextScreen}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {showPublishModal && <PublishModal onClose={() => setShowPublishModal(false)} />}
    </div>
  );
}
