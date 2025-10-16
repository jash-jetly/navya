import { useState } from 'react';
import { X, Smartphone, Globe, ShoppingCart, Users, Zap, Layers } from 'lucide-react';

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

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const handleComplete = () => {
    if (selectedTypes.length === 0) return;

    setLoading(true);
    // Save preferences locally or to localStorage
    localStorage.setItem('preferredAppTypes', selectedTypes.join(','));
    localStorage.setItem('onboardingComplete', 'true');
    
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-lg w-full p-6 relative">
        <button
          onClick={() => handleComplete()}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-medium text-white mb-1">Welcome</h2>
        <p className="text-zinc-400 text-sm mb-6">What kind of apps do you usually build?</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {appTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedTypes.includes(type.id);

            return (
              <button
                key={type.id}
                onClick={() => toggleType(type.id)}
                className={`p-4 rounded-lg border transition-colors ${
                  isSelected
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 text-zinc-300'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 mx-auto ${isSelected ? 'text-black' : 'text-zinc-400'}`} />
                <span className="text-xs font-medium">
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleComplete}
          disabled={selectedTypes.length === 0 || loading}
          className="w-full py-2.5 bg-white text-black rounded-lg text-sm font-medium transition-colors hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : "Continue"}
        </button>
      </div>
    </div>
  );
}
