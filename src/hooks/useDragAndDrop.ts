
import { useState, useCallback, useRef } from 'react';

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
}

interface BodyPartPositions {
  [key: string]: Position;
}

export const useDragAndDrop = (initialPositions: BodyPartPositions) => {
  const [positions, setPositions] = useState<BodyPartPositions>(initialPositions);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState<string | null>(null);
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
    } else {
      // Drag mode
      setIsDragging(bodyPart);
      setDragStart({
        x: event.clientX,
        y: event.clientY
      });
    }
  }, [isEditMode, positions]);

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
    }
  }, [isDragging, isRotating, isResizing, dragStart, rotationStart, resizeStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    setIsRotating(null);
    setIsResizing(null);
  }, []);

  const resetPositions = useCallback(() => {
    setPositions(initialPositions);
  }, [initialPositions]);

  const generateCode = useCallback(() => {
    let code = "// Updated body part positions:\n";
    Object.entries(positions).forEach(([bodyPart, pos]) => {
      code += `// ${bodyPart}\n`;
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
    isEditMode,
    containerRef,
    setIsEditMode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetPositions,
    generateCode,
    setPositions
  };
};
