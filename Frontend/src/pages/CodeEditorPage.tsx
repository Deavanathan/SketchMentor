import React, { useState, useRef } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/code/CodeEditor';
import Navigation from '@/components/navigation/Navigation';
import { toast } from 'sonner';

interface Message {
  type: 'user' | 'ai';
  content: string;
  command?: string;
  code?: string;
}

const CodeEditorPage: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [codeContent, setCodeContent] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {type: 'ai', content: 'Hi! I can help you with your code. Try writing some code and asking me about it with @code.'}
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleCodeChange = (code: string) => {
    setCodeContent(code);
  };

  const sendData = (endpoint: string, data: any) => {
    // Implement logic to send data to the backend
    console.log(`Sending data to ${endpoint}:`, data);
    //Replace with actual backend API call
    fetch(`http://localhost:8081/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    const userMessage: Message = {
      type: 'user',
      content: currentMessage,
      command: currentMessage.includes('@code') ? '@code' : 
               currentMessage.includes('@video') ? '@video' :
               currentMessage.includes('@visual') ? '@visual' :
               currentMessage.includes('@interactive') ? '@interactive' : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    setTimeout(() => {
      let aiResponse: Message;
      
      if (userMessage.command === '@code') {
        if (codeContent) {
          // Prepare data to send to the backend
          const codeData = {
            code: codeContent,
            query: currentMessage.replace('@code', '').trim()
          };
          
          // Log data for Postman testing
          console.log('POSTMAN TEST DATA (copy this):');
          console.log(JSON.stringify(codeData, null, 2));
          
          sendData('code', codeData);
          
          aiResponse = {
            type: 'ai',
            content: `I've analyzed your code. Your prompt was: "${currentMessage.replace('@code', '').trim()}"`,
            command: '@code',
            code: codeContent
          };
          toast.success('Code sent to AI');
        } else {
          aiResponse = {
            type: 'ai',
            content: 'I don\'t see any code in the editor yet. Try writing some code first!'
          };
        }
      } else if (userMessage.command === '@video') {
        // Handle video command
        const videoData = {
          query: currentMessage.replace('@video', '').trim(),
          timestamp: new Date().toISOString()
        };
        
        console.log('VIDEO COMMAND DATA (copy this):');
        console.log(JSON.stringify(videoData, null, 2));
        console.log('Would send to: http://localhost:8081/video');
        
        aiResponse = {
          type: 'ai',
          content: `I've processed your video request. Your prompt was: "${currentMessage.replace('@video', '').trim()}"`,
          command: '@video'
        };
        toast.success('Video request processed');
      } else if (userMessage.command === '@visual') {
        // Handle visual command
        const visualData = {
          query: currentMessage.replace('@visual', '').trim(),
          timestamp: new Date().toISOString()
        };
        
        console.log('VISUAL COMMAND DATA (copy this):');
        console.log(JSON.stringify(visualData, null, 2));
        console.log('Would send to: http://localhost:8080/visual');
        
        aiResponse = {
          type: 'ai',
          content: `I've processed your visual request. Your prompt was: "${currentMessage.replace('@visual', '').trim()}"`,
          command: '@visual'
        };
        toast.success('Visual request processed');
      } else if (userMessage.command === '@interactive') {
        // Handle interactive command
        const interactiveData = {
          query: currentMessage.replace('@interactive', '').trim(),
          timestamp: new Date().toISOString()
        };
        
        console.log('INTERACTIVE COMMAND DATA (copy this):');
        console.log(JSON.stringify(interactiveData, null, 2));
        console.log('Would send to: http://localhost:8080/interactive');
        
        aiResponse = {
          type: 'ai',
          content: `I've processed your interactive request. Your prompt was: "${currentMessage.replace('@interactive', '').trim()}"`,
          command: '@interactive'
        };
        toast.success('Interactive request processed');
      } else {
        aiResponse = {
          type: 'ai',
          content: `I received your message: "${currentMessage}". Try using @code to analyze your code, @video for video content, @visual for visual content, or @interactive for interactive content.`
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      
      setTimeout(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="h-12 border-b border-[#333] flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span>Back to Spaces</span>
          </Link>
        </div>
        <div className="text-xl font-mono">&lt;prax/&gt;</div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 p-1 hover:bg-[#333] rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
          <button className="w-8 h-8 p-1 hover:bg-[#333] rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button className="w-8 h-8 p-1 hover:bg-[#333] rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
          <button className="w-8 h-8 p-1 hover:bg-[#333] rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
            <span className="text-sm">U</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 bg-[#0D1117] relative overflow-hidden">
            <textarea
              value={codeContent}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-[#0D1117] text-[#E6EDF3] border-none focus:outline-none resize-none"
              spellCheck="false"
              placeholder="Write your code here..."
            />
          </div>
          
          {/* Bottom toolbar removed as requested */}
          
        </div>
        
        <div className="w-96 bg-[#161B22] border-l border-[#30363D] flex flex-col">
          <div className="p-3 border-b border-[#30363D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 text-white text-xs font-medium px-3 py-0.5 rounded-full">@Code</span>
              <span className="text-[#E6EDF3]">solve</span>
            </div>
            <button className="p-1 rounded hover:bg-[#30363D] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="8" y1="12" x2="16" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="8"></line>
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className="flex gap-3">
                <div className={`w-8 h-8 ${message.type === 'ai' ? 'bg-orange-500' : 'bg-gray-700'} rounded-md flex items-center justify-center text-white font-mono text-xs`}>
                  {message.type === 'ai' ? '</>' : 'u'}
                </div>
                <div className="flex-1">
                  <div className="text-gray-400 text-sm mb-1">{message.type === 'ai' ? 'AI' : 'You'}</div>
                  <div className="text-[#E6EDF3]">
                    <p>{message.content}</p>
                    
                    {message.type === 'ai' && message.command === '@code' && message.code && (
                      <div className="mt-3">
                        <div className="mt-2 bg-[#0D1117] p-2 rounded-md max-h-64 overflow-y-auto">
                          <pre className="text-xs text-gray-300 whitespace-pre-wrap">{message.code}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-3 border-t border-[#30363D]">
            <form onSubmit={handleMessageSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                {/* Removed speaker button as requested */}
                <input 
                  type="text" 
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Try @code..." 
                  className="flex-1 bg-[#0D1117] text-[#E6EDF3] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button 
                  type="submit" 
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={!currentMessage.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Use @code to analyze your code, @video for video content, @visual for visual content, or @interactive for interactive content
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;
