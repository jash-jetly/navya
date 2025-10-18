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

CRITICAL MERMAID SYNTAX RULES:
- Start with exactly "flowchart TD"
- Use ONLY alphanumeric node IDs: A, B, C, D, etc. (NO spaces, NO special chars)
- Use --> for arrows
- Use [] for rectangular boxes
- Use {} for diamond decision nodes
- Use () for rounded boxes
- Use |text| for arrow labels
- NO quotes around any text
- Keep node text under 20 characters
- Each line must be a complete statement

VALID Example:
flowchart TD
    A[Feature Entry] --> B[Load Data]
    B --> C{Data Valid}
    C -->|Yes| D[Show Interface]
    C -->|No| E[Error Message]
    E --> B
    D --> F[User Action]
    F --> G[Process Request]
    G --> H[Success State]

Generate ONLY the mermaid flowchart code with NO markdown formatting.
Focus specifically on this feature's user journey, not the entire app.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let mermaidCode = response.text().trim();
    
    // Clean up the mermaid code
    mermaidCode = mermaidCode.replace(/```mermaid/g, '');
    mermaidCode = mermaidCode.replace(/```/g, '');
    mermaidCode = mermaidCode.replace(/^\s*[\r\n]/gm, '');
    mermaidCode = mermaidCode.trim();
    
    // Split into lines and clean each line
    const lines = mermaidCode.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Ensure first line is flowchart TD
    if (!lines[0] || !lines[0].startsWith('flowchart')) {
      lines.unshift('flowchart TD');
    }
    
    // Clean and validate lines
    const cleanedLines = lines.map(line => {
      if (line.startsWith('flowchart')) return line;
      
      let cleanLine = line
        .replace(/[""'']/g, '')
        .replace(/\s+/g, ' ')
        .replace(/-->/g, ' --> ')
        .replace(/\|\s*([^|]+)\s*\|/g, '|$1|')
        .trim();
      
      cleanLine = cleanLine.replace(/([A-Z]\d*)\s*\[/g, '$1[');
      cleanLine = cleanLine.replace(/([A-Z]\d*)\s*\{/g, '$1{');
      cleanLine = cleanLine.replace(/([A-Z]\d*)\s*\(/g, '$1(');
      
      return cleanLine;
    });
    
    const validLines = cleanedLines.filter(line => {
      if (line.startsWith('flowchart')) return true;
      return line.includes('-->') || /^[A-Z]\d*[\[\{\(]/.test(line);
    });
    
    return validLines.join('\n');
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

CRITICAL MERMAID SYNTAX RULES:
- Start with exactly "flowchart TD"
- Use ONLY alphanumeric node IDs: A, B, C, D, etc. (NO spaces, NO special chars)
- Use --> for arrows
- Use [] for rectangular boxes
- Use {} for diamond decision nodes
- Use () for rounded boxes
- Use |text| for arrow labels
- NO quotes around any text
- Keep node text under 20 characters
- Each line must be a complete statement

VALID Example:
flowchart TD
    A[App Launch] --> B[User Login]
    B --> C{Auth Success}
    C -->|Yes| D[Main Dashboard]
    C -->|No| E[Login Error]
    E --> B
    D --> F[Feature Menu]
    F --> G[Feature 1]
    F --> H[Feature 2]
    G --> I[Feature Action]
    H --> J[Feature Result]

Generate ONLY the mermaid flowchart code with NO markdown formatting.
This should be the master flowchart showing the complete app experience.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let mermaidCode = response.text().trim();
    
    // Clean up the mermaid code
    mermaidCode = mermaidCode.replace(/```mermaid/g, '');
    mermaidCode = mermaidCode.replace(/```/g, '');
    mermaidCode = mermaidCode.replace(/^\s*[\r\n]/gm, '');
    mermaidCode = mermaidCode.trim();
    
    // Split into lines and clean each line
    const lines = mermaidCode.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Ensure first line is flowchart TD
    if (!lines[0] || !lines[0].startsWith('flowchart')) {
      lines.unshift('flowchart TD');
    }
    
    // Clean and validate lines
    const cleanedLines = lines.map(line => {
      if (line.startsWith('flowchart')) return line;
      
      let cleanLine = line
        .replace(/[""'']/g, '')
        .replace(/\s+/g, ' ')
        .replace(/-->/g, ' --> ')
        .replace(/\|\s*([^|]+)\s*\|/g, '|$1|')
        .trim();
      
      cleanLine = cleanLine.replace(/([A-Z]\d*)\s*\[/g, '$1[');
      cleanLine = cleanLine.replace(/([A-Z]\d*)\s*\{/g, '$1{');
      cleanLine = cleanLine.replace(/([A-Z]\d*)\s*\(/g, '$1(');
      
      return cleanLine;
    });
    
    const validLines = cleanedLines.filter(line => {
      if (line.startsWith('flowchart')) return true;
      return line.includes('-->') || /^[A-Z]\d*[\[\{\(]/.test(line);
    });
    
    return validLines.join('\n');
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

    const prompt = `${contextPrompt}What an exciting idea! "${ideaDescription}" has real potential to make a difference.

Let's build on this great concept by suggesting 4-6 core features that will bring your vision to life. For each feature, I'll provide:
1. A clear, concise name
2. A brief description of what it does and why it's valuable for your users

I'm focusing on features that will:
- Solve the core problem your idea addresses
- Create an amazing user experience
- Are totally achievable to implement
- Work beautifully together to create something special

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