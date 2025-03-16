
import React, { useState, useEffect } from 'react';
import { Loader2, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface InteractiveSolverProps {
  prompt?: string;
  onClose: () => void;
}

const InteractiveSolver: React.FC<InteractiveSolverProps> = ({ prompt, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  
  // Simulate loading and progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.05;
        return newProgress > 99 ? 100 : newProgress;
      });
    }, 200);
    
    const timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsLoading(false);
      generateSampleResult();
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);
  
  const generateSampleResult = () => {
    // Example: If prompt mentions quadratic formula
    if (prompt?.toLowerCase().includes('quadratic')) {
      setResult(`
        <h3>Quadratic Formula Solution</h3>
        <p>For a quadratic equation ax² + bx + c = 0, where a ≠ 0, the solutions are:</p>
        <div class="formula">x = (-b ± √(b² - 4ac)) / 2a</div>
        <p>Given the values:</p>
        <ul>
          <li>a = 1</li>
          <li>b = -3</li>
          <li>c = 2</li>
        </ul>
        <p>Solutions:</p>
        <div class="answer">x₁ = 2, x₂ = 1</div>
      `);
    } 
    // Example: If prompt mentions derivative
    else if (prompt?.toLowerCase().includes('derivative')) {
      setResult(`
        <h3>Derivative Calculation</h3>
        <p>For the function f(x) = x²</p>
        <p>The derivative is:</p>
        <div class="formula">f'(x) = 2x</div>
        <div class="graph">
          <svg width="100%" height="100" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q50,0 100,50" stroke="#ff7e33" fill="none" stroke-width="2"/>
            <path d="M0,100 L100,0" stroke="#ffffff" fill="none" stroke-width="2" stroke-dasharray="4"/>
          </svg>
        </div>
      `);
    } 
    // Default response
    else {
      setResult(`
        <h3>Interactive Result</h3>
        <p>Analysis of prompt: "${prompt || 'No specific prompt provided'}"</p>
        <div class="result">
          <p>Here's an interactive solution to your query.</p>
          <ul>
            <li>Step 1: Define the problem</li>
            <li>Step 2: Apply relevant formulas</li>
            <li>Step 3: Calculate the result</li>
          </ul>
        </div>
      `);
    }
  };
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div className={`relative rounded-lg overflow-hidden border border-border bg-card/80 backdrop-blur-sm animate-fade-in my-4 ${fullscreen ? 'fixed inset-0 z-50' : 'w-full'}`}>
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button 
          onClick={toggleFullscreen}
          className="p-1 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
        >
          <Maximize2 size={16} />
        </button>
        <button 
          onClick={onClose}
          className="p-1 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className={`${fullscreen ? 'h-screen p-16' : 'h-[400px] p-6'}`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="text-base font-medium mb-4">Solving interactively...</p>
            <div className="w-full max-w-md mb-2">
              <Progress value={progress} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground">Processing: {Math.round(progress)}%</p>
            <p className="text-xs text-muted-foreground mt-2 max-w-md text-center">
              "{prompt || 'Analyzing problem'}"
            </p>
          </div>
        ) : (
          <div className="h-full overflow-auto p-4 scrollbar-thin">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: result || '' }}
            />
            <style>
              {`
              .formula {
                background: rgba(0, 0, 0, 0.2);
                padding: 12px;
                border-radius: 8px;
                margin: 16px 0;
                font-family: monospace;
                font-size: 1.2em;
                text-align: center;
              }
              .answer {
                color: #ff7e33;
                font-weight: bold;
                font-size: 1.2em;
                margin: 16px 0;
              }
              .graph {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 16px;
                margin: 16px 0;
              }
              `}
            </style>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveSolver;
