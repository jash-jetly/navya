import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface WireframeViewProps {
  ideaId: string;
}

export default function WireframeView({ ideaId }: WireframeViewProps) {
  const [wireframeData, setWireframeData] = useState<any>(null);
  const [selectedScreen, setSelectedScreen] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ideaId) {
      loadWireframeData();
    }
  }, [ideaId]);

  const loadWireframeData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('wireframes')
      .select('*')
      .eq('idea_id', ideaId)
      .maybeSingle();

    if (data) {
      setWireframeData(data.wireframe_data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Generating wireframe...</p>
        </div>
      </div>
    );
  }

  if (!wireframeData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">No wireframe data available</p>
      </div>
    );
  }

  const currentScreen = wireframeData.screens[selectedScreen];

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Wireframe Design</h2>
          <p className="text-gray-400">Layout structure for your application</p>
        </div>

        <div className="flex gap-4 mb-6">
          {wireframeData.screens.map((screen: any, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedScreen(index)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedScreen === index
                  ? 'bg-blue-500/20 border border-blue-500/50 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {screen.name}
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-8">
          <div className="bg-white rounded-xl p-8 max-w-3xl mx-auto shadow-2xl">
            <div className="space-y-4">
              {currentScreen.components.map((component: any, index: number) => (
                <div
                  key={index}
                  style={{ height: `${component.height}px` }}
                  className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center relative group transition-all duration-300 hover:bg-gray-300"
                >
                  <div className="text-center">
                    <p className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                      {component.type}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{component.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Components Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentScreen.components.map((component: any, index: number) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <p className="text-sm font-medium text-white capitalize">{component.type}</p>
                <p className="text-xs text-gray-400 mt-1">{component.height}px height</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
