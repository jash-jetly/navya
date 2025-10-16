import { useEffect, useState } from 'react';
import { TrendingUp, Users, Clock, Target, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface MonitorViewProps {
  ideaId: string;
}

export default function MonitorView({ ideaId }: MonitorViewProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (ideaId) {
      loadData();
    }
  }, [ideaId]);

  const loadData = async () => {
    setLoading(true);

    const { data: analyticsData } = await supabase
      .from('analytics')
      .select('*')
      .eq('idea_id', ideaId)
      .maybeSingle();

    if (analyticsData) {
      setMetrics(analyticsData.metrics);
    }

    const { data: suggestionsData } = await supabase
      .from('ai_suggestions')
      .select('*')
      .eq('idea_id', ideaId)
      .order('created_at', { ascending: false });

    if (suggestionsData) {
      setSuggestions(suggestionsData);
    }

    setLoading(false);
  };

  const handleSuggestionAction = async (suggestionId: string, action: 'applied' | 'ignored') => {
    const { data: suggestion } = await supabase
      .from('ai_suggestions')
      .select('*')
      .eq('id', suggestionId)
      .single();

    await supabase.from('ai_suggestions').update({ status: action }).eq('id', suggestionId);

    if (action === 'applied' && suggestion) {
      await supabase.from('user_preferences').insert({
        user_id: user?.id,
        preference_key: suggestion.suggestion_type,
        preference_value: 'applied',
        learned_from: suggestionId,
      });
    }

    loadData();
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h2>
          <p className="text-gray-400">Monitor performance and get AI-powered recommendations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-gray-400">Page Views</p>
            </div>
            <p className="text-3xl font-bold text-white">{metrics.pageViews.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-1">↑ 12% from last week</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm text-gray-400">Unique Users</p>
            </div>
            <p className="text-3xl font-bold text-white">{metrics.uniqueUsers.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-1">↑ 8% from last week</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-teal-400" />
              </div>
              <p className="text-sm text-gray-400">Conversion Rate</p>
            </div>
            <p className="text-3xl font-bold text-white">{metrics.conversionRate}%</p>
            <p className="text-xs text-red-400 mt-1">↓ 3% from last week</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-sm text-gray-400">Avg Session</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {Math.floor(metrics.avgSessionTime / 60)}m {metrics.avgSessionTime % 60}s
            </p>
            <p className="text-xs text-green-400 mt-1">↑ 5% from last week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Drop-off Points</h3>
            <div className="space-y-4">
              {metrics.dropOffPoints.map((point: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">{point.screen}</span>
                    <span className="text-sm font-bold text-white">{point.rate}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
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

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">User Engagement</h3>
            <div className="h-48 flex items-end gap-3">
              {[65, 82, 58, 91, 73, 88, 95].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-purple-500"
                    style={{ height: `${value}%` }}
                  ></div>
                  <span className="text-xs text-gray-500">D{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">AI Product Insights</h3>
          <div className="space-y-4">
            {suggestions
              .filter((s) => s.status === 'pending')
              .map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                          {suggestion.suggestion_type}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{suggestion.suggestion_text}</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSuggestionAction(suggestion.id, 'applied')}
                          className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Apply
                        </button>
                        <button
                          onClick={() => handleSuggestionAction(suggestion.id, 'ignored')}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {suggestions.filter((s) => s.status !== 'pending').length > 0 && (
              <>
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-gray-400 mb-4">Previous Actions</h4>
                </div>
                {suggestions
                  .filter((s) => s.status !== 'pending')
                  .map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl opacity-60"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            suggestion.status === 'applied'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {suggestion.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{suggestion.suggestion_text}</p>
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
