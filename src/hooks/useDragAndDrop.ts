
import { useState, useCallback, useRef } from 'react';

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface BodyPartPositions {
  [key: string]: Position;
}

export const useDragAndDrop = (initialPositions: BodyPartPositions) => {
  const [positions, setPositions] = useState<BodyPartPositions>(initialPositions);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((bodyPart: string, event: React.MouseEvent) => {
    if (!isEditMode) return;
    
    event.preventDefault();
    setIsDragging(bodyPart);
    setDragStart({
      x: event.clientX,
      y: event.clientY
    });
  }, [isEditMode]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

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
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  const resetPositions = useCallback(() => {
    setPositions(initialPositions);
  }, [initialPositions]);

  const generateCode = useCallback(() => {
    let code = "// Updated body part positions:\n";
    Object.entries(positions).forEach(([bodyPart, pos]) => {
      code += `// ${bodyPart}\n`;
      code += `className="absolute top-[${pos.top.toFixed(1)}%] left-[${pos.left.toFixed(1)}%] w-[${pos.width}%] h-[${pos.height}%] ..."\n\n`;
    });
    return code;
  }, [positions]);

  return {
    positions,
    isDragging,
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
