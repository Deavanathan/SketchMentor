import React, { useRef, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

// Type Definitions
interface Point {
  x: number;
  y: number;
}

interface PathShape {
  type: 'path';
  points: Point[];
  color: string;
  strokeWidth: number;
}

interface RectangleShape {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  fill?: string;
}

interface CircleShape {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
  color: string;
  strokeWidth: number;
  fill?: string;
}

interface TextShape {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

type Shape = PathShape | RectangleShape | CircleShape | TextShape;

interface DrawingCanvasProps {
  activeTool: 'select' | 'hand' | 'pen' | 'square' | 'circle' | 'text';
  activeColor: string;
  strokeWidth: number;
  onCanvasChange?: (dataUrl: string, shapes?: Shape[]) => void;
  onClear?: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  registerActions?: (actions: {
    clearCanvas: () => void;
    undoCanvasDrawing: () => void;
    redoCanvasDrawing: () => void;
    saveCanvasDrawing: (query: string) => boolean;
  }) => void;
  maxUndoStackSize?: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  activeTool,
  activeColor,
  strokeWidth,
  onCanvasChange,
  onClear,
  canvasRef: externalCanvasRef,
  registerActions,
  maxUndoStackSize = 20,
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [undoStack, setUndoStack] = useState<Shape[][]>([]);
  const [redoStack, setRedoStack] = useState<Shape[][]>([]);
  
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [viewportOffset, setViewportOffset] = useState<Point>({ x: 0, y: 0 });
  const [editingText, setEditingText] = useState<{ index: number; text: string } | null>(null);

  // Resize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

  // Canvas Change Tracking
  useEffect(() => {
    if (onCanvasChange && canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL();
        onCanvasChange(dataUrl, shapes);
      } catch (error) {
        console.error('Error converting canvas to data URL:', error);
      }
    }
  }, [shapes, onCanvasChange]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    shapes.forEach((shape: Shape, index: number) => {
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

      if (index === selectedShape) {
        ctx.strokeStyle = '#0088ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        if (shape.type === 'path') {
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
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

    ctx.restore();
  }, [shapes, selectedShape, viewportOffset, canvasRef]);

  // Clear Canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save current state to undo stack if not empty
    if (shapes.length > 0) {
      setUndoStack(prev => {
        const newStack = [...prev, shapes];
        return newStack.length > maxUndoStackSize 
          ? newStack.slice(-maxUndoStackSize) 
          : newStack;
      });
    }

    // Clear the canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Reset state
    setShapes([]);
    setSelectedShape(null);
    setRedoStack([]);
    setViewportOffset({ x: 0, y: 0 });

    // Callbacks
    if (onClear) onClear();
    if (onCanvasChange) {
      const dataUrl = canvas.toDataURL();
      onCanvasChange(dataUrl, []);
    }

    toast.success('Canvas cleared');
  }, [shapes, onClear, onCanvasChange, canvasRef, maxUndoStackSize]);

  // Undo
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      // Get the last state from undo stack
      const lastState = undoStack[undoStack.length - 1];
      
      // Add current shapes to redo stack
      setRedoStack(prev => [...prev, shapes]);
      
      // Update shapes with last state
      setShapes(lastState);
      
      // Remove last state from undo stack
      setUndoStack(prev => prev.slice(0, -1));
      
      toast.info('Undo performed');
    } else {
      toast.warning('No more undo states available');
    }
  }, [shapes, undoStack]);

  // Redo
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      // Get the next state from redo stack
      const nextState = redoStack[redoStack.length - 1];
      
      // Add current shapes to undo stack
      setUndoStack(prev => [...prev, shapes]);
      
      // Update shapes with next state
      setShapes(nextState);
      
      // Remove next state from redo stack
      setRedoStack(prev => prev.slice(0, -1));
      
      toast.info('Redo performed');
    } else {
      toast.warning('No more redo states available');
    }
  }, [shapes, redoStack]);

  // Save Canvas Drawing
  const saveCanvasDrawing = useCallback((query: string) => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      const canvasData = {
        image: dataUrl,
        shapes: shapes,
        query: query,
      };

      try {
        console.log('CANVAS DRAWING DATA:', JSON.stringify(canvasData, null, 2));
        toast.success('Canvas data saved and logged');
        return true;
      } catch (error) {
        console.error('Error saving canvas:', error);
        toast.error('Failed to save canvas');
        return false;
      }
    }
    return false;
  }, [shapes, canvasRef]);

  // Register Actions
  useEffect(() => {
    if (registerActions) {
      registerActions({
        clearCanvas,
        undoCanvasDrawing: handleUndo,
        redoCanvasDrawing: handleRedo,
        saveCanvasDrawing,
      });
    }
  }, [clearCanvas, handleUndo, handleRedo, saveCanvasDrawing, registerActions]);

  const getMousePosition = (event: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left - viewportOffset.x,
      y: event.clientY - rect.top - viewportOffset.y,
    };
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const position = getMousePosition(event);

    if (activeTool === 'select') {
      const index =
        shapes
          .map((shape, idx) => ({ shape, idx }))
          .reverse()
          .find(({ shape }) => isPointInShape(position, shape))?.idx ?? -1;

      setSelectedShape(index >= 0 ? index : null);

      if (event.detail === 2 && index >= 0 && shapes[index].type === 'text') {
        setEditingText({ index, text: (shapes[index] as TextShape).text });
      } else if (index >= 0) {
        setIsDragging(true);
        setDragStart(position);
      }
    } else if (activeTool === 'hand') {
      setIsDragging(true);
      setDragStart({
        x: event.clientX,
        y: event.clientY,
      });
    } else if (activeTool === 'text') {
      const newText = '';
      const fontSize = strokeWidth * 8;
      const newShapeIndex = shapes.length;

      // Save current state to undo stack
      setUndoStack(prev => [...prev, shapes]);

      setShapes([
        ...shapes,
        {
          type: 'text',
          x: position.x,
          y: position.y,
          text: newText,
          fontSize: fontSize,
          color: activeColor,
        },
      ]);

      setRedoStack([]);

      setTimeout(() => {
        setEditingText({ index: newShapeIndex, text: newText });
      }, 0);
    } else {
      // Save current state to undo stack
      setUndoStack(prev => [...prev, shapes]);
      setRedoStack([]);

      if (activeTool === 'pen') {
        setIsDrawing(true);
        setLastPoint(position);
        setShapes([
          ...shapes,
          {
            type: 'path',
            points: [position],
            color: activeColor,
            strokeWidth,
          },
        ]);
      } else if (activeTool === 'square') {
        setIsDrawing(true);
        setLastPoint(position);
        setShapes([
          ...shapes,
          {
            type: 'rectangle',
            x: position.x,
            y: position.y,
            width: 0,
            height: 0,
            color: activeColor,
            strokeWidth,
          },
        ]);
      } else if (activeTool === 'circle') {
        setIsDrawing(true);
        setLastPoint(position);
        setShapes([
          ...shapes,
          {
            type: 'circle',
            x: position.x,
            y: position.y,
            radius: 0,
            color: activeColor,
            strokeWidth,
          },
        ]);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const position = getMousePosition(event);

    if (activeTool === 'select' && isDragging && selectedShape !== null && dragStart) {
      const deltaX = position.x - dragStart.x;
      const deltaY = position.y - dragStart.y;

      const updatedShapes = [...shapes];
      const shape = updatedShapes[selectedShape];

      if (shape.type === 'path') {
        shape.points = shape.points.map((point: Point) => ({
          x: point.x + deltaX,
          y: point.y + deltaY,
        }));
      } else if (shape.type === 'rectangle' || shape.type === 'circle' || shape.type === 'text') {
        shape.x += deltaX;
        shape.y += deltaY;
      }

      setShapes(updatedShapes);
      setDragStart(position);
      redrawCanvas();
    } else if (activeTool === 'hand' && isDragging && dragStart) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;

      setViewportOffset({
        x: viewportOffset.x + deltaX,
        y: viewportOffset.y + deltaY,
      });

      setDragStart({
        x: event.clientX,
        y: event.clientY,
      });

      redrawCanvas();
    } else if (activeTool === 'pen' && isDrawing) {
      const updatedShapes = [...shapes];
      const currentPath = updatedShapes[updatedShapes.length - 1] as PathShape;

      if (currentPath && currentPath.type === 'path') {
        currentPath.points.push(position);
        setShapes(updatedShapes);
      }

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
      const updatedShapes = [...shapes];
      const currentRect = updatedShapes[updatedShapes.length - 1] as RectangleShape;

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
      const updatedShapes = [...shapes];
      const currentCircle = updatedShapes[updatedShapes.length - 1] as CircleShape;

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

  const isPointInShape = (point: Point, shape: Shape): boolean => {
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
      return shape.points.some((pathPoint: Point) => {
        const dx = pathPoint.x - point.x;
        const dy = pathPoint.y - point.y;
        return Math.sqrt(dx * dx + dy * dy) <= 10;
      });
    } else if (shape.type === 'text') {
      const textWidth = shape.text.length * (shape.fontSize / 2);
      return (
        point.x >= shape.x &&
        point.x <= shape.x + textWidth &&
        point.y >= shape.y - shape.fontSize &&
        point.y <= shape.y
      );
    }
    return false;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingText !== null) {
      const updatedShapes = [...shapes];
      (updatedShapes[editingText.index] as TextShape).text = e.target.value;
      setShapes(updatedShapes);
      setEditingText({ ...editingText, text: e.target.value });
    }
  };

  const handleTextBlur = () => {
    if (editingText !== null && (shapes[editingText.index] as TextShape).text.trim() === '') {
      const updatedShapes = shapes.filter((_, index) => index !== editingText.index);
      setShapes(updatedShapes);
    }
    setEditingText(null);
  };

  useEffect(() => {
    redrawCanvas();
  }, [shapes, selectedShape, viewportOffset]);

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
            top: `${shapes[editingText.index].y + viewportOffset.y - (shapes[editingText.index] as TextShape).fontSize / 2}px`,
            fontSize: `${(shapes[editingText.index] as TextShape).fontSize}px`,
            color: shapes[editingText.index].color,
            minWidth: '100px',
            padding: '2px',
          }}
          autoFocus
        />
      )}
    </div>
  );
};

export default DrawingCanvas;