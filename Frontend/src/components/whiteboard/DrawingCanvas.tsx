
import React, { useRef, useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface DrawingCanvasProps {
  activeTool: 'select' | 'hand' | 'pen' | 'square' | 'circle' | 'text';
  activeColor: string;
  strokeWidth: number;
  onCanvasChange?: (dataUrl: string) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  activeTool, 
  activeColor, 
  strokeWidth,
  onCanvasChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  
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
    if (shapes.length > 0 && onCanvasChange && canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL();
        onCanvasChange(dataUrl);
      } catch (error) {
        console.error("Error converting canvas to data URL:", error);
      }
    }
  }, [shapes, onCanvasChange]);
  
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
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
  };
  
  const getMousePosition = (event: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };
  
  const handleMouseDown = (event: React.MouseEvent) => {
    const position = getMousePosition(event);
    
    if (activeTool === 'select') {
      // Check if clicked on a shape
      const clickedShapeIndex = shapes.findIndex(shape => isPointInShape(position, shape));
      setSelectedShape(clickedShapeIndex >= 0 ? clickedShapeIndex : null);
      
      if (clickedShapeIndex >= 0) {
        setIsDragging(true);
        setDragStart(position);
      }
    } else if (activeTool === 'hand') {
      setIsDragging(true);
      setDragStart(position);
    } else if (activeTool === 'pen') {
      setIsDrawing(true);
      setLastPoint(position);
      
      // Start a new path
      setShapes([...shapes, {
        type: 'path',
        points: [position],
        color: activeColor,
        strokeWidth
      }]);
    } else if (activeTool === 'square') {
      // Start drawing a rectangle
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
      // Start drawing a circle
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
    } else if (activeTool === 'text') {
      const text = prompt('Enter text:', '');
      if (text) {
        setShapes([...shapes, {
          type: 'text',
          x: position.x,
          y: position.y,
          text,
          fontSize: strokeWidth * 8,
          color: activeColor
        }]);
      }
    }
    
    redrawCanvas();
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
    } else if (activeTool === 'hand' && isDragging) {
      // Pan the canvas (would need to implement viewport translation)
      console.log('Panning canvas');
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
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = activeColor;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          ctx.beginPath();
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(position.x, position.y);
          ctx.stroke();
        }
      }
      
      setLastPoint(position);
    } else if (activeTool === 'square' && isDrawing && lastPoint) {
      // Update rectangle dimensions
      const updatedShapes = [...shapes];
      const currentRect = updatedShapes[updatedShapes.length - 1];
      
      if (currentRect && currentRect.type === 'rectangle') {
        currentRect.width = position.x - lastPoint.x;
        currentRect.height = position.y - lastPoint.y;
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
        currentCircle.radius = Math.sqrt(dx * dx + dy * dy);
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
    }
    return false;
  };
  
  const clearCanvas = () => {
    setShapes([]);
    redrawCanvas();
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-white"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default DrawingCanvas;
