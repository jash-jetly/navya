import React from 'react';

export function formatAIResponse(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const formattedElements: React.ReactNode[] = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      // Add spacing for empty lines
      formattedElements.push(React.createElement('div', { key: `space-${index}`, className: 'h-3' }));
      return;
    }
    
    // Handle bold headings (text wrapped in **)
    if (trimmedLine.includes('**')) {
      const parts = trimmedLine.split('**');
      const elements: React.ReactNode[] = [];
      
      parts.forEach((part, partIndex) => {
        if (partIndex % 2 === 1) {
          // Odd indices are bold text
          elements.push(React.createElement('strong', { key: `bold-${index}-${partIndex}`, className: 'font-semibold text-white' }, part));
        } else if (part) {
          // Even indices are regular text
          elements.push(part);
        }
      });
      
      formattedElements.push(
        React.createElement('div', { key: `line-${index}`, className: 'mb-3' }, elements)
      );
      return;
    }
    
    // Handle bullet points
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      const bulletText = trimmedLine.substring(2);
      formattedElements.push(
        React.createElement('div', { 
          key: `bullet-${index}`, 
          className: 'flex items-start gap-2 mb-2 ml-4' 
        }, [
          React.createElement('span', { key: 'bullet', className: 'text-blue-400 mt-1' }, '•'),
          React.createElement('span', { key: 'text', className: 'text-sm leading-relaxed' }, bulletText)
        ])
      );
      return;
    }
    
    // Handle numbered lists
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      const [, number, text] = numberedMatch;
      formattedElements.push(
        React.createElement('div', { 
          key: `numbered-${index}`, 
          className: 'flex items-start gap-2 mb-2 ml-4' 
        }, [
          React.createElement('span', { key: 'number', className: 'text-blue-400 font-medium' }, `${number}.`),
          React.createElement('span', { key: 'text', className: 'text-sm leading-relaxed' }, text)
        ])
      );
      return;
    }
    
    // Handle emoji sections (🔧, 📱, etc.)
    if (trimmedLine.match(/^[🔧📱🎯💡🚀⚡🎨🔍📊🛠️]/)) {
      formattedElements.push(
        React.createElement('div', { 
          key: `emoji-${index}`, 
          className: 'mb-3 mt-4 text-sm font-medium text-blue-300' 
        }, trimmedLine)
      );
      return;
    }
    
    // Regular paragraphs
    formattedElements.push(
      React.createElement('div', { 
        key: `para-${index}`, 
        className: 'mb-3 text-sm leading-relaxed text-zinc-200' 
      }, trimmedLine)
    );
  });
  
  return formattedElements;
}