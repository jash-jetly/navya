import { useState } from 'react';

interface WireframeViewProps {
  ideaId: string;
}

export default function WireframeView({ ideaId }: WireframeViewProps) {
  const [wireframeData] = useState<any>({
    screens: [
      {
        id: 1,
        name: 'Home',
        elements: [
          { type: 'header', content: 'App Title' },
          { type: 'button', content: 'Get Started' },
          { type: 'text', content: 'Welcome message' }
        ]
      },
      {
        id: 2,
        name: 'Dashboard',
        elements: [
          { type: 'header', content: 'Dashboard' },
          { type: 'card', content: 'Metrics' },
          { type: 'list', content: 'Recent items' }
        ]
      }
    ]
  });
  const [selectedScreen, setSelectedScreen] = useState(0);
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Generating wireframe...</p>
        </div>
      </div>
    );
  }

  if (!wireframeData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400">No wireframe data available</p>
      </div>
    );
  }

  const currentScreen = wireframeData.screens[selectedScreen];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-white mb-2">Wireframe</h2>
          <p className="text-gray-400 text-sm">Layout structure for your application</p>
        </div>

        <div className="flex gap-2 mb-6">
          {wireframeData.screens.map((screen: any, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedScreen(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedScreen === index
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {screen.name}
            </button>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
            <div className="space-y-3">
              {currentScreen.components.map((component: any, index: number) => (
                <div
                  key={index}
                  style={{ height: `${Math.max(component.height / 4, 40)}px` }}
                  className="bg-gray-200 border border-gray-300 rounded flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">
                      {component.type}
                    </p>
                    <p className="text-gray-500 text-xs">{component.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">Components</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {currentScreen.components.map((component: any, index: number) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <p className="text-sm text-white capitalize">{component.type}</p>
                <p className="text-xs text-gray-400">{component.height}px</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
