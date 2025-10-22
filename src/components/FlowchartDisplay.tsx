import { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';

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
          theme: 'default',
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
    link.download = 'app-flowchart.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your App Flowchart</h2>
              <p className="text-gray-600">Generated user flow and feature mapping</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download SVG
              </button>
              <button
                onClick={onRestart}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Start Over
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {isRendering && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Rendering flowchart...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          <div
            ref={mermaidRef}
            className="overflow-x-auto"
            style={{ display: isRendering || error ? 'none' : 'block' }}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Review the flowchart and ensure it captures your vision</li>
            <li>• Download the SVG file for documentation</li>
            <li>• Use this flowchart as a blueprint for development</li>
            <li>• Share with your team to align on the user experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
