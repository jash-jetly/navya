import { useEffect, useState } from 'react';
import { ArrowRight, Circle, Square, Diamond, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FlowViewProps {
  ideaId: string;
}

export default function FlowView({ ideaId }: FlowViewProps) {
  const [flowData, setFlowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ideaId) {
      loadFlowData();
    }
  }, [ideaId]);

  const loadFlowData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_flows')
      .select('*')
      .eq('idea_id', ideaId)
      .maybeSingle();

    if (data) {
      setFlowData(data.flow_data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Generating user flow...</p>
        </div>
      </div>
    );
  }

  if (!flowData) {
    return (
      <div className="h-full flex items-center justify-center">
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
    <div className="h-full overflow-auto p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">User Flow Diagram</h2>
          <p className="text-gray-400">Visual representation of your app's user journey</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="space-y-6">
            {flowData.steps.map((step: any, index: number) => {
              const Icon = getIcon(step.type);
              const isLast = index === flowData.steps.length - 1;

              return (
                <div key={step.id}>
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-4 flex-1 p-6 rounded-xl border transition-all duration-300 ${
                        step.type === 'start'
                          ? 'bg-green-500/10 border-green-500/30'
                          : step.type === 'end'
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : step.type === 'decision'
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          step.type === 'start'
                            ? 'bg-green-500/20'
                            : step.type === 'end'
                            ? 'bg-blue-500/20'
                            : step.type === 'decision'
                            ? 'bg-purple-500/20'
                            : 'bg-blue-500/20'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            step.type === 'start'
                              ? 'text-green-400'
                              : step.type === 'end'
                              ? 'text-blue-400'
                              : step.type === 'decision'
                              ? 'text-purple-400'
                              : 'text-blue-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{step.label}</h3>
                        <p className="text-sm text-gray-400 capitalize">{step.type}</p>
                      </div>
                      {step.type === 'end' && <CheckCircle className="w-6 h-6 text-blue-400" />}
                    </div>
                  </div>

                  {!isLast && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="w-6 h-6 text-gray-600 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <p className="text-2xl font-bold text-white mb-1">{flowData.steps.length}</p>
            <p className="text-sm text-gray-400">Total Steps</p>
          </div>
          <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <p className="text-2xl font-bold text-white mb-1">
              {flowData.steps.filter((s: any) => s.type === 'decision').length}
            </p>
            <p className="text-sm text-gray-400">Decision Points</p>
          </div>
          <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <p className="text-2xl font-bold text-white mb-1">{flowData.connections.length}</p>
            <p className="text-sm text-gray-400">Connections</p>
          </div>
        </div>
      </div>
    </div>
  );
}
