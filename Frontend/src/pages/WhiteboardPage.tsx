import React, { useState, useRef } from 'react';
import { ArrowLeft, Code, MessageSquare, Undo, Redo, Trash, Mouse, PenLine, Square, Circle, Type, ChevronDown, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import DrawingCanvas from '@/components/whiteboard/DrawingCanvas';
import Navigation from '@/components/navigation/Navigation';
import { toast } from 'sonner';

interface Message {
  type: 'user' | 'ai';
  content: string;
  command?: string;
  imageData?: string;
  code?: string;
}

const WhiteboardPage = () => {
  const [activeTool, setActiveTool] = useState<'select' | 'hand' | 'pen' | 'square' | 'circle' | 'text'>('select');
  const [activeColor, setActiveColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [canvasDataUrl, setCanvasDataUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {type: 'ai', content: 'Hi! I can help you with your whiteboard session. Try drawing something and asking me about it with @whiteboard.'}
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const colors = [
    ['#000000', '#6E6E6E', '#B980FF', '#9C27B0'],
    ['#2962FF', '#2196F3', '#FF9800', '#FF5722'],
    ['#4CAF50', '#8BC34A', '#FF8A80', '#F44336']
  ];
  
  const sizes = [
    { id: 'S', value: 2 },
    { id: 'M', value: 4 },
    { id: 'L', value: 6 },
    { id: 'XL', value: 8 }
  ];

  const handleCanvasChange = (dataUrl: string) => {
    setCanvasDataUrl(dataUrl);
  };
  
  const sendData = async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`http://localhost:8081/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    const userMessage: Message = {
      type: 'user',
      content: currentMessage,
      command: currentMessage.includes('@whiteboard') ? '@whiteboard' : 
               currentMessage.includes('@codevisual') ? '@codevisual' :
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
      
      if (userMessage.command === '@whiteboard') {
        if (canvasDataUrl) {
          // Create data to send to backend
          const whiteboardData = {
            image: canvasDataUrl,
            query: currentMessage.replace('@whiteboard', '').trim()
          };
          
          sendData('whiteboard', whiteboardData);
          toast.success('Whiteboard data sent');
        } else {
          aiResponse = {
            type: 'ai',
            content: 'I don\'t see anything on your whiteboard yet. Try drawing something first!'
          };
        }
      } else if (userMessage.command === '@codevisual') {
        const sampleCode = `
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
  for (let k = 0; k <arr.length; k++) {
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
 }`;

        aiResponse = {
          type: 'ai',
          content: `Here's a visualization of a bubble sort algorithm based on your prompt: "${currentMessage.replace('@codevisual', '').trim()}"`,
          command: '@codevisual',
          code: sampleCode
        };
        toast.success('Code visualization request processed');
      } else if (userMessage.command === '@video') {
        // Handle video command
        const videoData = {
          query: currentMessage.replace('@video', '').trim()
        };
        
        sendData('video', videoData);
        toast.success('Video request processed');
      } else if (userMessage.command === '@visual') {
        // Handle visual command
        const visualData = {
          query: currentMessage.replace('@visual', '').trim()
        };
        
        sendData('visual', visualData);
        toast.success('Visual request processed');
      } else if (userMessage.command === '@interactive') {
        // Handle interactive command
        const interactiveData = {
          query: currentMessage.replace('@interactive', '').trim()
        };
        
        sendData('interactive', interactiveData);
        toast.success('Interactive request processed');
      } else {
        aiResponse = {
          type: 'ai',
          content: `I received your message: "${currentMessage}". Try using @whiteboard to analyze your drawing, @codevisual to visualize code, @video for video content, @visual for visual content, or @interactive for interactive content.`
        };
      }

      if (aiResponse) {
        setMessages(prev => [...prev, aiResponse]);
      }
      
      setTimeout(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 500);
  };
  
  const handleClearCanvas = () => {
    setCanvasDataUrl(null);
    toast.info('Canvas cleared');
  };

  return (
    <div className="flex flex-col h-screen bg-[#1A1A1A] text-white">
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

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 bg-white relative overflow-hidden">
            {showColorPicker && (
              <div className="absolute top-5 left-5 z-10 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="p-3">
                  <button 
                    className="text-gray-400 hover:text-gray-600 mb-2"
                    onClick={() => setShowColorPicker(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  
                  <div className="grid gap-2">
                    {colors.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-2">
                        {row.map((color) => (
                          <button
                            key={color}
                            className={cn(
                              "w-6 h-6 rounded-full",
                              activeColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setActiveColor(color);
                              setShowColorPicker(false);
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center">
                      <div className="h-1 flex-1 bg-blue-500 rounded-full"></div>
                      <div className="w-5 h-5 rounded-full bg-white border-2 border-blue-500 ml-1"></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        className={cn(
                          "px-3 py-1 rounded text-sm",
                          strokeWidth === size.value ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                        onClick={() => {
                          setStrokeWidth(size.value);
                          setShowSizeOptions(false);
                        }}
                      >
                        {size.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DrawingCanvas 
              activeTool={activeTool} 
              activeColor={activeColor} 
              strokeWidth={strokeWidth}
              onCanvasChange={handleCanvasChange}
            />
          </div>
          
          <div className="h-16 bg-[#1A1A1A] border-t border-[#333] flex items-center px-4 gap-2">
            <div className="flex bg-[#222] rounded-md overflow-hidden">
              <button 
                className="p-2 hover:bg-[#333] transition-colors"
                onClick={() => toast.info("Undo not implemented")}
              >
                <Undo size={18} className="text-gray-400" />
              </button>
              <button 
                className="p-2 hover:bg-[#333] transition-colors"
                onClick={() => toast.info("Redo not implemented")}
              >
                <Redo size={18} className="text-gray-400" />
              </button>
              <button 
                className="p-2 hover:bg-[#333] transition-colors"
                onClick={handleClearCanvas}
              >
                <Trash size={18} className="text-gray-400" />
              </button>
              <button 
                className="p-2 hover:bg-[#333] transition-colors"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: activeColor }}></div>
              </button>
            </div>

            <div className="h-8 w-px bg-[#333]"></div>
            
            <div className="flex bg-[#222] rounded-md overflow-hidden">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={cn("p-2 transition-colors", 
                        activeTool === 'select' ? "bg-[#333]" : "hover:bg-[#333]")}
                      onClick={() => setActiveTool('select')}
                    >
                      <Mouse size={18} className={cn(activeTool === 'select' ? "text-white" : "text-gray-400")} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select (V)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={cn("p-2 transition-colors", 
                        activeTool === 'hand' ? "bg-[#333]" : "hover:bg-[#333]")}
                      onClick={() => setActiveTool('hand')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(activeTool === 'hand' ? "text-white" : "text-gray-400")}>
                        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hand (H)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={cn("p-2 transition-colors", 
                        activeTool === 'pen' ? "bg-[#333]" : "hover:bg-[#333]")}
                      onClick={() => setActiveTool('pen')}
                    >
                      <PenLine size={18} className={cn(activeTool === 'pen' ? "text-white" : "text-gray-400")} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pen (P)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={cn("p-2 transition-colors", 
                        activeTool === 'square' ? "bg-[#333]" : "hover:bg-[#333]")}
                      onClick={() => setActiveTool('square')}
                    >
                      <Square size={18} className={cn(activeTool === 'square' ? "text-white" : "text-gray-400")} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Rectangle (R)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={cn("p-2 transition-colors", 
                        activeTool === 'circle' ? "bg-[#333]" : "hover:bg-[#333]")}
                      onClick={() => setActiveTool('circle')}
                    >
                      <Circle size={18} className={cn(activeTool === 'circle' ? "text-white" : "text-gray-400")} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ellipse (O)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={cn("p-2 transition-colors", 
                        activeTool === 'text' ? "bg-[#333]" : "hover:bg-[#333]")}
                      onClick={() => setActiveTool('text')}
                    >
                      <Type size={18} className={cn(activeTool === 'text' ? "text-white" : "text-gray-400")} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Text (T)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex items-center">
                <span className="text-xs text-gray-400 px-2">100%</span>
                <ChevronDown size={14} className="text-gray-400 mr-1" />
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-2">
              <div className="text-gray-400 text-sm flex gap-1 items-center">
                <span>Python</span>
                <ChevronDown size={14} />
              </div>
              <Button className="bg-[#00B341] hover:bg-[#00A33B] text-white rounded px-4 py-2 text-sm h-8 flex items-center gap-1">
                <Play size={14} />
                Run
              </Button>
            </div>
          </div>
        </div>
        
        <div className="w-96 bg-[#222] border-l border-[#333] flex flex-col">
          <div className="p-3 border-b border-[#333] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-teal-500 text-white text-xs font-medium px-3 py-0.5 rounded-full">@Whiteboard</span>
              <span className="text-white">solve</span>
            </div>
            <button className="p-1 rounded hover:bg-[#333] transition-colors">
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
                  <div className="text-white">
                    <p>{message.content}</p>
                    
                    {message.type === 'ai' && message.command === '@whiteboard' && message.imageData && (
                      <div className="mt-3 border border-gray-600 rounded-md overflow-hidden">
                        <img src={message.imageData} alt="Whiteboard drawing" className="max-w-full" />
                      </div>
                    )}
                    
                    {message.type === 'ai' && message.command === '@codevisual' && message.code && (
                      <div className="mt-3">
                        <div className="border border-gray-600 rounded-md overflow-hidden">
                          <iframe 
                            srcDoc={`
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  <meta charset="utf-8">
                                  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
                                  <style>
                                    body { margin: 0; overflow: hidden; background: #f0f0f0; }
                                    canvas { display: block; }
                                  </style>
                                </head>
                                <body>
                                  <script>
                                    ${message.code}
                                  </script>
                                </body>
                              </html>
                            `}
                            className="w-full h-64 border-none"
                            title="Code Visualization"
                            sandbox="allow-scripts"
                          />
                        </div>
                        <div className="mt-2 bg-gray-800 p-2 rounded-md max-h-32 overflow-y-auto">
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
          
          <div className="p-3 border-t border-[#333]">
            <form onSubmit={handleMessageSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <button 
                  type="button"
                  className="w-8 h-8 bg-[#333] rounded-full flex items-center justify-center text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </button>
                <input 
                  type="text" 
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Try @whiteboard or @codevisual..." 
                  className="flex-1 bg-[#333] text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
                Use @whiteboard to analyze your drawing, @codevisual to visualize code, @video for video content, @visual for visual content, or @interactive for interactive content
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPage;
