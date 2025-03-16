
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Plus, FileText, ImageIcon, Loader2, Video, PenLine, Calculator, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CommandOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  command: string;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  onCommandSelect?: (command: string, message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing, onCommandSelect }) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [commandStartIndex, setCommandStartIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<{ top: number; left: number } | null>(null);

  const commandOptions: CommandOption[] = [
    {
      id: 'video',
      label: '@video',
      description: 'Insert a video preview',
      icon: <Video size={16} />,
      command: '@video'
    },
    {
      id: 'visual',
      label: '@visual',
      description: 'Create a visual canvas',
      icon: <PenLine size={16} />,
      command: '@visual'
    },
    {
      id: 'interactive',
      label: '@interactive',
      description: 'Open an interactive solver',
      icon: <Calculator size={16} />,
      command: '@interactive'
    },
    {
      id: 'codevisual',
      label: '@codevisual',
      description: 'Visualize code with p5.js',
      icon: <Code size={16} />,
      command: '@codevisual'
    }
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  useEffect(() => {
    // Check for @ symbol in message
    const lastAtIndex = message.lastIndexOf('@');
    
    if (lastAtIndex >= 0 && lastAtIndex >= message.lastIndexOf(' ')) {
      setCommandStartIndex(lastAtIndex);
      setShowCommands(true);
      
      // Calculate cursor position for popover
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const textBeforeCursor = message.slice(0, lastAtIndex);
        
        // Create a temporary element to measure text
        const temp = document.createElement('div');
        temp.style.position = 'absolute';
        temp.style.visibility = 'hidden';
        temp.style.whiteSpace = 'pre-wrap';
        temp.style.width = `${textarea.clientWidth}px`;
        temp.style.font = window.getComputedStyle(textarea).font;
        temp.innerText = textBeforeCursor;
        
        document.body.appendChild(temp);
        
        // Find the position of the last @ symbol
        const lines = textBeforeCursor.split('\n');
        const lastLine = lines[lines.length - 1];
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
        
        // Calculate position
        const rect = textarea.getBoundingClientRect();
        setCursorPosition({
          top: rect.top + (lines.length - 1) * lineHeight,
          left: rect.left + lastLine.length * 7 // Approximate character width
        });
        
        document.body.removeChild(temp);
      }
    } else {
      setShowCommands(false);
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      
      // Check if there's a command in the message
      const videoMatch = message.match(/@video\s+(.*?)(?:\s|$)/);
      const visualMatch = message.match(/@visual\s+(.*?)(?:\s|$)/);
      const interactiveMatch = message.match(/@interactive\s+(.*?)(?:\s|$)/);
      const codeVisualMatch = message.match(/@codevisual\s+(.*?)(?:\s|$)/);
      
      if ((videoMatch || visualMatch || interactiveMatch || codeVisualMatch) && onCommandSelect) {
        if (videoMatch) {
          onCommandSelect('video', videoMatch[1] || '');
        } else if (visualMatch) {
          onCommandSelect('visual', visualMatch[1] || '');
        } else if (interactiveMatch) {
          onCommandSelect('interactive', interactiveMatch[1] || '');
        } else if (codeVisualMatch) {
          onCommandSelect('codevisual', codeVisualMatch[1] || '');
        }
      }
      
      onSendMessage(message);
      setMessage('');
      setIsExpanded(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleCommandSelect = (command: string) => {
    if (commandStartIndex >= 0) {
      const newMessage = message.substring(0, commandStartIndex) + command + ' ';
      setMessage(newMessage);
      setShowCommands(false);
      
      // Focus back on textarea and set cursor at the end
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = newMessage.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }
  };

  return (
    <div className="border-t border-border pb-6 pt-2 px-6 lg:px-10 backdrop-blur-sm bg-background/50">
      <form 
        onSubmit={handleSubmit} 
        className={cn(
          "mx-auto max-w-3xl relative rounded-xl border border-border glass-card transition-all duration-200",
          isExpanded ? "p-4" : "p-1"
        )}
      >
        {isExpanded && (
          <div className="flex gap-2 mb-2 pb-2 border-b border-border">
            <button type="button" className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/40 transition-colors">
              <FileText size={16} />
            </button>
            <button type="button" className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/40 transition-colors">
              <ImageIcon size={16} />
            </button>
            <button 
              type="button" 
              className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/40 transition-colors"
              onClick={() => handleCommandSelect('@video ')}
            >
              <Video size={16} />
            </button>
            <button 
              type="button" 
              className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/40 transition-colors"
              onClick={() => handleCommandSelect('@visual ')}
            >
              <PenLine size={16} />
            </button>
            <button 
              type="button" 
              className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/40 transition-colors"
              onClick={() => handleCommandSelect('@interactive ')}
            >
              <Calculator size={16} />
            </button>
            <button 
              type="button" 
              className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/40 transition-colors"
              onClick={() => handleCommandSelect('@codevisual ')}
            >
              <Code size={16} />
            </button>
          </div>
        )}
        
        <div className="flex items-end">
          <button 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/40 transition-colors"
          >
            <Plus size={20} />
          </button>
          
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Ask anything... (Try @video, @visual, @interactive, or @codevisual)"
              rows={1}
              className="flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none py-3 px-2 text-foreground placeholder:text-muted-foreground w-full"
              style={{ maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {showCommands && cursorPosition && (
              <div 
                className="absolute z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                style={{ 
                  top: `${Math.max(0, -130)}px`, 
                  left: `${Math.max(0, 30)}px`,
                  width: '220px'
                }}
              >
                <div className="p-1">
                  {commandOptions.map(option => (
                    <div
                      key={option.id}
                      className="flex items-center gap-2 p-2 hover:bg-muted/60 rounded cursor-pointer"
                      onClick={() => handleCommandSelect(option.command)}
                    >
                      <div className="text-primary">{option.icon}</div>
                      <div>
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isProcessing}
            className={cn(
              "p-2 rounded-md transition-colors",
              message.trim() && !isProcessing 
                ? "text-primary hover:bg-muted/40" 
                : "text-muted-foreground"
            )}
          >
            {isProcessing ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <SendHorizontal size={20} />
            )}
          </button>
        </div>
      </form>
      
      <div className="text-xs text-muted-foreground text-center mt-3">
        Type @ to access special commands: @video, @visual, @interactive, @codevisual
      </div>
    </div>
  );
};

export default ChatInput;
