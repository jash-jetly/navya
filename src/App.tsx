import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import BrainstormingChat from './components/BrainstormingChat';
import VisionMissionForm from './components/VisionMissionForm';
import FeatureSelection from './components/FeatureSelection';
import FlowchartDisplay from './components/FlowchartDisplay';
import { AppStep, ChatMessage, VisionMission } from './types';
import { saveChatLogToStorage } from './services/supabase';
import { generateFlowchartFromChatLog } from './services/gemini';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [visionMission, setVisionMission] = useState<VisionMission | null>(null);
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const formatChatLog = (messages: ChatMessage[], vm?: VisionMission | null): string => {
    let log = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    if (vm) {
      log += `\nuser: Vision - ${vm.vision}`;
      log += `\nuser: Mission - ${vm.mission}`;
      log += `\nai: Great! Your vision and mission provide clear direction for your startup.`;
    }

    return log;
  };

  const handleCreateApp = () => {
    setCurrentStep('brainstorming');
  };

  const handleEndBrainstorming = async () => {
    const chatLog = formatChatLog(chatMessages);
    await saveChatLogToStorage(chatLog, userId);
    setCurrentStep('vision-mission');
  };

  const handleVisionMissionSubmit = async (vm: VisionMission) => {
    setVisionMission(vm);
    const chatLog = formatChatLog(chatMessages, vm);
    await saveChatLogToStorage(chatLog, userId);
    setCurrentStep('feature-selection');
  };

  const handleFeatureSelection = async (selectedFeatures: string[]) => {
    setIsGenerating(true);

    const chatLog = formatChatLog(chatMessages, visionMission);
    const result = await generateFlowchartFromChatLog(chatLog, selectedFeatures);

    if (result.success && result.mermaidCode) {
      setMermaidCode(result.mermaidCode);
      setCurrentStep('flowchart');
    } else {
      alert('Failed to generate flowchart. Please try again.');
    }

    setIsGenerating(false);
  };

  const handleRestart = () => {
    setChatMessages([]);
    setVisionMission(null);
    setMermaidCode('');
    setCurrentStep('landing');
  };

  return (
    <>
      {currentStep === 'landing' && (
        <LandingPage onCreateApp={handleCreateApp} />
      )}

      {currentStep === 'brainstorming' && (
        <BrainstormingChat
          messages={chatMessages}
          onMessagesUpdate={setChatMessages}
          onEndBrainstorming={handleEndBrainstorming}
        />
      )}

      {currentStep === 'vision-mission' && (
        <VisionMissionForm onSubmit={handleVisionMissionSubmit} />
      )}

      {currentStep === 'feature-selection' && (
        <FeatureSelection
          onSubmit={handleFeatureSelection}
          isGenerating={isGenerating}
        />
      )}

      {currentStep === 'flowchart' && (
        <FlowchartDisplay
          mermaidCode={mermaidCode}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}

export default App;
