import { Brain, Users, Rocket, MessageSquare, MessageCircle } from 'lucide-react';

export type AIMode = 'general' | 'therapist' | 'friend' | 'coach' | 'moderator';

interface ModeSelectorProps {
  selectedMode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

const modes = [
  { id: 'general' as AIMode, icon: MessageCircle, label: 'General Chat', emoji: '💬' },
  { id: 'therapist' as AIMode, icon: Brain, label: 'Therapist', emoji: '🧘' },
  { id: 'friend' as AIMode, icon: Users, label: 'Friend', emoji: '🤝' },
  { id: 'coach' as AIMode, icon: Rocket, label: 'Life Coach', emoji: '🚀' },
  { id: 'moderator' as AIMode, icon: MessageSquare, label: 'Moderator', emoji: '🗣️' },
];

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-2 sm:gap-3 justify-center flex-wrap px-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = selectedMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300
              ${isActive
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30 scale-105'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
              }
            `}
          >
            <span className="text-lg">{mode.emoji}</span>
            <span className="font-medium text-sm sm:text-base hidden sm:inline">{mode.label}</span>
            <span className="font-medium text-sm sm:text-base sm:hidden">{mode.label.split(' ')[0]}</span>
          </button>
        );
      })}
    </div>
  );
}
