
import React, { useRef, useEffect, useState } from 'react';
import { Loader2, RefreshCw, Code, X } from 'lucide-react';

interface CodeVisualizerProps {
  code?: string;
  prompt?: string;
  onClose: () => void;
}

const CodeVisualizer: React.FC<CodeVisualizerProps> = ({ code, prompt, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Create a timeout to simulate loading
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(loadingTimeout);
  }, []);
  
  useEffect(() => {
    if (!isLoading && iframeRef.current && code) {
      try {
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!doc) return;
        
        // Create the HTML content with p5.js
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
              <style>
                body { margin: 0; overflow: hidden; }
                canvas { display: block; }
              </style>
            </head>
            <body>
              <script>
                ${code}
              </script>
            </body>
          </html>
        `;
        
        doc.open();
        doc.write(html);
        doc.close();
      } catch (err) {
        console.error('Error rendering p5.js code:', err);
        setError('Failed to render visualization. Check the code for errors.');
      }
    }
  }, [isLoading, code]);
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border bg-card/50 animate-fade-in my-4">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button 
          onClick={handleRefresh}
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
        <div className="flex flex-col items-center justify-center h-64 text-white bg-gray-800">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="text-sm">Rendering code visualization...</p>
          <p className="text-xs text-muted-foreground mt-2">"{prompt || 'p5.js visualization'}"</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 text-white bg-gray-800">
          <p className="text-red-400 mb-2">{error}</p>
          <div className="bg-gray-900 p-3 rounded-md max-w-full overflow-auto">
            <pre className="text-xs text-gray-300">{code}</pre>
          </div>
        </div>
      ) : (
        <div className="h-64 bg-white">
          <iframe 
            ref={iframeRef}
            className="w-full h-full border-none"
            title="Code Visualization"
            sandbox="allow-scripts"
          />
        </div>
      )}
      
      <div className="bg-black/20 backdrop-blur-sm p-2 absolute bottom-0 left-0 right-0 flex justify-between items-center">
        <span className="text-xs text-white/70">
          {prompt || 'p5.js visualization'}
        </span>
        <button className="p-1 bg-primary/30 hover:bg-primary/50 text-white rounded-md text-xs transition-colors px-2 flex items-center gap-1">
          <Code size={12} />
          <span>View Code</span>
        </button>
      </div>
    </div>
  );
};

export default CodeVisualizer;
