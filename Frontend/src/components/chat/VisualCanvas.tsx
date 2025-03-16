
import React, { useRef, useEffect, useState } from 'react';
import { Loader2, Save, RefreshCw, Maximize2, X } from 'lucide-react';

interface VisualCanvasProps {
  prompt?: string;
  onClose: () => void;
}

const VisualCanvas: React.FC<VisualCanvasProps> = ({ prompt, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      initCanvas();
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set a gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw some example shapes based on the prompt
    ctx.fillStyle = '#ff7e33';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 100, canvas.height / 2);
    ctx.lineTo(canvas.width / 2 + 100, canvas.height / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2 - 100);
    ctx.lineTo(canvas.width / 2, canvas.height / 2 + 100);
    ctx.stroke();
    
    // Add some text with the prompt
    ctx.font = '14px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(prompt || 'Visual Representation', canvas.width / 2, canvas.height - 20);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;
    
    setPosition({
      x: position.x + deltaX,
      y: position.y + deltaY
    });
    
    setLastPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsPanning(false);
  };
  
  const handleReset = () => {
    setPosition({ x: 0, y: 0 });
    initCanvas();
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border bg-card/50 animate-fade-in my-4">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button 
          onClick={handleReset}
          className="p-1 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
        >
          <RefreshCw size={16} />
        </button>
        <button 
          onClick={onClose}
          className="p-1 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-white">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="text-sm">Generating visual from prompt...</p>
          <p className="text-xs text-muted-foreground mt-2">"{prompt || 'Visual canvas'}"</p>
        </div>
      ) : (
        <div 
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={300}
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px)` 
            }}
            className="w-full"
          />
        </div>
      )}
      
      <div className="bg-black/20 backdrop-blur-sm p-2 absolute bottom-0 left-0 right-0 flex justify-between items-center">
        <span className="text-xs text-white/70">
          {prompt || 'Visual canvas'}
        </span>
        <button className="p-1 bg-primary/30 hover:bg-primary/50 text-white rounded-md text-xs transition-colors px-2 flex items-center gap-1">
          <Save size={12} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default VisualCanvas;
