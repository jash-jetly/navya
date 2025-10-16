import { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, GitBranch, Layout, Smartphone, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import IdeaInput from './IdeaInput';
import FlowView from './FlowView';
import WireframeView from './WireframeView';
import AppView from './AppView';
import MonitorView from './MonitorView';

type View = 'idea' | 'flow' | 'wireframe' | 'app' | 'monitor';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('idea');
  const [currentIdea, setCurrentIdea] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      loadIdeas();
    }
  }, [user]);

  const loadIdeas = async () => {
    const { data } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) {
      setIdeas(data);
      if (data.length > 0 && !currentIdea) {
        setCurrentIdea(data[0]);
        setCurrentView(data[0].status || 'idea');
      }
    }
  };

  const handleIdeaCreated = (idea: any) => {
    setCurrentIdea(idea);
    setIdeas([idea, ...ideas]);
    setCurrentView('flow');
  };

  const menuItems = [
    { id: 'idea' as View, label: 'Idea', icon: Lightbulb },
    { id: 'flow' as View, label: 'Flow', icon: GitBranch },
    { id: 'wireframe' as View, label: 'Wireframe', icon: Layout },
    { id: 'app' as View, label: 'App', icon: Smartphone },
    { id: 'monitor' as View, label: 'Monitor', icon: BarChart3 },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'idea':
        return <IdeaInput onIdeaCreated={handleIdeaCreated} />;
      case 'flow':
        return <FlowView ideaId={currentIdea?.id} />;
      case 'wireframe':
        return <WireframeView ideaId={currentIdea?.id} />;
      case 'app':
        return <AppView ideaId={currentIdea?.id} />;
      case 'monitor':
        return <MonitorView ideaId={currentIdea?.id} />;
      default:
        return <IdeaInput onIdeaCreated={handleIdeaCreated} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#121218] to-[#0B0B0F] flex">
      <aside className="w-72 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">precode</span>
          </div>

          {currentIdea && (
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-gray-400 mb-1">Current Project</p>
              <p className="text-sm text-white font-medium truncate">{currentIdea.title}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isDisabled = !currentIdea && item.id !== 'idea';

              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && setCurrentView(item.id)}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-500/20 border border-blue-500/50 text-white shadow-lg shadow-blue-500/20'
                      : isDisabled
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{renderView()}</main>
    </div>
  );
}
