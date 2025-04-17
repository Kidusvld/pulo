
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User2, Dumbbell, Brain } from "lucide-react";

// Define the body parts with their display names and descriptions
const bodyParts = [
  { id: "chest", name: "Chest", description: "Pectoralis major and minor" },
  { id: "back", name: "Back", description: "Latissimus dorsi, rhomboids, and trapezius" },
  { id: "shoulders", name: "Shoulders", description: "Deltoids and rotator cuff" },
  { id: "biceps", name: "Biceps", description: "Biceps brachii" },
  { id: "triceps", name: "Triceps", description: "Triceps brachii" },
  { id: "forearms", name: "Forearms", description: "Flexors and extensors" },
  { id: "abs", name: "Abs", description: "Rectus abdominis and obliques" },
  { id: "lower_back", name: "Lower Back", description: "Erector spinae" },
  { id: "glutes", name: "Glutes", description: "Gluteus maximus, medius, and minimus" },
  { id: "quadriceps", name: "Quadriceps", description: "Front thigh muscles" },
  { id: "hamstrings", name: "Hamstrings", description: "Back thigh muscles" },
  { id: "calves", name: "Calves", description: "Gastrocnemius and soleus" }
];

// Group body parts by region for better UI organization
const bodyPartGroups = {
  upper: ["chest", "back", "shoulders", "biceps", "triceps", "forearms"],
  core: ["abs", "lower_back"],
  lower: ["glutes", "quadriceps", "hamstrings", "calves"]
};

interface BodyPartSelectorProps {
  selectedParts: string[];
  onSelectPart: (part: string) => void;
  className?: string;
}

export const BodyPartSelector = ({ 
  selectedParts, 
  onSelectPart,
  className 
}: BodyPartSelectorProps) => {
  // Helper function to check if a body part is selected
  const isSelected = (partId: string) => selectedParts.includes(partId);
  
  // Getting the display name of a body part by ID
  const getPartName = (partId: string) => {
    const part = bodyParts.find(p => p.id === partId);
    return part ? part.name : partId;
  };
  
  return (
    <div className={className}>
      <div className="flex flex-col space-y-4">
        {/* Human body icon with tooltip */}
        <div className="flex justify-center mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 bg-purple-50 rounded-full">
                  <User2 className="h-8 w-8 text-[#5C2D91]" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select body parts to target</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Upper body section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[#5C2D91]">
            <Dumbbell className="h-4 w-4" />
            Upper Body
          </div>
          <div className="flex flex-wrap gap-2">
            {bodyPartGroups.upper.map(partId => (
              <TooltipProvider key={partId}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={isSelected(partId) ? "default" : "outline"}
                      className={`cursor-pointer ${isSelected(partId) 
                        ? "bg-[#5C2D91] hover:bg-[#4A2375]" 
                        : "hover:bg-purple-50"}`}
                      onClick={() => onSelectPart(partId)}
                    >
                      {getPartName(partId)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{bodyParts.find(p => p.id === partId)?.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Core section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[#5C2D91]">
            <Brain className="h-4 w-4" />
            Core
          </div>
          <div className="flex flex-wrap gap-2">
            {bodyPartGroups.core.map(partId => (
              <TooltipProvider key={partId}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={isSelected(partId) ? "default" : "outline"}
                      className={`cursor-pointer ${isSelected(partId) 
                        ? "bg-[#5C2D91] hover:bg-[#4A2375]" 
                        : "hover:bg-purple-50"}`}
                      onClick={() => onSelectPart(partId)}
                    >
                      {getPartName(partId)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{bodyParts.find(p => p.id === partId)?.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Lower body section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[#5C2D91]">
            <Dumbbell className="h-4 w-4" />
            Lower Body
          </div>
          <div className="flex flex-wrap gap-2">
            {bodyPartGroups.lower.map(partId => (
              <TooltipProvider key={partId}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={isSelected(partId) ? "default" : "outline"}
                      className={`cursor-pointer ${isSelected(partId) 
                        ? "bg-[#5C2D91] hover:bg-[#4A2375]" 
                        : "hover:bg-purple-50"}`}
                      onClick={() => onSelectPart(partId)}
                    >
                      {getPartName(partId)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{bodyParts.find(p => p.id === partId)?.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Selected parts display */}
        {selectedParts.length > 0 && (
          <div className="mt-4 p-3 bg-purple-50/50 rounded-lg border border-purple-100">
            <p className="text-sm font-medium text-[#5C2D91] mb-1">Selected Areas:</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedParts.map(partId => (
                <Badge 
                  key={partId}
                  className="bg-[#5C2D91] text-xs"
                  onClick={() => onSelectPart(partId)}
                >
                  {getPartName(partId)}
                  <span className="ml-1 text-purple-200">×</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const bodyPartsList = bodyParts.map(part => part.id);
