import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PublishModal from './PublishModal';

interface AppViewProps {
  ideaId: string;
}

export default function AppView({ ideaId }: AppViewProps) {
  const [screens, setScreens] = useState<any[]>([]);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    if (ideaId) {
      loadScreens();
    }
  }, [ideaId]);

  const loadScreens = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('app_builds')
      .select('*')
      .eq('idea_id', ideaId)
      .maybeSingle();

    if (data && data.screens) {
      setScreens(data.screens);
    }
    setLoading(false);
  };

  const nextScreen = () => {
    setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
  };

  const prevScreen = () => {
    setCurrentScreenIndex((prev) => (prev - 1 + screens.length) % screens.length);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Building app preview...</p>
        </div>
      </div>
    );
  }

  if (screens.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">No app screens available</p>
      </div>
    );
  }

  const currentScreen = screens[currentScreenIndex];

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Interactive App Preview</h2>
            <p className="text-gray-400">Navigate through your app's screens</p>
          </div>
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Publish to Store
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-12">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900 rounded-3xl p-3 shadow-2xl border-8 border-gray-800">
              <div className="bg-black rounded-2xl overflow-hidden">
                <div className="h-8 bg-gray-900 flex items-center justify-center">
                  <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-[600px] p-6 overflow-auto">
                  {currentScreen.name === 'Welcome' && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 flex items-center justify-center">
                        <span className="text-3xl">✨</span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome</h1>
                      <p className="text-gray-600 mb-8 max-w-xs">
                        Get started with your amazing new application
                      </p>
                      <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold">
                        Get Started
                      </button>
                    </div>
                  )}

                  {currentScreen.name === 'Dashboard' && (
                    <div className="h-full">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="p-4 bg-white rounded-xl shadow-sm">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg mb-3"></div>
                            <p className="text-sm font-medium text-gray-900">Metric {i}</p>
                            <p className="text-xs text-gray-500">Value</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 bg-white rounded-xl shadow-sm">
                        <p className="text-sm font-medium text-gray-900 mb-4">Recent Activity</p>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-3 bg-gray-100 rounded w-3/4 mb-1"></div>
                              <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentScreen.name === 'Feature View' && (
                    <div className="h-full">
                      <div className="flex items-center gap-3 mb-6">
                        <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
                          ←
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900">Feature</h2>
                      </div>
                      <div className="p-6 bg-white rounded-xl shadow-sm mb-4">
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4"></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Title</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Detailed description of the feature and how it works
                        </p>
                        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold">
                          Take Action
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-16 bg-gray-900 flex items-center justify-around">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-800"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prevScreen}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <div className="flex gap-2">
            {screens.map((screen, index) => (
              <button
                key={screen.id}
                onClick={() => setCurrentScreenIndex(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentScreenIndex === index
                    ? 'bg-blue-500/20 border border-blue-500/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {screen.name}
              </button>
            ))}
          </div>

          <button
            onClick={nextScreen}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {showPublishModal && <PublishModal onClose={() => setShowPublishModal(false)} />}
    </div>
  );
}
