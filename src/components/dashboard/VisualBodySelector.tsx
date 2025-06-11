import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VisualBodySelectorProps {
  selectedParts: string[];
  onSelectPart: (part: string) => void;
  showComingSoon?: boolean;
}

export const VisualBodySelector = ({ 
  selectedParts, 
  onSelectPart, 
  showComingSoon = true 
}: VisualBodySelectorProps) => {
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [showPositioningMode, setShowPositioningMode] = useState(false);

  const bodyParts = {
    front: ['Chest', 'Abs', 'Shoulders', 'Biceps', 'Quadriceps'],
    back: ['Back', 'Lower Back', 'Glutes', 'Triceps', 'Hamstrings']
  };

  const handlePartClick = (part: string) => {
    onSelectPart(part);
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

      {/* Positioning Mode Toggle (only for front view) */}
      {currentView === 'front' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPositioningMode(!showPositioningMode)}
          className="text-[#8E44AD] border-[#8E44AD]"
        >
          {showPositioningMode ? 'Hide' : 'Show'} Positioning Guide
        </Button>
      )}

      {/* Body Diagram */}
      <div className="relative w-64 h-80 mx-auto">
        {currentView === 'front' ? (
          <div className="relative w-full h-full">
            <img 
              src="/lovable-uploads/efd47857-cb5e-412b-822f-68ec94e165cd.png" 
              alt="Front body view" 
              className="w-full h-full object-contain"
            />
            
            {/* Clickable overlay areas for front view */}
            {/* Chest - moved down from 25% to 30% */}
            <div
              className={`absolute top-[30%] left-[35%] w-[30%] h-[15%] cursor-pointer rounded-lg transition-all ${
                selectedParts.includes('Chest') 
                  ? 'bg-[#8E44AD]/40 border-2 border-[#8E44AD]' 
                  : showPositioningMode 
                    ? 'bg-red-300/50 border-2 border-red-500' 
                    : 'hover:bg-purple-200/30'
              }`}
              onClick={() => handlePartClick('Chest')}
              title="Chest"
            >
              {showPositioningMode && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-800">
                  CHEST
                </div>
              )}
            </div>
            
            {/* Abs */}
            <div
              className={`absolute top-[40%] left-[40%] w-[20%] h-[20%] cursor-pointer rounded-lg transition-all ${
                selectedParts.includes('Abs') 
                  ? 'bg-[#8E44AD]/40 border-2 border-[#8E44AD]' 
                  : showPositioningMode 
                    ? 'bg-blue-300/50 border-2 border-blue-500' 
                    : 'hover:bg-purple-200/30'
              }`}
              onClick={() => handlePartClick('Abs')}
              title="Abs"
            >
              {showPositioningMode && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-800">
                  ABS
                </div>
              )}
            </div>
            
            {/* Left Shoulder */}
            <div
              className={`absolute top-[20%] left-[20%] w-[15%] h-[15%] cursor-pointer rounded-lg transition-all ${
                selectedParts.includes('Shoulders') 
                  ? 'bg-[#8E44AD]/40 border-2 border-[#8E44AD]' 
                  : showPositioningMode 
                    ? 'bg-green-300/50 border-2 border-green-500' 
                    : 'hover:bg-purple-200/30'
              }`}
              onClick={() => handlePartClick('Shoulders')}
              title="Left Shoulder"
            >
              {showPositioningMode && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-800">
                  L.SHLD
                </div>
              )}
            </div>

            {/* Right Shoulder */}
            <div
              className={`absolute top-[20%] right-[20%] w-[15%] h-[15%] cursor-pointer rounded-lg transition-all ${
                selectedParts.includes('Shoulders') 
                  ? 'bg-[#8E44AD]/40 border-2 border-[#8E44AD]' 
                  : showPositioningMode 
                    ? 'bg-green-300/50 border-2 border-green-500' 
                    : 'hover:bg-purple-200/30'
              }`}
              onClick={() => handlePartClick('Shoulders')}
              title="Right Shoulder"
            >
              {showPositioningMode && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-800">
                  R.SHLD
                </div>
              )}
            </div>
            
            {/* Left Bicep */}
            <div
              className={`absolute top-[35%] left-[15%] w-[12%] h-[20%] cursor-pointer rounded-lg transition-all ${
                selectedParts.includes('Biceps') 
                  ? 'bg-[#8E44AD]/40 border-2 border-[#8E44AD]' 
                  : showPositioningMode 
                    ? 'bg-yellow-300/50 border-2 border-yellow-500' 
                    : 'hover:bg-purple-200/30'
              }`}
              onClick={() => handlePartClick('Biceps')}
              title="Left Bicep"
            >
              {showPositioningMode && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-yellow-800">
                  L.BIC
                </div>
              )}
            </div>

            {/* Right Bicep */}
            <div
              className={`absolute top-[35%] right-[15%] w-[12%] h-[20%] cursor-pointer rounded-lg transition-all ${
                selectedParts.includes('Biceps') 
                  ? 'bg-[#8E44AD]/40 border-2 border-[#8E44AD]' 
                  : showPositioningMode 
                    ? 'bg-yellow-300/50 border-2 border-yellow-500' 
                    : 'hover:bg-purple-200/30'
              }`}
              onClick={() => handlePartClick('Biceps')}
              title="Right Bicep"
            >
              {showPositioningMode && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-yellow-800">
                  R.BIC
                </div>
              )}
            </div>
            
            {/* Left Quadricep */}
            <div
              className={`absolute top-[65%] left-[25%] w-[15%] h-[25%] cursor-pointer rounded-lg transition-all ${
                selectedParts.includes('Quadriceps') 
                  ? 'bg-[#8E44AD]/40 border-2 border-[#8E44AD]' 
                  : showPositioningMode 
                    ? 'bg-purple-300/50 border-2 border-purple-500' 
                    : 'hover:bg-purple-200/30'
              }`}
              onClick={() => handlePartClick('Quadriceps')}
              title="Left Quadricep"
            >
              {showPositioningMode && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-800">
                  L.QUAD
                </div>
              )}
            </div>

            {/* Right Quadricep */}
            <div
              className={`absolute top-[65%] right-[25%] w-[15%] h-[25%] cursor-pointer rounded-lg transition-all ${
                selectedParts.includes('Quadriceps') 
                  ? 'bg-[#8E44AD]/40 border-2 border-[#8E44AD]' 
                  : showPositioningMode 
                    ? 'bg-purple-300/50 border-2 border-purple-500' 
                    : 'hover:bg-purple-200/30'
              }`}
              onClick={() => handlePartClick('Quadriceps')}
              title="Right Quadricep"
            >
              {showPositioningMode && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-800">
                  R.QUAD
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <svg 
              viewBox="0 0 200 300" 
              className="w-full h-full"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
            >
              {/* Back Body Outline */}
              <path
                d="M100 20 
                   C85 20, 75 30, 75 45
                   L75 60
                   C70 65, 65 70, 60 80
                   L60 120
                   C60 130, 65 140, 75 150
                   L75 180
                   C70 190, 65 200, 60 210
                   L60 250
                   C60 260, 70 270, 80 270
                   L80 280
                   C85 285, 95 285, 100 280
                   C105 285, 115 285, 120 280
                   L120 270
                   C130 270, 140 260, 140 250
                   L140 210
                   C135 200, 130 190, 125 180
                   L125 150
                   C135 140, 140 130, 140 120
                   L140 80
                   C135 70, 130 65, 125 60
                   L125 45
                   C125 30, 115 20, 100 20 Z"
                fill="#E8E0F5"
                stroke="#8E44AD"
                strokeWidth="2"
                className="transition-all duration-200"
              />

              {/* Back muscle groups - clickable areas */}
              
              {/* Upper Back */}
              <rect
                x="80" y="50" width="40" height="30"
                fill={selectedParts.includes('Back') ? '#8E44AD' : 'transparent'}
                fillOpacity={selectedParts.includes('Back') ? '0.4' : '0'}
                stroke={selectedParts.includes('Back') ? '#8E44AD' : 'transparent'}
                strokeWidth="2"
                rx="5"
                className="cursor-pointer hover:fill-purple-200 hover:fill-opacity-30 transition-all"
                onClick={() => handlePartClick('Back')}
              >
                <title>Back</title>
              </rect>

              {/* Lower Back */}
              <rect
                x="85" y="85" width="30" height="25"
                fill={selectedParts.includes('Lower Back') ? '#8E44AD' : 'transparent'}
                fillOpacity={selectedParts.includes('Lower Back') ? '0.4' : '0'}
                stroke={selectedParts.includes('Lower Back') ? '#8E44AD' : 'transparent'}
                strokeWidth="2"
                rx="5"
                className="cursor-pointer hover:fill-purple-200 hover:fill-opacity-30 transition-all"
                onClick={() => handlePartClick('Lower Back')}
              >
                <title>Lower Back</title>
              </rect>

              {/* Glutes */}
              <ellipse
                cx="100" cy="130" rx="20" ry="15"
                fill={selectedParts.includes('Glutes') ? '#8E44AD' : 'transparent'}
                fillOpacity={selectedParts.includes('Glutes') ? '0.4' : '0'}
                stroke={selectedParts.includes('Glutes') ? '#8E44AD' : 'transparent'}
                strokeWidth="2"
                className="cursor-pointer hover:fill-purple-200 hover:fill-opacity-30 transition-all"
                onClick={() => handlePartClick('Glutes')}
              >
                <title>Glutes</title>
              </ellipse>

              {/* Left Tricep */}
              <ellipse
                cx="65" cy="75" rx="8" ry="20"
                fill={selectedParts.includes('Triceps') ? '#8E44AD' : 'transparent'}
                fillOpacity={selectedParts.includes('Triceps') ? '0.4' : '0'}
                stroke={selectedParts.includes('Triceps') ? '#8E44AD' : 'transparent'}
                strokeWidth="2"
                className="cursor-pointer hover:fill-purple-200 hover:fill-opacity-30 transition-all"
                onClick={() => handlePartClick('Triceps')}
              >
                <title>Left Tricep</title>
              </ellipse>

              {/* Right Tricep */}
              <ellipse
                cx="135" cy="75" rx="8" ry="20"
                fill={selectedParts.includes('Triceps') ? '#8E44AD' : 'transparent'}
                fillOpacity={selectedParts.includes('Triceps') ? '0.4' : '0'}
                stroke={selectedParts.includes('Triceps') ? '#8E44AD' : 'transparent'}
                strokeWidth="2"
                className="cursor-pointer hover:fill-purple-200 hover:fill-opacity-30 transition-all"
                onClick={() => handlePartClick('Triceps')}
              >
                <title>Right Tricep</title>
              </ellipse>

              {/* Left Hamstring */}
              <ellipse
                cx="85" cy="180" rx="10" ry="25"
                fill={selectedParts.includes('Hamstrings') ? '#8E44AD' : 'transparent'}
                fillOpacity={selectedParts.includes('Hamstrings') ? '0.4' : '0'}
                stroke={selectedParts.includes('Hamstrings') ? '#8E44AD' : 'transparent'}
                strokeWidth="2"
                className="cursor-pointer hover:fill-purple-200 hover:fill-opacity-30 transition-all"
                onClick={() => handlePartClick('Hamstrings')}
              >
                <title>Left Hamstring</title>
              </ellipse>

              {/* Right Hamstring */}
              <ellipse
                cx="115" cy="180" rx="10" ry="25"
                fill={selectedParts.includes('Hamstrings') ? '#8E44AD' : 'transparent'}
                fillOpacity={selectedParts.includes('Hamstrings') ? '0.4' : '0'}
                stroke={selectedParts.includes('Hamstrings') ? '#8E44AD' : 'transparent'}
                strokeWidth="2"
                className="cursor-pointer hover:fill-purple-200 hover:fill-opacity-30 transition-all"
                onClick={() => handlePartClick('Hamstrings')}
              >
                <title>Right Hamstring</title>
              </ellipse>

              {/* Left Calf */}
              <ellipse
                cx="85" cy="230" rx="8" ry="20"
                fill={selectedParts.includes('Calves') ? '#8E44AD' : 'transparent'}
                fillOpacity={selectedParts.includes('Calves') ? '0.4' : '0'}
                stroke={selectedParts.includes('Calves') ? '#8E44AD' : 'transparent'}
                strokeWidth="2"
                className="cursor-pointer hover:fill-purple-200 hover:fill-opacity-30 transition-all"
                onClick={() => handlePartClick('Calves')}
              >
                <title>Left Calf</title>
              </ellipse>

              {/* Right Calf */}
              <ellipse
                cx="115" cy="230" rx="8" ry="20"
                fill={selectedParts.includes('Calves') ? '#8E44AD' : 'transparent'}
                fillOpacity={selectedParts.includes('Calves') ? '0.4' : '0'}
                stroke={selectedParts.includes('Calves') ? '#8E44AD' : 'transparent'}
                strokeWidth="2"
                className="cursor-pointer hover:fill-purple-200 hover:fill-opacity-30 transition-all"
                onClick={() => handlePartClick('Calves')}
              >
                <title>Right Calf</title>
              </ellipse>
            </svg>
          </div>
        )}
      </div>

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
                onClick={() => handlePartClick(part)}
              >
                {part} ×
              </Badge>
            ))
          ) : (
            <p className="text-sm text-[#8E44AD]/60 italic">Click on body areas to select them</p>
          )}
        </div>
      </div>

      {/* Coming Soon Notice */}
      {showComingSoon && (
        <div className="bg-purple-50/50 border border-purple-200/50 rounded-lg p-3 text-center">
          <p className="text-sm text-[#8E44AD]/80">
            🚀 <strong>Body part targeting coming soon!</strong> This feature will help you create workouts focused on specific muscle groups.
          </p>
        </div>
      )}
    </div>
  );
};
