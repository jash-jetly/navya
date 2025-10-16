import { useState } from 'react';
import { ArrowDown, Circle, Square, Diamond, CheckCircle } from 'lucide-react';

interface FlowViewProps {
  ideaId: string;
}

export default function FlowView({ ideaId }: FlowViewProps) {
  const [flowData] = useState<any>({
    steps: [
      { id: 1, label: 'User Registration', type: 'start', description: 'User creates account' },
      { id: 2, label: 'Profile Setup', type: 'process', description: 'User completes profile' },
      { id: 3, label: 'Feature Discovery', type: 'process', description: 'User explores features' },
      { id: 4, label: 'First Action', type: 'decision', description: 'User performs key action' },
      { id: 5, label: 'Success State', type: 'end', description: 'User achieves goal' }
    ],
    connections: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 }
    ]
  });
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Generating flow...</p>
        </div>
      </div>
    );
  }

  if (!flowData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400">No flow data available</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'start':
      case 'end':
        return Circle;
      case 'process':
        return Square;
      case 'decision':
        return Diamond;
      default:
        return Square;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-white mb-2">User Flow</h2>
          <p className="text-gray-400 text-sm">Visual representation of your app's user journey</p>
        </div>

        <div className="space-y-4">
          {flowData.steps.map((step: any, index: number) => {
            const Icon = getIcon(step.type);
            const isLast = index === flowData.steps.length - 1;

            return (
              <div key={step.id}>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{step.label}</h3>
                    <p className="text-gray-400 text-sm capitalize">{step.type}</p>
                  </div>
                  {step.type === 'end' && <CheckCircle className="w-4 h-4 text-green-400" />}
                </div>

                {!isLast && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
            <p className="text-xl font-medium text-white mb-1">{flowData.steps.length}</p>
            <p className="text-xs text-gray-400">Steps</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
            <p className="text-xl font-medium text-white mb-1">
              {flowData.steps.filter((s: any) => s.type === 'decision').length}
            </p>
            <p className="text-xs text-gray-400">Decisions</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
            <p className="text-xl font-medium text-white mb-1">{flowData.connections.length}</p>
            <p className="text-xs text-gray-400">Connections</p>
          </div>
        </div>
      </div>
    </div>
  );
}
