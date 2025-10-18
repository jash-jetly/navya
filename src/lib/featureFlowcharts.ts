import { model } from './gemini';

export interface Feature {
  id: string;
  name: string;
  description: string;
  flowchart?: string;
  isGenerated?: boolean;
}

export async function generateFeatureFlowchart(feature: Feature, chatHistory: Array<{type: 'user' | 'ai', message: string}> = []): Promise<string> {
  try {
    let contextPrompt = '';
    if (chatHistory.length > 0) {
      contextPrompt = '\n\nConversation context:\n';
      chatHistory.forEach((msg) => {
        contextPrompt += `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.message}\n`;
      });
      contextPrompt += '\n';
    }

    const prompt = `${contextPrompt}Create a detailed user flow diagram for this specific feature:

Feature Name: ${feature.name}
Feature Description: ${feature.description}

Generate a comprehensive flowchart that shows:
1. User entry points to this feature
2. Step-by-step user interactions
3. Decision points and branching paths
4. Success and error states
5. Exit points or next actions

Format the response as a mermaid flowchart using proper syntax.
Focus specifically on this feature's user journey, not the entire app.

Example format:
\`\`\`mermaid
flowchart TD
    A[User starts] --> B{Decision point}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[Success state]
    D --> F[Alternative flow]
\`\`\``;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating feature flowchart:', error);
    throw new Error('Failed to generate feature flowchart');
  }
}

export async function generateFinalAppFlowchart(features: Feature[], chatHistory: Array<{type: 'user' | 'ai', message: string}> = []): Promise<string> {
  try {
    let contextPrompt = '';
    if (chatHistory.length > 0) {
      contextPrompt = '\n\nConversation context:\n';
      chatHistory.forEach((msg) => {
        contextPrompt += `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.message}\n`;
      });
      contextPrompt += '\n';
    }

    const featuresDescription = features.map(f => `- ${f.name}: ${f.description}`).join('\n');

    const prompt = `${contextPrompt}Create a comprehensive app-level user flow diagram that connects all these finalized features:

${featuresDescription}

Generate a high-level flowchart that shows:
1. App entry point (login/onboarding)
2. Main navigation between features
3. How features connect and interact with each other
4. User journey across the entire app
5. Key decision points and user paths

Format the response as a mermaid flowchart using proper syntax.
This should be the master flowchart showing the complete app experience.

Example format:
\`\`\`mermaid
flowchart TD
    A[App Launch] --> B[Onboarding]
    B --> C[Main Dashboard]
    C --> D[Feature 1]
    C --> E[Feature 2]
    D --> F[Feature Integration]
\`\`\``;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating final app flowchart:', error);
    throw new Error('Failed to generate final app flowchart');
  }
}

export async function suggestFeatures(ideaDescription: string, chatHistory: Array<{type: 'user' | 'ai', message: string}> = []): Promise<Feature[]> {
  try {
    let contextPrompt = '';
    if (chatHistory.length > 0) {
      contextPrompt = '\n\nConversation context:\n';
      chatHistory.forEach((msg) => {
        contextPrompt += `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.message}\n`;
      });
      contextPrompt += '\n';
    }

    const prompt = `${contextPrompt}Based on this idea: "${ideaDescription}"

Suggest 4-6 core features that would make this app valuable and user-friendly. For each feature, provide:
1. A clear, concise name
2. A brief description of what it does and why it's important

Focus on features that:
- Solve the core problem
- Enhance user experience
- Are feasible to implement
- Work well together

Format your response as a JSON array like this:
[
  {
    "name": "Feature Name",
    "description": "Clear description of what this feature does and its value"
  }
]

Only return the JSON array, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
    
    const suggestedFeatures = JSON.parse(jsonText);
    return suggestedFeatures.map((feature: any, index: number) => ({
      id: `feature-${index + 1}`,
      name: feature.name,
      description: feature.description,
      isGenerated: false
    }));
  } catch (error) {
    console.error('Error suggesting features:', error);
    // Fallback to default features if AI fails
    return [
      {
        id: 'feature-1',
        name: 'User Authentication',
        description: 'Secure login and registration system',
        isGenerated: false
      },
      {
        id: 'feature-2',
        name: 'Core Functionality',
        description: 'Main feature that solves the primary problem',
        isGenerated: false
      },
      {
        id: 'feature-3',
        name: 'User Dashboard',
        description: 'Central hub for users to access all features',
        isGenerated: false
      }
    ];
  }
}