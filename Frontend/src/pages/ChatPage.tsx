
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ChatInput from '@/components/chat/ChatInput';
import ChatWindow, { Message } from '@/components/chat/ChatWindow';

const getRandomId = (): string => Math.random().toString(36).substring(2, 10);

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: 'How can I help you today? Try using @video, @visual, @interactive, or @codevisual commands!'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: getRandomId(),
      type: 'user',
      content,
    };
    
    // Check for commands
    const videoMatch = content.match(/@video\s+(.*?)(?:\s|$)/);
    const visualMatch = content.match(/@visual\s+(.*?)(?:\s|$)/);
    const interactiveMatch = content.match(/@interactive\s+(.*?)(?:\s|$)/);
    const codeVisualMatch = content.match(/@codevisual\s+(.*?)(?:\s|$)/);
    
    if (videoMatch) {
      userMessage.videoCommand = {
        isActive: true,
        prompt: videoMatch[1] || ''
      };
    }
    
    if (visualMatch) {
      userMessage.visualCommand = {
        isActive: true,
        prompt: visualMatch[1] || ''
      };
    }
    
    if (interactiveMatch) {
      userMessage.interactiveCommand = {
        isActive: true,
        prompt: interactiveMatch[1] || ''
      };
    }
    
    if (codeVisualMatch) {
      userMessage.codeVisualCommand = {
        isActive: true,
        prompt: codeVisualMatch[1] || ''
      };
    }
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate AI response
    setTimeout(() => {
      let responseContent = `I received your message: "${content}". This is a simulated response in chat session ${id}. In a real application, this would be connected to an LLM API.`;
      
      const aiMessage: Message = {
        id: getRandomId(),
        type: 'assistant',
        content: responseContent,
      };
      
      // Add specific responses for commands
      if (videoMatch) {
        aiMessage.content += " I've processed your video request and displayed a preview above.";
        aiMessage.videoCommand = {
          isActive: true,
          prompt: videoMatch[1] || ''
        };
        toast.success('Video preview generated');
      }
      
      if (visualMatch) {
        aiMessage.content += " I've created a visual representation based on your prompt.";
        aiMessage.visualCommand = {
          isActive: true,
          prompt: visualMatch[1] || ''
        };
        toast.success('Visual canvas generated');
      }
      
      if (interactiveMatch) {
        aiMessage.content += " I've opened an interactive solver to help you with this problem.";
        aiMessage.interactiveCommand = {
          isActive: true,
          prompt: interactiveMatch[1] || ''
        };
        toast.success('Interactive solver opened');
      }
      
      if (codeVisualMatch) {
        const sampleP5Code = `
let arr = [5, 2, 99, 3, 1, 0]; // The array to sort
let i = 0, j = 0;
let sorting = true;

function setup() {
  createCanvas(600, 400);
  frameRate(2); // Slow down for visualization
}

function draw() {
  background(220);
  
  let barWidth = width / arr.length;

  // Draw bars
  for (let k = 0; k < arr.length; k++) {
    if (sorting && (k === j || k === j + 1)) {
      fill(255, 100, 100); // Highlight bars being compared
    } else {
      fill(100, 200, 255);
    }
    let barHeight = arr[k] * 4; // Scale bar height
    rect(k * barWidth, height - barHeight, barWidth - 5, barHeight);
  }

  // Perform one bubble sort step per frame
  if (sorting) {
    if (j < arr.length - 1 - i) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
      j++;
    } else {
      j = 0;
      i++;
      if (i >= arr.length - 1) {
        sorting = false; // Sorting completed
      }
    }
  } else {
    fill(0);
    textSize(24);
    text("Sorting Complete!", width / 2 - 70, 50);
  }
}`;
        
        aiMessage.content += " I've visualized the code for you below. You can see the bubble sort algorithm in action.";
        aiMessage.codeVisualCommand = {
          isActive: true,
          prompt: codeVisualMatch[1] || '',
          code: sampleP5Code
        };
        toast.success('Code visualization generated');
      }
      
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 2000);
  };
  
  const handleCommandSelect = (command: string, prompt: string) => {
    console.log(`Command selected: ${command}, Prompt: ${prompt}`);
    
    if (command === 'video') {
      handleSendMessage(`@video ${prompt}`);
    } else if (command === 'visual') {
      handleSendMessage(`@visual ${prompt}`);
    } else if (command === 'interactive') {
      handleSendMessage(`@interactive ${prompt}`);
    } else if (command === 'codevisual') {
      handleSendMessage(`@codevisual ${prompt}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatWindow 
        messages={messages} 
        isProcessing={isProcessing} 
      />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isProcessing={isProcessing}
        onCommandSelect={handleCommandSelect}
      />
    </div>
  );
};

export default ChatPage;
