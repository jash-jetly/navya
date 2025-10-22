import { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw, Zap, CheckCircle } from 'lucide-react';

interface FlowchartDisplayProps {
  mermaidCode: string;
  onRestart: () => void;
}

export default function FlowchartDisplay({ mermaidCode, onRestart }: FlowchartDisplayProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        setIsRendering(true);
        setError(null);

        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          }
        });

        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = '';

          const { svg } = await mermaid.render('mermaid-diagram', mermaidCode);
          mermaidRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render flowchart. The generated code may have syntax errors.');
      } finally {
        setIsRendering(false);
      }
    };

    if (mermaidCode) {
      renderMermaid();
    }
  }, [mermaidCode]);

  const handleDownload = () => {
    const svgElement = mermaidRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'startup-architecture.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border border-green-500/30 rounded-lg bg-black/50 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <h2 className="text-4xl font-bold text-green-400 font-mono">
                  STARTUP ARCHITECTURE
                </h2>
              </div>
              <p className="text-green-300 font-mono text-lg">
                {'>>> YOUR VISION TRANSFORMED INTO ACTIONABLE BLUEPRINT'}
              </p>
              <div className="text-green-500 font-mono text-sm">
                [SYSTEM] GENERATED FLOWCHART READY FOR IMPLEMENTATION
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-mono hover:shadow-lg hover:shadow-green-400/20"
              >
                <Download className="w-5 h-5" />
                DOWNLOAD SVG
              </button>
              <button
                onClick={onRestart}
                className="bg-gray-700 hover:bg-gray-600 text-green-400 font-bold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-mono border border-green-500/30 hover:border-green-400"
              >
                <RefreshCw className="w-5 h-5" />
                NEW PROJECT
              </button>
            </div>
          </div>
        </div>

        {/* Flowchart Container */}
        <div className="border border-green-500/30 rounded-lg bg-black/50 p-8">
          {isRendering && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Zap className="w-8 h-8 text-green-400 animate-pulse" />
                  <div className="text-2xl font-bold text-green-400 font-mono">
                    RENDERING ARCHITECTURE...
                  </div>
                  <Zap className="w-8 h-8 text-green-400 animate-pulse" />
                </div>
                <p className="text-green-300 font-mono">
                  {'>>> PROCESSING YOUR STARTUP BLUEPRINT'}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="border border-red-500/50 rounded-lg p-8 bg-red-900/20">
                <h3 className="text-red-400 font-bold text-xl mb-4 font-mono">
                  RENDERING ERROR
                </h3>
                <p className="text-red-300 font-mono">{error}</p>
                <button
                  onClick={onRestart}
                  className="mt-6 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 font-mono"
                >
                  START OVER
                </button>
              </div>
            </div>
          )}

          {!isRendering && !error && (
            <div className="flowchart-container">
              <div 
                ref={mermaidRef} 
                className="mermaid-diagram bg-white/95 rounded-lg p-6 overflow-auto"
                style={{ minHeight: '400px' }}
              />
            </div>
          )}
        </div>

        {/* Success Message */}
        {!isRendering && !error && (
          <div className="text-center border border-green-500/30 rounded-lg p-8 bg-black/50">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <h3 className="text-3xl font-bold text-green-400 font-mono">
                MISSION ACCOMPLISHED
              </h3>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-green-300 text-xl font-mono mb-2">
              {'>>> YOUR STARTUP VISION IS NOW A REALITY'}
            </p>
            <p className="text-green-500 font-mono">
              [SYSTEM] USE THIS ARCHITECTURE AS YOUR DEVELOPMENT ROADMAP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
