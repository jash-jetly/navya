import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface FlowChartProps {
  chart: string;
  title?: string;
}

export default function FlowChart({ chart, title }: FlowChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {title}
        </h3>
      )}
      <div 
        ref={chartRef}
        className="w-full min-h-[300px] bg-zinc-900/30 border border-zinc-800 rounded-lg p-6 overflow-auto"
        style={{
          filter: 'invert(0)',
        }}
      />
    </div>
  );
}