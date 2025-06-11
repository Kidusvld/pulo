
import { useState, useCallback, useRef } from 'react';

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  shape?: 'circle' | 'polygon';
  points?: { x: number; y: number }[]; // For polygon shapes, relative to the element
}

interface BodyPartPositions {
  [key: string]: Position;
}

export const useDragAndDrop = (initialPositions: BodyPartPositions) => {
  const [positions, setPositions] = useState<BodyPartPositions>(initialPositions);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [isShaping, setIsShaping] = useState<string | null>(null);
  const [activePointIndex, setActivePointIndex] = useState<number>(-1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState({ angle: 0, centerX: 0, centerY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((bodyPart: string, event: React.MouseEvent) => {
    if (!isEditMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // Check modifier keys for different modes
    if (event.ctrlKey || event.metaKey) {
      // Resize mode
      setIsResizing(bodyPart);
      setResizeStart({
        x: event.clientX,
        y: event.clientY,
        width: positions[bodyPart].width,
        height: positions[bodyPart].height
      });
    } else if (event.altKey) {
      // Rotation mode
      setIsRotating(bodyPart);
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
      
      setRotationStart({
        angle: currentAngle - positions[bodyPart].rotation,
        centerX,
        centerY
      });
    } else if (event.shiftKey) {
      // Shape mode - toggle to polygon and allow point editing
      setIsShaping(bodyPart);
      
      // Convert to polygon if it's currently a circle
      if (!positions[bodyPart].shape || positions[bodyPart].shape === 'circle') {
        const defaultPoints = [
          { x: 0.2, y: 0.2 },   // top-left
          { x: 0.8, y: 0.2 },   // top-right
          { x: 0.8, y: 0.8 },   // bottom-right
          { x: 0.2, y: 0.8 }    // bottom-left
        ];
        
        setPositions(prev => ({
          ...prev,
          [bodyPart]: {
            ...prev[bodyPart],
            shape: 'polygon',
            points: defaultPoints
          }
        }));
      }
    } else {
      // Drag mode
      setIsDragging(bodyPart);
      setDragStart({
        x: event.clientX,
        y: event.clientY
      });
    }
  }, [isEditMode, positions]);

  const handlePointMouseDown = useCallback((bodyPart: string, pointIndex: number, event: React.MouseEvent) => {
    if (!isEditMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    setIsShaping(bodyPart);
    setActivePointIndex(pointIndex);
    setDragStart({
      x: event.clientX,
      y: event.clientY
    });
  }, [isEditMode]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current) return;

    if (isDragging) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      setPositions(prev => ({
        ...prev,
        [isDragging]: {
          ...prev[isDragging],
          left: Math.max(0, Math.min(90, prev[isDragging].left + deltaXPercent)),
          top: Math.max(0, Math.min(90, prev[isDragging].top + deltaYPercent))
        }
      }));

      setDragStart({
        x: event.clientX,
        y: event.clientY
      });
    } else if (isRotating) {
      const newAngle = Math.atan2(
        event.clientY - rotationStart.centerY,
        event.clientX - rotationStart.centerX
      ) * (180 / Math.PI);
      
      const rotation = newAngle - rotationStart.angle;
      
      setPositions(prev => ({
        ...prev,
        [isRotating]: {
          ...prev[isRotating],
          rotation: rotation % 360
        }
      }));
    } else if (isResizing) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const deltaX = event.clientX - resizeStart.x;
      const deltaY = event.clientY - resizeStart.y;
      
      const deltaWidthPercent = (deltaX / rect.width) * 100;
      const deltaHeightPercent = (deltaY / rect.height) * 100;
      
      const newWidth = Math.max(5, Math.min(50, resizeStart.width + deltaWidthPercent));
      const newHeight = Math.max(5, Math.min(50, resizeStart.height + deltaHeightPercent));
      
      setPositions(prev => ({
        ...prev,
        [isResizing]: {
          ...prev[isResizing],
          width: newWidth,
          height: newHeight
        }
      }));
    } else if (isShaping && activePointIndex >= 0) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      
      const deltaXPercent = (deltaX / rect.width) / (positions[isShaping].width / 100);
      const deltaYPercent = (deltaY / rect.height) / (positions[isShaping].height / 100);
      
      setPositions(prev => {
        const currentPoints = prev[isShaping].points || [];
        const newPoints = [...currentPoints];
        
        if (newPoints[activePointIndex]) {
          newPoints[activePointIndex] = {
            x: Math.max(0, Math.min(1, newPoints[activePointIndex].x + deltaXPercent)),
            y: Math.max(0, Math.min(1, newPoints[activePointIndex].y + deltaYPercent))
          };
        }
        
        return {
          ...prev,
          [isShaping]: {
            ...prev[isShaping],
            points: newPoints
          }
        };
      });

      setDragStart({
        x: event.clientX,
        y: event.clientY
      });
    }
  }, [isDragging, isRotating, isResizing, isShaping, activePointIndex, dragStart, rotationStart, resizeStart, positions]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    setIsRotating(null);
    setIsResizing(null);
    setIsShaping(null);
    setActivePointIndex(-1);
  }, []);

  const addPoint = useCallback((bodyPart: string, event: React.MouseEvent) => {
    if (!isEditMode || !positions[bodyPart].points) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    setPositions(prev => {
      const currentPoints = prev[bodyPart].points || [];
      return {
        ...prev,
        [bodyPart]: {
          ...prev[bodyPart],
          points: [...currentPoints, { x, y }]
        }
      };
    });
  }, [isEditMode, positions]);

  const removePoint = useCallback((bodyPart: string, pointIndex: number) => {
    setPositions(prev => {
      const currentPoints = prev[bodyPart].points || [];
      if (currentPoints.length <= 3) return prev; // Keep minimum 3 points
      
      return {
        ...prev,
        [bodyPart]: {
          ...prev[bodyPart],
          points: currentPoints.filter((_, index) => index !== pointIndex)
        }
      };
    });
  }, []);

  const resetToCircle = useCallback((bodyPart: string) => {
    setPositions(prev => ({
      ...prev,
      [bodyPart]: {
        ...prev[bodyPart],
        shape: 'circle',
        points: undefined
      }
    }));
  }, []);

  const resetPositions = useCallback(() => {
    setPositions(initialPositions);
  }, [initialPositions]);

  const generateCode = useCallback(() => {
    let code = "// Updated body part positions:\n";
    Object.entries(positions).forEach(([bodyPart, pos]) => {
      code += `// ${bodyPart}\n`;
      if (pos.shape === 'polygon' && pos.points) {
        code += `// Polygon shape with points: ${JSON.stringify(pos.points)}\n`;
      }
      code += `className="absolute top-[${pos.top.toFixed(1)}%] left-[${pos.left.toFixed(1)}%] w-[${pos.width.toFixed(1)}%] h-[${pos.height.toFixed(1)}%]`;
      if (pos.rotation !== 0) {
        code += ` transform rotate-[${pos.rotation.toFixed(1)}deg]`;
      }
      code += ` ..."\n`;
      if (pos.rotation !== 0) {
        code += `style={{ transform: 'rotate(${pos.rotation.toFixed(1)}deg)' }}\n`;
      }
      code += `\n`;
    });
    return code;
  }, [positions]);

  return {
    positions,
    isDragging,
    isRotating,
    isResizing,
    isShaping,
    activePointIndex,
    isEditMode,
    containerRef,
    setIsEditMode,
    handleMouseDown,
    handlePointMouseDown,
    handleMouseMove,
    handleMouseUp,
    addPoint,
    removePoint,
    resetToCircle,
    resetPositions,
    generateCode,
    setPositions
  };
};
