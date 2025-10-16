import { useState } from 'react';
import { X, Smartphone, Globe, ShoppingCart, Users, Zap, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingModalProps {
  onComplete: () => void;
}

const appTypes = [
  { id: 'mobile', label: 'Mobile Apps', icon: Smartphone },
  { id: 'web', label: 'Web Apps', icon: Globe },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
  { id: 'social', label: 'Social Networks', icon: Users },
  { id: 'saas', label: 'SaaS Products', icon: Zap },
  { id: 'other', label: 'Other', icon: Layers },
];

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const handleComplete = async () => {
    if (selectedTypes.length === 0) return;

    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({
          preferred_app_types: selectedTypes.join(','),
          onboarding_complete: true,
        })
        .eq('id', user?.id);

      onComplete();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#121218] to-[#0B0B0F] border border-white/10 rounded-2xl max-w-2xl w-full p-8 relative">
        <button
          onClick={() => handleComplete()}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Welcome to precode</h2>
        <p className="text-gray-400 mb-8">What kind of apps do you usually build?</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {appTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedTypes.includes(type.id);

            return (
              <button
                key={type.id}
                onClick={() => toggleType(type.id)}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 border-white/10 hover:border-blue-500/30'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 mx-auto ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleComplete}
          disabled={selectedTypes.length === 0 || loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? 'Saving...' : "Let's Start Building"}
        </button>
      </div>
    </div>
  );
}
