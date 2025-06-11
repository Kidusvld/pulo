
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, Edit, Minus, Plus, Save } from "lucide-react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useToast } from "@/hooks/use-toast";

interface VisualBodySelectorProps {
  selectedParts: string[];
  onSelectPart: (part: string) => void;
  showComingSoon?: boolean;
}

const defaultFrontPositions = {
  Chest: { top: 30, left: 35, width: 30, height: 15, rotation: 0, shape: 'circle' as const },
  Abs: { top: 40, left: 40, width: 20, height: 20, rotation: 0, shape: 'circle' as const },
  'Left Shoulder': { top: 20, left: 20, width: 8, height: 8, rotation: 0, shape: 'circle' as const },
  'Right Shoulder': { top: 20, left: 72, width: 8, height: 8, rotation: 0, shape: 'circle' as const },
  'Left Bicep': { top: 35, left: 15, width: 12, height: 20, rotation: 0, shape: 'circle' as const },
  'Right Bicep': { top: 73, left: 73, width: 12, height: 20, rotation: 0, shape: 'circle' as const },
  'Left Quadricep': { top: 65, left: 25, width: 15, height: 25, rotation: 0, shape: 'circle' as const },
  'Right Quadricep': { top: 65, left: 60, width: 15, height: 25, rotation: 0, shape: 'circle' as const }
};

const defaultBackPositions = {
  'Back': { top: 30, left: 35, width: 30, height: 25, rotation: 0, shape: 'circle' as const },
  'Lower Back': { top: 55, left: 40, width: 20, height: 15, rotation: 0, shape: 'circle' as const },
  'Glutes': { top: 70, left: 38, width: 24, height: 18, rotation: 0, shape: 'circle' as const },
  'Left Tricep': { top: 35, left: 15, width: 12, height: 20, rotation: 0, shape: 'circle' as const },
  'Right Tricep': { top: 35, left: 73, width: 12, height: 20, rotation: 0, shape: 'circle' as const },
  'Left Hamstring': { top: 88, left: 25, width: 15, height: 25, rotation: 0, shape: 'circle' as const },
  'Right Hamstring': { top: 88, left: 60, width: 15, height: 25, rotation: 0, shape: 'circle' as const },
  'Left Calf': { top: 115, left: 28, width: 12, height: 20, rotation: 0, shape: 'circle' as const },
  'Right Calf': { top: 115, left: 60, width: 12, height: 20, rotation: 0, shape: 'circle' as const }
};

