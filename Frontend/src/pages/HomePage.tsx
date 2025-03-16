
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import ChatInput from '@/components/chat/ChatInput';
import ChatWindow, { Message } from '@/components/chat/ChatWindow';
import SuggestionCard from '@/components/chat/SuggestionCard';
import { toast } from 'sonner';

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
};

const getRandomId = (): string => Math.random().toString(36).substring(2, 10);

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [username, setUsername] = useState('User');
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'User';
    setUsername(storedUsername);

    setTimeOfDay(getTimeOfDay());
  }, []);

  const handleSendMessage = (content: string) => {
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
    setShowWelcome(false);
    setIsProcessing(true);
    
    setTimeout(() => {
      let responseContent = `I received your message: "${content}". This is a simulated response. In a real application, this would be connected to an LLM API.`;
      
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

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const paperPlaneAnimation = {
    floatingAnimation: "animate-float",
    delayedFadeIn: "opacity-0 animate-fade-in"
  };

  return (
    <div className="flex flex-col h-full">
      {showWelcome && messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-20">
          <div className={`${paperPlaneAnimation.floatingAnimation} mb-6`}>
            <div className="w-28 h-28">
              <img 
                src="/lovable-uploads/685058b1-c1af-48b0-80bc-39ef7dd3dacb.png" 
                alt="Paper plane" 
                className="w-full h-full"
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-3">
            Good {timeOfDay}, <span className="text-accent">{username}</span>
          </h1>
          
          <p className="text-muted-foreground mb-8 max-w-md">
            Ask me anything or try one of these examples:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            <SuggestionCard
              icon="code"
              title="@interactive Solve x² - 3x + 2 = 0"
              onClick={() => handleSuggestionClick("@interactive Solve x² - 3x + 2 = 0")}
              className="animate-fade-in"
            />
            <SuggestionCard
              icon="chart"
              title="@visual Graph f(x) = x²"
              onClick={() => handleSuggestionClick("@visual Graph f(x) = x²")}
              className="animate-fade-in"
            />
            <SuggestionCard
              icon="science"
              title="@codevisual Bubble sort visualization"
              onClick={() => handleSuggestionClick("@codevisual Bubble sort visualization")}
              className="animate-fade-in"
            />
          </div>
        </div>
      ) : (
        <ChatWindow 
          messages={messages} 
          isProcessing={isProcessing} 
        />
      )}

      <ChatInput 
        onSendMessage={handleSendMessage} 
        isProcessing={isProcessing}
        onCommandSelect={handleCommandSelect}
      />
    </div>
  );
};

export default HomePage;
