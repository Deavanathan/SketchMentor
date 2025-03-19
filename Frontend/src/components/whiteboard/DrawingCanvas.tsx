import React, { useRef, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface Point {
  x: number;
  y: number;
}

interface DrawingCanvasProps {
  activeTool: 'select' | 'hand' | 'pen' | 'square' | 'circle' | 'text';
  activeColor: string;
  strokeWidth: number;
  onCanvasChange?: (dataUrl: string, shapes?: any[]) => void;
  onClear?: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  registerActions?: (actions: {
    clearCanvas: () => void,
    undoCanvasDrawing: () => void,
    redoCanvasDrawing: () => void,
    saveCanvasDrawing: (query: string) => boolean
  }) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  activeTool, 
  activeColor, 
  strokeWidth,
  onCanvasChange,
  onClear,
  canvasRef: externalCanvasRef,
  registerActions
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [shapes, setShapes] = useState<any[]>([]);
  const [undoStack, setUndoStack] = useState<any[][]>([]);
  const [redoStack, setRedoStack] = useState<any[][]>([]);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [viewportOffset, setViewportOffset] = useState<Point>({ x: 0, y: 0 });
  const [editingText, setEditingText] = useState<{ index: number; text: string } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match parent container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redrawCanvas();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Effect to notify parent of canvas changes
  useEffect(() => {
    if (onCanvasChange && canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL();
        onCanvasChange(dataUrl, shapes);
      } catch (error) {
        console.error("Error converting canvas to data URL:", error);
      }
    }
  }, [shapes, onCanvasChange]);
  
  // Handle clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save to undo stack first if there are shapes to clear
    if (shapes.length > 0) {
      setUndoStack(prevStack => [...prevStack, [...shapes]]);
      
      // Clear visual and data
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setShapes([]);
      
      // Clear redo stack
      setRedoStack([]);
      
      // Notify parent component if callback exists
      if (onClear) {
        onClear();
      }
    }
  }, [shapes, onClear]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      // Get the last state from the undo stack
      const newUndoStack = [...undoStack];
      const lastState = newUndoStack.pop() || [];
      
      // Save current state to redo stack
      setRedoStack(prevRedoStack => [...prevRedoStack, [...shapes]]);
      
      // Update the undo stack
      setUndoStack(newUndoStack);
      
      // Set shapes to the last state
      setShapes(lastState);
    }
  }, [shapes, undoStack]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      // Get the last state from redo stack
      const newRedoStack = [...redoStack];
      const nextState = newRedoStack.pop() || [];
      
      // Save current state to undo stack
      setUndoStack(prevUndoStack => [...prevUndoStack, [...shapes]]);
      
      // Update the redo stack
      setRedoStack(newRedoStack);
      
      // Set shapes to the next state
      setShapes(nextState);
    }
  }, [shapes, redoStack]);

  // Save canvas drawing
  const saveCanvasDrawing = useCallback((query: string) => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      const canvasData = {
        image: dataUrl,
        shapes: shapes,
        query: query
      };
      
      try {
        // Log data for Postman testing
        console.log('POSTMAN TEST DATA (copy this):');
        console.log(JSON.stringify(canvasData, null, 2));
        
        // Show success message without actually sending
        toast.success('Canvas data logged to console (check DevTools)');
        
        return true;
      } catch (error) {
        console.error('Error saving canvas:', error);
        return false;
      }
    }
    return false;
  }, [shapes]);

  // Register actions with parent component
  useEffect(() => {
    if (registerActions) {
      registerActions({
        clearCanvas,
        undoCanvasDrawing: handleUndo,
        redoCanvasDrawing: handleRedo,
        saveCanvasDrawing
      });
    }
  }, [clearCanvas, handleUndo, handleRedo, saveCanvasDrawing, registerActions]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply viewport offset for panning
    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);
    
    // Redraw all shapes
    shapes.forEach((shape, index) => {
      ctx.lineWidth = shape.strokeWidth;
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.fill || 'transparent';
      
      if (shape.type === 'path') {
        ctx.beginPath();
        shape.points.forEach((point: Point, i: number) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (shape.type === 'rectangle') {
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        if (shape.fill) ctx.fill();
        ctx.stroke();
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x + shape.radius, shape.y + shape.radius, shape.radius, 0, Math.PI * 2);
        if (shape.fill) ctx.fill();
        ctx.stroke();
      } else if (shape.type === 'text') {
        ctx.font = `${shape.fontSize || 16}px Arial`;
        ctx.fillStyle = shape.color;
        ctx.fillText(shape.text, shape.x, shape.y);
      }
      
      // Draw selection handles if shape is selected
      if (index === selectedShape) {
        ctx.strokeStyle = '#0088ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        if (shape.type === 'path') {
          // Calculate bounding box for path
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          shape.points.forEach((point: Point) => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
          });
          
          ctx.beginPath();
          ctx.rect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);
          ctx.stroke();
        } else if (shape.type === 'rectangle') {
          ctx.beginPath();
          ctx.rect(shape.x - 5, shape.y - 5, shape.width + 10, shape.height + 10);
          ctx.stroke();
        } else if (shape.type === 'circle') {
          ctx.beginPath();
          ctx.rect(shape.x - 5, shape.y - 5, shape.radius * 2 + 10, shape.radius * 2 + 10);
          ctx.stroke();
        }
        
        ctx.setLineDash([]);
      }
    });
    
    // Restore canvas state
    ctx.restore();
  }, [shapes, selectedShape, viewportOffset, canvasRef]);

  const getMousePosition = (event: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left - viewportOffset.x,
      y: event.clientY - rect.top - viewportOffset.y
    };
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const position = getMousePosition(event);
    
    if (activeTool === 'select') {
      const index = shapes
        .map((shape, idx) => ({ shape, idx }))
        .reverse()
        .find(({ shape }) => isPointInShape(position, shape))?.idx ?? -1;
      
      setSelectedShape(index >= 0 ? index : null);
      
      // Handle double click for text editing
      if (event.detail === 2 && index >= 0 && shapes[index].type === 'text') {
        setEditingText({ index, text: shapes[index].text });
      } else if (index >= 0) {
        setIsDragging(true);
        setDragStart(position);
      }
    } else if (activeTool === 'hand') {
      setIsDragging(true);
      setDragStart({
        x: event.clientX,
        y: event.clientY
      });
    } else if (activeTool === 'text') {
      // Create a new text shape at click position
      const newText = '';
      const fontSize = strokeWidth * 8;
      const newShapeIndex = shapes.length;
      
      // Save current state to undo stack before adding new shape
      if (shapes.length > 0) {
        setUndoStack(prevStack => [...prevStack, [...shapes]]);
      }
      
      // Add the new text shape
      setShapes([...shapes, {
        type: 'text',
        x: position.x,
        y: position.y,
        text: newText,
        fontSize: fontSize,
        color: activeColor
      }]);
      
      // Clear redo stack since we've made a new action
      setRedoStack([]);
      
      // Immediately start editing the new text
      setTimeout(() => {
        setEditingText({ index: newShapeIndex, text: newText });
      }, 0);
    } else {
      // Handle other tools (pen, square, circle)
      
      // Save current state to undo stack before adding new shape
      if (shapes.length > 0) {
        setUndoStack(prevStack => [...prevStack, [...shapes]]);
      }
      
      // Clear redo stack since we've made a new action
      setRedoStack([]);
      
      if (activeTool === 'pen') {
        setIsDrawing(true);
        setLastPoint(position);
        setShapes([...shapes, {
          type: 'path',
          points: [position],
          color: activeColor,
          strokeWidth
        }]);
      } else if (activeTool === 'square') {
        setIsDrawing(true);
        setLastPoint(position);
        setShapes([...shapes, {
          type: 'rectangle',
          x: position.x,
          y: position.y,
          width: 0,
          height: 0,
          color: activeColor,
          strokeWidth
        }]);
      } else if (activeTool === 'circle') {
        setIsDrawing(true);
        setLastPoint(position);
        setShapes([...shapes, {
          type: 'circle',
          x: position.x,
          y: position.y,
          radius: 0,
          color: activeColor,
          strokeWidth
        }]);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const position = getMousePosition(event);
    
    if (activeTool === 'select' && isDragging && selectedShape !== null && dragStart) {
      // Move the selected shape
      const deltaX = position.x - dragStart.x;
      const deltaY = position.y - dragStart.y;
      
      const updatedShapes = [...shapes];
      const shape = updatedShapes[selectedShape];
      
      if (shape.type === 'path') {
        shape.points = shape.points.map((point: Point) => ({
          x: point.x + deltaX,
          y: point.y + deltaY
        }));
      } else if (shape.type === 'rectangle' || shape.type === 'circle' || shape.type === 'text') {
        shape.x += deltaX;
        shape.y += deltaY;
      }
      
      setShapes(updatedShapes);
      setDragStart(position);
      redrawCanvas();
    } else if (activeTool === 'hand' && isDragging && dragStart) {
      // Implement panning by updating viewport offset
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      
      setViewportOffset({
        x: viewportOffset.x + deltaX,
        y: viewportOffset.y + deltaY
      });
      
      setDragStart({
        x: event.clientX,
        y: event.clientY
      });
      
      redrawCanvas();
    } else if (activeTool === 'pen' && isDrawing) {
      // Continue drawing path
      const updatedShapes = [...shapes];
      const currentPath = updatedShapes[updatedShapes.length - 1];
      
      if (currentPath && currentPath.type === 'path') {
        currentPath.points.push(position);
        setShapes(updatedShapes);
      }
      
      // Draw line from last point to current point
      const canvas = canvasRef.current;
      if (canvas && lastPoint) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.translate(viewportOffset.x, viewportOffset.y);
          
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = activeColor;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          ctx.beginPath();
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(position.x, position.y);
          ctx.stroke();
          
          ctx.restore();
        }
      }
      
      setLastPoint(position);
    } else if (activeTool === 'square' && isDrawing && lastPoint) {
      // Update rectangle dimensions
      const updatedShapes = [...shapes];
      const currentRect = updatedShapes[updatedShapes.length - 1];
      
      if (currentRect && currentRect.type === 'rectangle') {
        const width = Math.abs(position.x - lastPoint.x);
        const height = Math.abs(position.y - lastPoint.y);
        
        currentRect.x = Math.min(lastPoint.x, position.x);
        currentRect.y = Math.min(lastPoint.y, position.y);
        currentRect.width = width;
        currentRect.height = height;
        
        setShapes(updatedShapes);
        redrawCanvas();
      }
    } else if (activeTool === 'circle' && isDrawing && lastPoint) {
      // Update circle radius
      const updatedShapes = [...shapes];
      const currentCircle = updatedShapes[updatedShapes.length - 1];
      
      if (currentCircle && currentCircle.type === 'circle') {
        const dx = position.x - lastPoint.x;
        const dy = position.y - lastPoint.y;
        const radius = Math.sqrt(dx * dx + dy * dy);
        
        currentCircle.radius = radius;
        currentCircle.x = lastPoint.x - radius;
        currentCircle.y = lastPoint.y - radius;
        
        setShapes(updatedShapes);
        redrawCanvas();
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDragging(false);
    setLastPoint(null);
    setDragStart(null);
    redrawCanvas();
  };

  const isPointInShape = (point: Point, shape: any): boolean => {
    if (shape.type === 'rectangle') {
      return (
        point.x >= shape.x &&
        point.x <= shape.x + shape.width &&
        point.y >= shape.y &&
        point.y <= shape.y + shape.height
      );
    } else if (shape.type === 'circle') {
      const dx = point.x - (shape.x + shape.radius);
      const dy = point.y - (shape.y + shape.radius);
      return dx * dx + dy * dy <= shape.radius * shape.radius;
    } else if (shape.type === 'path') {
      // This is a simple but imperfect check for paths
      return shape.points.some((pathPoint: Point) => {
        const dx = pathPoint.x - point.x;
        const dy = pathPoint.y - point.y;
        return Math.sqrt(dx * dx + dy * dy) <= 10; // 10px threshold
      });
    } else if (shape.type === 'text') {
      // Simple bounding box check for text
      const textWidth = shape.text.length * (shape.fontSize / 2); // Estimate text width
      return (
        point.x >= shape.x &&
        point.x <= shape.x + textWidth &&
        point.y >= shape.y - shape.fontSize &&
        point.y <= shape.y
      );
    }
    return false;
  };

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingText !== null) {
      const updatedShapes = [...shapes];
      updatedShapes[editingText.index].text = e.target.value;
      setShapes(updatedShapes);
      setEditingText({ ...editingText, text: e.target.value });
    }
  };

  // Handle text input blur
  const handleTextBlur = () => {
    if (editingText !== null && shapes[editingText.index].text.trim() === '') {
      // Remove empty text shapes
      const updatedShapes = shapes.filter((_, index) => index !== editingText.index);
      setShapes(updatedShapes);
    }
    setEditingText(null);
  };

  // Re-render canvas whenever shapes change
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas, shapes]);

  return (
    <div className="drawing-canvas-container relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {editingText !== null && (
        <input
          type="text"
          value={editingText.text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          className="absolute bg-transparent border border-gray-300 outline-none text-foreground"
          style={{
            left: `${shapes[editingText.index].x + viewportOffset.x}px`,
            top: `${shapes[editingText.index].y + viewportOffset.y - (shapes[editingText.index].fontSize/2)}px`,
            fontSize: `${shapes[editingText.index].fontSize}px`,
            color: shapes[editingText.index].color,
            minWidth: '100px',
            padding: '2px'
          }}
          autoFocus
        />
      )}
    </div>
  );
};

export default DrawingCanvas;