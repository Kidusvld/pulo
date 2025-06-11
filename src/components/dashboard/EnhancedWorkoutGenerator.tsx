
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Dumbbell, Target, Zap, Calendar, Loader2 } from "lucide-react";

interface EnhancedWorkoutGeneratorProps {
  selectedMuscleGroups: string[];
  onGenerateWorkout: (config: WorkoutConfig) => void;
  isGenerating: boolean;
  profile?: any;
}

interface WorkoutConfig {
  selectedMuscles: string[];
  numberOfDays: number;
  intensityLevel: string;
  workoutDuration: number;
}

export const EnhancedWorkoutGenerator = ({
  selectedMuscleGroups,
  onGenerateWorkout,
  isGenerating,
  profile
}: EnhancedWorkoutGeneratorProps) => {
  const [numberOfDays, setNumberOfDays] = useState<number[]>([3]);
  const [workoutDuration, setWorkoutDuration] = useState<number[]>([45]);

  const handleGenerateWorkout = () => {
    const config: WorkoutConfig = {
      selectedMuscles: selectedMuscleGroups,
      numberOfDays: numberOfDays[0],
      intensityLevel: profile?.intensity_level || "intermediate",
      workoutDuration: workoutDuration[0]
    };
    
    onGenerateWorkout(config);
  };

  const canGenerate = selectedMuscleGroups.length > 0 && !isGenerating;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-[#5C2D91]">
          <Zap className="h-6 w-6 text-[#8E44AD]" />
          AI Workout Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Muscle Groups Display */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[#5C2D91]">
            <Target className="h-4 w-4" />
            Targeted Muscle Groups
          </div>
          
          {selectedMuscleGroups.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedMuscleGroups.map((muscle, index) => (
                <motion.div
                  key={muscle}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="bg-[#5C2D91] text-white hover:bg-[#4A2375] capitalize"
                  >
                    {muscle.replace('_', ' ')}
                  </Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-purple-500 text-sm italic p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              Select muscle groups from the body diagram above to generate a targeted workout
            </div>
          )}
        </div>

        {/* Workout Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Days per week */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[#5C2D91]">
              <Calendar className="h-4 w-4" />
              Days per Week: {numberOfDays[0]}
            </div>
            <Slider
              value={numberOfDays}
              onValueChange={setNumberOfDays}
              max={7}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-purple-600">
              <span>1 day</span>
              <span>7 days</span>
            </div>
          </div>

          {/* Workout Duration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[#5C2D91]">
              <Dumbbell className="h-4 w-4" />
              Duration: {workoutDuration[0]} mins
            </div>
            <Slider
              value={workoutDuration}
              onValueChange={setWorkoutDuration}
              max={120}
              min={15}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-purple-600">
              <span>15 min</span>
              <span>2 hours</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <motion.div
          whileHover={canGenerate ? { scale: 1.02 } : {}}
          whileTap={canGenerate ? { scale: 0.98 } : {}}
        >
          <Button
            onClick={handleGenerateWorkout}
            disabled={!canGenerate}
            className={`w-full py-3 text-lg font-semibold ${
              canGenerate 
                ? "bg-gradient-to-r from-[#5C2D91] to-[#8E44AD] hover:from-[#4A2375] hover:to-[#7A3B9D] text-white shadow-lg"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating Your Workout...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Generate AI Workout Plan
              </>
            )}
          </Button>
        </motion.div>

        {!canGenerate && selectedMuscleGroups.length === 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-purple-600 text-sm mt-2"
          >
            Select at least one muscle group to generate a workout
          </motion.p>
        )}
      </CardContent>
    </Card>
  );
};
