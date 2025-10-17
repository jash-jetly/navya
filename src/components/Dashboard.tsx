import { useState } from 'react';
import { MessageSquare, GitBranch, Layout, Smartphone, BarChart3, Plus } from 'lucide-react';
import IdeaInput from './IdeaInput';

type View = 'idea' | 'flow' | 'wireframe' | 'app' | 'monitor';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('idea');
  const [currentIdea, setCurrentIdea] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);

  const handleIdeaCreated = (idea: any) => {
    setCurrentIdea(idea);
    setIdeas([idea, ...ideas]);
    setCurrentView('flow');
  };

  const menuItems = [
    { id: 'idea' as View, label: 'Chat', icon: MessageSquare },
    { id: 'flow' as View, label: 'Flow', icon: GitBranch },
    { id: 'wireframe' as View, label: 'Design', icon: Layout },
    { id: 'app' as View, label: 'App', icon: Smartphone },
    { id: 'monitor' as View, label: 'Monitor', icon: BarChart3 },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'idea':
        return <IdeaInput onIdeaCreated={handleIdeaCreated} />;
      default:
        return <IdeaInput onIdeaCreated={handleIdeaCreated} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-semibold">PRECODE</h1>
          <p className="text-sm text-zinc-400 mt-1">AI Product Builder</p>
        </div>

        {/* Ideas List */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-zinc-300">Ideas</h2>
            <button
              onClick={() => setCurrentView('idea')}
              className="p-1 hover:bg-zinc-800 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {ideas.map((idea) => (
              <button
                key={idea.id}
                onClick={() => {
                  setCurrentIdea(idea);
                  setCurrentView(idea.status || 'idea');
                }}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  currentIdea?.id === idea.id
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <div className="font-medium truncate">{idea.title}</div>
                <div className="text-xs text-zinc-500 mt-1 truncate">
                  {idea.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 border-t border-zinc-800">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentView === item.id
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
          <div>
            {currentIdea && (
              <div>
                <h2 className="font-medium">{currentIdea.title}</h2>
                <p className="text-sm text-zinc-400">{currentIdea.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {renderView()}
        </div>
      </div>
    </div>
  );
}