// Load saved positions from localStorage or use defaults
const loadSavedPositions = (view: 'front' | 'back') => {
  try {
    const saved = localStorage.getItem(`bodyPartPositions_${view}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all required body parts have positions
      const defaults = view === 'front' ? defaultFrontPositions : defaultBackPositions;
      return { ...defaults, ...parsed };
    }
  } catch (error) {
    console.error('Error loading saved positions:', error);
  }
  return view === 'front' ? defaultFrontPositions : defaultBackPositions;
};

export const VisualBodySelector = ({ 
  selectedParts, 
  onSelectPart, 
  showComingSoon = true 
}: VisualBodySelectorProps) => {
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [showPositioningMode, setShowPositioningMode] = useState(false);
  const { toast } = useToast();

  // Load saved positions for current view
  const [frontPositions] = useState(() => loadSavedPositions('front'));
  const [backPositions] = useState(() => loadSavedPositions('back'));

  const currentPositions = currentView === 'front' ? frontPositions : backPositions;

  const {
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
  } = useDragAndDrop(currentPositions);

  // Update positions when view changes
  useEffect(() => {
    const newPositions = currentView === 'front' ? frontPositions : backPositions;
    setPositions(newPositions);
  }, [currentView, frontPositions, backPositions, setPositions]);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging || isRotating || isResizing || isShaping) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isRotating, isResizing, isShaping, handleMouseMove, handleMouseUp]);

  const handlePartClick = (part: string, event: React.MouseEvent) => {
    if (isEditMode) {
      event.stopPropagation();
      return; // Don't select parts in edit mode
    }
    onSelectPart(part);
  };

  const savePositions = () => {
    try {
      localStorage.setItem(`bodyPartPositions_${currentView}`, JSON.stringify(positions));
      toast({
        title: "Positions saved!",
        description: `Your custom ${currentView} body part positions have been saved and will be used for targeting.`,
      });
    } catch (error) {
      console.error('Error saving positions:', error);
      toast({
        title: "Save failed",
        description: "Could not save positions. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyCodeToClipboard = () => {
    const code = generateCode();
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied!",
      description: "The positioning code has been copied to your clipboard.",
    });
  };

  const resetToDefaults = () => {
    localStorage.removeItem(`bodyPartPositions_${currentView}`);
    const defaultPositions = currentView === 'front' ? defaultFrontPositions : defaultBackPositions;
    setPositions(defaultPositions);
    toast({
      title: "Reset complete",
      description: `${currentView} body part positions have been reset to defaults.`,
    });
  };

  const renderPolygonPath = (points: { x: number; y: number }[]) => {
    return points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x * 100} ${point.y * 100}`
    ).join(' ') + ' Z';
  };

  const renderBodyPart = (bodyPart: string, title: string) => {
    const position = positions[bodyPart];
    
    // Add null check to prevent the error
    if (!position) {
      console.warn(`No position data found for body part: ${bodyPart}`);
      return null;
    }

    const isSelected = selectedParts.includes(bodyPart.includes('Left') || bodyPart.includes('Right') ? 
      bodyPart.replace('Left ', '').replace('Right ', '') : bodyPart);
    const isDraggingThis = isDragging === bodyPart;
    const isRotatingThis = isRotating === bodyPart;
    const isResizingThis = isResizing === bodyPart;
    const isShapingThis = isShaping === bodyPart;

    return (
      <div
        key={bodyPart}
        className={`absolute transition-all ${
          isSelected
            ? 'border-2 border-[#8E44AD]' 
            : isEditMode
              ? 'border-2 border-blue-500 hover:border-blue-400'
              : showPositioningMode 
                ? 'border-2 border-red-500' 
                : ''
        } ${isDraggingThis || isRotatingThis || isResizingThis || isShapingThis ? 'opacity-70 z-50' : ''} ${isEditMode ? 'cursor-move' : 'cursor-pointer'}`}
        style={{
          top: `${position.top}%`,
          left: `${position.left}%`,
          width: `${position.width}%`,
          height: `${position.height}%`,
          transform: position.rotation !== 0 ? `rotate(${position.rotation}deg)` : undefined
        }}
        onClick={(e) => handlePartClick(bodyPart.includes('Left') || bodyPart.includes('Right') ? 
          bodyPart.replace('Left ', '').replace('Right ', '') : bodyPart, e)}
        onMouseDown={(e) => handleMouseDown(bodyPart, e)}
        onDoubleClick={(e) => isEditMode && position.shape === 'polygon' ? addPoint(bodyPart, e) : undefined}
        title={title}
      >
        {position.shape === 'polygon' && position.points ? (
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path
              d={renderPolygonPath(position.points)}
              fill={isSelected ? '#8E44AD40' : isEditMode ? '#3B82F650' : showPositioningMode ? '#EF444450' : 'transparent'}
              stroke={isSelected ? '#8E44AD' : isEditMode ? '#3B82F6' : showPositioningMode ? '#EF4444' : 'transparent'}
              strokeWidth="2"
              className="transition-all"
            />
            {isEditMode && (
              <>
                {position.points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x * 100}
                    cy={point.y * 100}
                    r="3"
                    fill="#3B82F6"
                    stroke="white"
                    strokeWidth="1"
                    className="cursor-pointer hover:fill-blue-400"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePointMouseDown(bodyPart, index, e as any);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removePoint(bodyPart, index);
                    }}
                  />
                ))}
              </>
            )}
          </svg>
        ) : (
          <div className={`w-full h-full rounded-full ${
            isSelected
              ? 'bg-[#8E44AD]/40' 
              : isEditMode
                ? 'bg-blue-300/50 hover:bg-blue-400/50'
                : showPositioningMode 
                  ? 'bg-red-300/50' 
                  : 'hover:bg-purple-200/30'
          }`} />
        )}

        {(showPositioningMode || isEditMode) && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 bg-white/80 rounded-full border">
            {isEditMode ? (
              <div className="text-center leading-tight">
                <div className="font-semibold text-[10px]">{bodyPart}</div>
                <div className="text-[8px] text-gray-600">
                  {isResizingThis ? '⚡ Resizing' : 
                   isRotatingThis ? '🔄 Rotating' : 
                   isDraggingThis ? '✋ Dragging' : 
                   isShapingThis ? '🔷 Shaping' :
                   position.shape === 'polygon' ? 'Shift+Drag • Double-click' : 'Drag • Alt • Ctrl • Shift'}
                </div>
              </div>
            ) : (
              bodyPart.toUpperCase()
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* View Toggle */}
      <div className="flex bg-purple-100 rounded-lg p-1">
        <Button
          variant={currentView === 'front' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setCurrentView('front')}
          className={currentView === 'front' ? 'bg-[#8E44AD] text-white' : 'text-[#8E44AD]'}
        >
          Front
        </Button>
        <Button
          variant={currentView === 'back' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setCurrentView('back')}
          className={currentView === 'back' ? 'bg-[#8E44AD] text-white' : 'text-[#8E44AD]'}
        >
          Back
        </Button>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPositioningMode(!showPositioningMode)}
          className="text-[#8E44AD] border-[#8E44AD]"
        >
          {showPositioningMode ? 'Hide' : 'Show'} Positioning Guide
        </Button>
        
        <Button
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
          className={isEditMode ? "bg-blue-600 text-white" : "text-blue-600 border-blue-600"}
        >
          <Edit className="w-4 h-4 mr-1" />
          {isEditMode ? 'Exit Edit' : 'Edit Positions'}
        </Button>

        {isEditMode && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={savePositions}
              className="text-green-600 border-green-600"
            >
              <Save className="w-4 h-4 mr-1" />
              Save Positions
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="text-orange-600 border-orange-600"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset to Defaults
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={copyCodeToClipboard}
              className="text-gray-600 border-gray-600"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy Code
            </Button>
          </>
        )}
      </div>

      {/* Body Diagram */}
      <div className="relative w-64 h-80 mx-auto">
        <div 
          ref={containerRef}
          className={`relative w-full h-full ${isEditMode ? 'select-none' : ''}`}
        >
          <img 
            src={currentView === 'front' ? "/lovable-uploads/efd47857-cb5e-412b-822f-68ec94e165cd.png" : "/lovable-uploads/0735d87c-af0c-45a9-a870-bdbf776f4a3b.png"}
            alt={`${currentView} body view`}
            className="w-full h-full object-contain"
            draggable={false}
          />
          
          {/* Grid overlay for edit mode */}
          {isEditMode && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" style={{ opacity: 0.2 }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <line key={`h-${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#666" strokeWidth="1" />
                ))}
                {Array.from({ length: 10 }, (_, i) => (
                  <line key={`v-${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#666" strokeWidth="1" />
                ))}
              </svg>
            </div>
          )}
          
          {/* Render body parts based on current view */}
          {currentView === 'front' ? (
            <>
              {renderBodyPart('Chest', 'Chest')}
              {renderBodyPart('Abs', 'Abs')}
              {renderBodyPart('Left Shoulder', 'Left Shoulder')}
              {renderBodyPart('Right Shoulder', 'Right Shoulder')}
              {renderBodyPart('Left Bicep', 'Left Bicep')}
              {renderBodyPart('Right Bicep', 'Right Bicep')}
              {renderBodyPart('Left Quadricep', 'Left Quadricep')}
              {renderBodyPart('Right Quadricep', 'Right Quadricep')}
            </>
          ) : (
            <>
              {renderBodyPart('Back', 'Back')}
              {renderBodyPart('Lower Back', 'Lower Back')}
              {renderBodyPart('Glutes', 'Glutes')}
              {renderBodyPart('Left Tricep', 'Left Tricep')}
              {renderBodyPart('Right Tricep', 'Right Tricep')}
              {renderBodyPart('Left Hamstring', 'Left Hamstring')}
              {renderBodyPart('Right Hamstring', 'Right Hamstring')}
              {renderBodyPart('Left Calf', 'Left Calf')}
              {renderBodyPart('Right Calf', 'Right Calf')}
            </>
          )}
        </div>
      </div>

      {/* Edit Mode Instructions */}
      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center max-w-md">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Edit Mode Active - {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View</strong>
          </p>
          <p className="text-xs text-blue-600">
            <strong>Drag</strong> to move • <strong>Alt + Drag</strong> to rotate • <strong>Ctrl + Drag</strong> to resize
            <br />
            <strong>Shift + Drag</strong> to create custom shapes • <strong>Double-click</strong> polygon to add points
            <br />
            <strong>Double-click point</strong> to remove • Click <strong>Save Positions</strong> to store your layout
          </p>
        </div>
      )}

      {/* Selected Body Parts Display */}
      <div className="w-full max-w-md">
        <h4 className="text-sm font-semibold text-[#5C2D91] mb-2">Selected Areas:</h4>
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {selectedParts.length > 0 ? (
            selectedParts.map((part) => (
              <Badge 
                key={part} 
                variant="purple" 
                className="bg-[#8E44AD]/10 text-[#5C2D91] border-[#8E44AD]/20 cursor-pointer hover:bg-[#8E44AD]/20 transition-colors"
                onClick={() => !isEditMode && onSelectPart(part)}
              >
                {part} ×
              </Badge>
            ))
          ) : (
            <p className="text-sm text-[#8E44AD]/60 italic">
              {isEditMode ? 'Position the body parts and click Save Positions to store your layout' : 'Click on body areas to select them for targeting'}
            </p>
          )}
        </div>
      </div>

      {/* Coming Soon Notice */}
      {showComingSoon && !isEditMode && (
        <div className="bg-purple-50/50 border border-purple-200/50 rounded-lg p-3 text-center">
          <p className="text-sm text-[#8E44AD]/80">
            🚀 <strong>Body part targeting is now active!</strong> Your custom positioned areas will be used when generating targeted workouts.
          </p>
        </div>
      )}
    </div>
  );
};
