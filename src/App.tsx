import { useState } from 'react';
import LandingPage from './components/LandingPage';
import BrainstormingChat from './components/BrainstormingChat';
import VisionMissionForm from './components/VisionMissionForm';
import FeatureSelection from './components/FeatureSelection';
import FlowchartDisplay from './components/FlowchartDisplay';
import { ChatMessage, VisionMission } from './types';
import { generateFlowchartFromChatLog } from './services/gemini';

type AppStep = 'landing' | 'brainstorming' | 'vision-mission' | 'feature-selection' | 'flowchart';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [visionMission, setVisionMission] = useState<VisionMission | null>(null);
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateApp = () => {
    setCurrentStep('brainstorming');
  };

  const handleEndBrainstorming = () => {
    setCurrentStep('vision-mission');
  };

  const handleVisionMissionSubmit = (vm: VisionMission) => {
    setVisionMission(vm);
    setCurrentStep('feature-selection');
  };

  const handleFeatureSelection = async (selectedFeatures: string[]) => {
    setIsGenerating(true);
    try {
      const chatLog = chatMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      const result = await generateFlowchartFromChatLog(chatLog, selectedFeatures);
      
      if (result.success && result.mermaidCode) {
        setMermaidCode(result.mermaidCode);
        setCurrentStep('flowchart');
      } else {
        console.error('Failed to generate flowchart:', result.error);
        alert('Failed to generate flowchart. Please try again.');
      }
    } catch (error) {
      console.error('Error generating flowchart:', error);
      alert('An error occurred while generating the flowchart.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep('landing');
    setChatMessages([]);
    setVisionMission(null);
    setMermaidCode('');
    setIsGenerating(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return <LandingPage onCreateApp={handleCreateApp} />;
      case 'brainstorming':
        return (
          <BrainstormingChat 
            messages={chatMessages}
            onMessagesUpdate={setChatMessages}
            onEndBrainstorming={handleEndBrainstorming}
          />
        );
      case 'vision-mission':
        return <VisionMissionForm onSubmit={handleVisionMissionSubmit} />;
      case 'feature-selection':
        const chatLog = chatMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
        return (
          <FeatureSelection 
            onFeatureSelect={handleFeatureSelection}
            chatLog={chatLog}
            visionMission={visionMission || undefined}
          />
        );
      case 'flowchart':
        return <FlowchartDisplay mermaidCode={mermaidCode} onRestart={handleRestart} />;
      default:
        return <LandingPage onCreateApp={handleCreateApp} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentStep()}
    </div>
  );
}

export default App;
