
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Bot, User } from 'lucide-react';
import VideoPreview from './VideoPreview';
import VisualCanvas from './VisualCanvas';
import InteractiveSolver from './InteractiveSolver';
import CodeVisualizer from './CodeVisualizer';

export type MessageType = 'user' | 'assistant' | 'system';

interface MessageBubbleProps {
  type: MessageType;
  content: string;
  isLoading?: boolean;
  videoCommand?: { isActive: boolean; prompt: string };
  visualCommand?: { isActive: boolean; prompt: string };
  interactiveCommand?: { isActive: boolean; prompt: string };
  codeVisualCommand?: { isActive: boolean; prompt: string; code?: string };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  type, 
  content, 
  isLoading = false,
  videoCommand,
  visualCommand,
  interactiveCommand,
  codeVisualCommand
}) => {
  const [showVideo, setShowVideo] = useState(videoCommand?.isActive || false);
  const [showVisual, setShowVisual] = useState(visualCommand?.isActive || false);
  const [showInteractive, setShowInteractive] = useState(interactiveCommand?.isActive || false);
  const [showCodeVisual, setShowCodeVisual] = useState(codeVisualCommand?.isActive || false);
  
  // Process content for command highlighting
  const processedContent = content
    .replace(/@video\s+([^\s]+)/g, '<span class="text-primary font-semibold">@video</span> $1')
    .replace(/@visual\s+([^\s]+)/g, '<span class="text-primary font-semibold">@visual</span> $1')
    .replace(/@interactive\s+([^\s]+)/g, '<span class="text-primary font-semibold">@interactive</span> $1')
    .replace(/@codevisual\s+([^\s]+)/g, '<span class="text-primary font-semibold">@codevisual</span> $1')
    .replace(/@whiteboard\s+([^\s]+)/g, '<span class="text-primary font-semibold">@whiteboard</span> $1');

  return (
    <div 
      className={cn(
        "flex w-full items-start gap-4 py-4 animate-fade-in",
        type === 'assistant' && "bg-muted/5"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border",
        type === 'user' 
          ? "bg-accent text-accent-foreground border-accent/30" 
          : "bg-muted/50 text-foreground border-border"
      )}>
        {type === 'user' ? (
          <User size={16} />
        ) : (
          <Bot size={16} />
        )}
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden pt-1">
        <div className="prose prose-invert max-w-none">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 size={16} className="animate-spin mr-2" />
              <span className="text-muted-foreground">Thinking...</span>
            </div>
          ) : (
            <>
              <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              
              {/* Video Preview */}
              {(showVideo || videoCommand?.isActive) && (
                <VideoPreview 
                  videoId={videoCommand?.prompt} 
                  onClose={() => setShowVideo(false)} 
                />
              )}
              
              {/* Visual Canvas */}
              {(showVisual || visualCommand?.isActive) && (
                <VisualCanvas 
                  prompt={visualCommand?.prompt} 
                  onClose={() => setShowVisual(false)} 
                />
              )}
              
              {/* Interactive Solver */}
              {(showInteractive || interactiveCommand?.isActive) && (
                <InteractiveSolver 
                  prompt={interactiveCommand?.prompt} 
                  onClose={() => setShowInteractive(false)} 
                />
              )}
              
              {/* Code Visualizer */}
              {(showCodeVisual || codeVisualCommand?.isActive) && (
                <CodeVisualizer
                  prompt={codeVisualCommand?.prompt}
                  code={codeVisualCommand?.code}
                  onClose={() => setShowCodeVisual(false)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
