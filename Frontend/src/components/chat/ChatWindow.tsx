
import React, { useRef, useEffect } from 'react';
import MessageBubble, { MessageType } from './MessageBubble';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  videoCommand?: { isActive: boolean; prompt: string };
  visualCommand?: { isActive: boolean; prompt: string };
  interactiveCommand?: { isActive: boolean; prompt: string };
  codeVisualCommand?: { isActive: boolean; prompt: string; code?: string };
}

interface ChatWindowProps {
  messages: Message[];
  isProcessing: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages,
  isProcessing
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto" id="chat-window">
      <div className="max-w-3xl mx-auto">
        <div className="pb-[120px] pt-4 px-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              type={message.type}
              content={message.content}
              videoCommand={message.videoCommand}
              visualCommand={message.visualCommand}
              interactiveCommand={message.interactiveCommand}
              codeVisualCommand={message.codeVisualCommand}
            />
          ))}
          
          {isProcessing && (
            <MessageBubble
              type="assistant"
              content=""
              isLoading={true}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
