import { useState } from 'react';
import { TrendingUp, Users, Clock, Target, ThumbsUp, ThumbsDown } from 'lucide-react';

interface MonitorViewProps {
  ideaId: string;
}

export default function MonitorView({ ideaId }: MonitorViewProps) {
  const [metrics] = useState<any>({
    pageViews: 12543,
    uniqueUsers: 8921,
    conversionRate: 3.2,
    avgSessionTime: 245,
    dropOffPoints: [
      { screen: 'Landing Page', rate: 15 },
      { screen: 'Sign Up', rate: 25 },
      { screen: 'Onboarding', rate: 8 },
      { screen: 'First Feature', rate: 12 }
    ]
  });
  
  const [suggestions] = useState<any[]>([
    {
      id: '1',
      suggestion_type: 'optimization',
      suggestion_text: 'Consider adding interactive tutorials to reduce user drop-off during onboarding',
      status: 'pending'
    },
    {
      id: '2',
      suggestion_type: 'feature',
      suggestion_text: 'Add social sharing functionality to increase user engagement',
      status: 'pending'
    },
    {
      id: '3',
      suggestion_type: 'performance',
      suggestion_text: 'Optimize page load times to improve conversion rates',
      status: 'applied'
    }
  ]);
  
  const [loading] = useState(false);

  const handleSuggestionAction = (suggestionId: string, action: 'applied' | 'ignored') => {
    console.log(`Suggestion ${suggestionId} ${action}`);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-zinc-400 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <p className="text-zinc-500 text-sm">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-black">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-white mb-1">Analytics</h2>
          <p className="text-zinc-400 text-sm">Monitor performance and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-zinc-400" />
              <p className="text-xs text-zinc-400">Page Views</p>
            </div>
            <p className="text-xl font-medium text-white">{metrics.pageViews.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-1">↑ 12%</p>
          </div>

          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-zinc-400" />
              <p className="text-xs text-zinc-400">Unique Users</p>
            </div>
            <p className="text-xl font-medium text-white">{metrics.uniqueUsers.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-1">↑ 8%</p>
          </div>

          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-zinc-400" />
              <p className="text-xs text-zinc-400">Conversion Rate</p>
            </div>
            <p className="text-xl font-medium text-white">{metrics.conversionRate}%</p>
            <p className="text-xs text-red-400 mt-1">↓ 3%</p>
          </div>

          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <p className="text-xs text-zinc-400">Avg Session</p>
            </div>
            <p className="text-xl font-medium text-white">
              {Math.floor(metrics.avgSessionTime / 60)}m {metrics.avgSessionTime % 60}s
            </p>
            <p className="text-xs text-green-400 mt-1">↑ 5%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">Drop-off Points</h3>
            <div className="space-y-3">
              {metrics.dropOffPoints.map((point: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-300">{point.screen}</span>
                    <span className="text-sm font-medium text-white">{point.rate}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        point.rate > 20
                          ? 'bg-red-500'
                          : point.rate > 10
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${point.rate * 4}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">User Engagement</h3>
            <div className="h-32 flex items-end gap-2">
              {[65, 82, 58, 91, 73, 88, 95].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-white rounded-sm"
                    style={{ height: `${value}%` }}
                  ></div>
                  <span className="text-xs text-zinc-500">D{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">AI Insights</h3>
          <div className="space-y-3">
            {suggestions
              .filter((s) => s.status === 'pending')
              .map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-zinc-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-zinc-700 text-zinc-300 text-xs rounded">
                          {suggestion.suggestion_type}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mb-3">{suggestion.suggestion_text}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSuggestionAction(suggestion.id, 'applied')}
                          className="px-3 py-1.5 bg-green-900/50 hover:bg-green-900/70 border border-green-800 text-green-400 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          Apply
                        </button>
                        <button
                          onClick={() => handleSuggestionAction(suggestion.id, 'ignored')}
                          className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 border border-red-800 text-red-400 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {suggestions.filter((s) => s.status !== 'pending').length > 0 && (
              <>
                <div className="pt-3 border-t border-zinc-800">
                  <h4 className="text-sm font-medium text-zinc-400 mb-3">Previous Actions</h4>
                </div>
                {suggestions
                  .filter((s) => s.status !== 'pending')
                  .map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-3 bg-zinc-800/30 border border-zinc-800 rounded-lg opacity-60"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            suggestion.status === 'applied'
                              ? 'bg-green-900/50 text-green-400'
                              : 'bg-zinc-700 text-zinc-400'
                          }`}
                        >
                          {suggestion.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">{suggestion.suggestion_text}</p>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
