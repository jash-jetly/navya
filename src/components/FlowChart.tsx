import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

interface FlowChartProps {
  chart: string;
  title?: string;
}

export default function FlowChart({ chart, title }: FlowChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#ffffff',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#404040',
        lineColor: '#606060',
        sectionBkgColor: '#1a1a1a',
        altSectionBkgColor: '#2a2a2a',
        gridColor: '#404040',
        secondaryColor: '#404040',
        tertiaryColor: '#606060',
        background: '#000000',
        mainBkg: '#1a1a1a',
        secondBkg: '#2a2a2a',
        tertiaryBkg: '#3a3a3a'
      }
    });
  }, []);

  useEffect(() => {
    if (chartRef.current && chart) {
      chartRef.current.innerHTML = '';
      
      const chartId = `mermaid-${Date.now()}`;
      
      mermaid.render(chartId, chart).then(({ svg }) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = svg;
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error);
        if (chartRef.current) {
          chartRef.current.innerHTML = `
            <div class="text-red-400 p-4 border border-red-400/20 rounded-lg bg-red-400/5">
              <p class="font-medium mb-2">Error rendering flowchart</p>
              <p class="text-sm opacity-75">Please check the chart syntax</p>
            </div>
          `;
        }
      });
    }
  }, [chart]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {title}
        </h3>
      )}
      
      <div className="relative w-full h-[500px] bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden">
        {/* Control Panel */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-zinc-800 text-white text-sm rounded-lg">
          {Math.round(zoom * 100)}%
        </div>

        {/* Pan Indicator */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1 bg-zinc-800 text-white text-sm rounded-lg">
          <Move className="w-3 h-3" />
          <span>Drag to pan • Scroll to zoom</span>
        </div>

        {/* Scrollable Chart Container */}
        <div
          ref={containerRef}
          className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            ref={chartRef}
            className="w-full h-full p-6 transition-transform duration-150"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              filter: 'invert(0)',
            }}
          />
        </div>
      </div>
    </div>
  );
}