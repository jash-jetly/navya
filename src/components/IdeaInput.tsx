import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface IdeaInputProps {
  onIdeaCreated: (idea: any) => void;
}

export default function IdeaInput({ onIdeaCreated }: IdeaInputProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || loading) return;

    setLoading(true);

    try {
      const title = description.slice(0, 50) + (description.length > 50 ? '...' : '');

      const { data: ideaData, error } = await supabase
        .from('ideas')
        .insert({
          user_id: user?.id,
          title,
          description,
          status: 'flow',
        })
        .select()
        .single();

      if (error) throw error;

      const flowData = generateFlowData(description);
      await supabase.from('user_flows').insert({
        idea_id: ideaData.id,
        flow_data: flowData,
      });

      const wireframeData = generateWireframeData(description);
      await supabase.from('wireframes').insert({
        idea_id: ideaData.id,
        wireframe_data: wireframeData,
      });

      const screensData = generateScreensData(description);
      await supabase.from('app_builds').insert({
        idea_id: ideaData.id,
        screens: screensData,
      });

      const metricsData = generateMetricsData();
      await supabase.from('analytics').insert({
        idea_id: ideaData.id,
        metrics: metricsData,
      });

      const suggestions = generateSuggestions();
      await supabase.from('ai_suggestions').insert(
        suggestions.map((s) => ({
          idea_id: ideaData.id,
          suggestion_text: s.text,
          suggestion_type: s.type,
          status: 'pending',
        }))
      );

      onIdeaCreated(ideaData);
      setDescription('');
    } catch (error) {
      console.error('Error creating idea:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Describe Your App Idea</h1>
          <p className="text-lg text-gray-400">
            Tell me what you want to build, and I'll create a complete product plan for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., A fitness tracking app where users can log workouts, track progress, set goals, and connect with friends for motivation..."
              className="w-full h-40 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none"
              disabled={loading}
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400">
                {description.length > 0 ? `${description.length} characters` : 'Start typing...'}
              </p>
              <button
                type="submit"
                disabled={!description.trim() || loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    Generate Plan <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {['User Flow', 'Wireframe', 'Live Preview'].map((step, idx) => (
            <div
              key={idx}
              className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-center"
            >
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold mx-auto mb-2">
                {idx + 1}
              </div>
              <p className="text-sm text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generateFlowData(description: string) {
  return {
    steps: [
      { id: 1, label: 'User Landing', type: 'start' },
      { id: 2, label: 'Authentication', type: 'process' },
      { id: 3, label: 'Main Dashboard', type: 'process' },
      { id: 4, label: 'Core Feature', type: 'process' },
      { id: 5, label: 'User Action', type: 'decision' },
      { id: 6, label: 'Success State', type: 'end' },
    ],
    connections: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
    ],
  };
}

function generateWireframeData(description: string) {
  return {
    screens: [
      {
        name: 'Login Screen',
        components: [
          { type: 'header', height: 80, label: 'App Logo' },
          { type: 'form', height: 300, label: 'Login Form' },
          { type: 'button', height: 50, label: 'Sign In Button' },
        ],
      },
      {
        name: 'Dashboard',
        components: [
          { type: 'navbar', height: 60, label: 'Navigation Bar' },
          { type: 'sidebar', height: 400, label: 'Menu' },
          { type: 'content', height: 400, label: 'Main Content' },
          { type: 'footer', height: 60, label: 'Footer' },
        ],
      },
    ],
  };
}

function generateScreensData(description: string) {
  return [
    { id: 1, name: 'Welcome', active: true },
    { id: 2, name: 'Dashboard', active: false },
    { id: 3, name: 'Feature View', active: false },
  ];
}

function generateMetricsData() {
  return {
    pageViews: 1247,
    uniqueUsers: 523,
    conversionRate: 12.4,
    avgSessionTime: 324,
    dropOffPoints: [
      { screen: 'Login', rate: 15 },
      { screen: 'Onboarding', rate: 8 },
      { screen: 'Payment', rate: 22 },
    ],
  };
}

function generateSuggestions() {
  return [
    {
      text: 'Login conversion is 15% below average. Consider adding social login options.',
      type: 'ux',
    },
    {
      text: 'Users spend 40% more time on dashboard. Add quick action shortcuts.',
      type: 'design',
    },
    {
      text: 'Payment drop-off is high. Simplify checkout to single page.',
      type: 'conversion',
    },
  ];
}
