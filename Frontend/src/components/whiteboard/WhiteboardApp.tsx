import React, { useState, useRef, useEffect } from 'react';
import DrawingCanvas from './DrawingCanvas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  Hand, 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Undo2, 
  Redo2, 
  Trash2, 
  Save, 
  MousePointer 
} from 'lucide-react';

interface CanvasActions {
  clearCanvas: () => void;
  undoCanvasDrawing: () => void;
  redoCanvasDrawing: () => void;
  saveCanvasDrawing: (query: string) => boolean;
}

const WhiteboardApp: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'select' | 'hand' | 'pen' | 'square' | 'circle' | 'text'>('pen');
  const [activeColor, setActiveColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [canvasData, setCanvasData] = useState<string>('');
  const [userQuery, setUserQuery] = useState<string>('');
  const [shapes, setShapes] = useState<any[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Reference to DrawingCanvas functions
  const drawingCanvasActionsRef = useRef<CanvasActions>({
    clearCanvas: () => {},
    undoCanvasDrawing: () => {},
    redoCanvasDrawing: () => {},
    saveCanvasDrawing: (query: string) => true as boolean
  });
  
  const handleToolChange = (tool: 'select' | 'hand' | 'pen' | 'square' | 'circle' | 'text') => {
    setActiveTool(tool);
  };
  
  const handleColorChange = (color: string) => {
    setActiveColor(color);
  };
  
  const handleStrokeWidthChange = (width: number[]) => {
    setStrokeWidth(width[0]);
  };
  
  const handleCanvasChange = (dataUrl: string, newShapes?: any[]) => {
    setCanvasData(dataUrl);
    if (newShapes) {
      setShapes(newShapes);
    }
  };
  
  const handleClearCanvas = () => {
    drawingCanvasActionsRef.current.clearCanvas();
  };
  
  const handleUndo = () => {
    drawingCanvasActionsRef.current.undoCanvasDrawing();
  };
  
  const handleRedo = () => {
    drawingCanvasActionsRef.current.redoCanvasDrawing();
  };
  
  const handleSave = () => {
    const success = drawingCanvasActionsRef.current.saveCanvasDrawing(userQuery);
    if (success) {
      console.log("Canvas saved successfully!");
    }
  };
  
  // Function to receive action references from DrawingCanvas
  const registerCanvasActions = (actions: CanvasActions) => {
    drawingCanvasActionsRef.current = actions;
  };
  
  // Colors for the color palette
  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#008000', // Dark Green
    '#800000', // Maroon
    '#008080', // Teal
  ];
  
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Tools */}
      <div className="w-16 p-2 bg-muted flex flex-col items-center space-y-4">
        <Button
          variant={activeTool === 'select' ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolChange('select')}
          title="Select Tool"
        >
          <MousePointer className="h-5 w-5" />
        </Button>
        
        <Button
          variant={activeTool === 'hand' ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolChange('hand')}
          title="Hand Tool (Pan)"
        >
          <Hand className="h-5 w-5" />
        </Button>
        
        <Button
          variant={activeTool === 'pen' ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolChange('pen')}
          title="Pen Tool"
        >
          <Pencil className="h-5 w-5" />
        </Button>
        
        <Button
          variant={activeTool === 'square' ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolChange('square')}
          title="Rectangle Tool"
        >
          <Square className="h-5 w-5" />
        </Button>
        
        <Button
          variant={activeTool === 'circle' ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolChange('circle')}
          title="Circle Tool"
        >
          <Circle className="h-5 w-5" />
        </Button>
        
        <Button
          variant={activeTool === 'text' ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolChange('text')}
          title="Text Tool"
        >
          <Type className="h-5 w-5" />
        </Button>
        
        <Separator className="my-2" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          title="Undo"
        >
          <Undo2 className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRedo}
          title="Redo"
        >
          <Redo2 className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearCanvas}
          title="Clear Canvas"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          title="Save Drawing"
        >
          <Save className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Right Sidebar - Properties */}
      <div className="w-64 p-4 bg-muted flex flex-col space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Stroke Width</h3>
          <Slider
            value={[strokeWidth]}
            min={1}
            max={20}
            step={1}
            onValueChange={handleStrokeWidthChange}
            className="mb-4"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Color</h3>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full cursor-pointer ${activeColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <h3 className="text-sm font-medium mb-2">Save Drawing</h3>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter a description..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            />
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
      
      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <DrawingCanvas
          activeTool={activeTool}
          activeColor={activeColor}
          strokeWidth={strokeWidth}
          onCanvasChange={handleCanvasChange}
          canvasRef={canvasRef}
          registerActions={registerCanvasActions}
        />
      </div>
    </div>
  );
};

export default WhiteboardApp;