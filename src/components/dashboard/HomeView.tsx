
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { WorkoutPlanCard } from "@/components/dashboard/WorkoutPlanCard";
import { EnhancedWorkoutGenerator } from "@/components/dashboard/EnhancedWorkoutGenerator";
import { VisualBodySelector } from "@/components/dashboard/VisualBodySelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Profile {
  first_name?: string;
  age: number;
  weight: number;
  fitness_goal?: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workout_location?: "home" | "gym";
  intensity_level?: "easy" | "moderate" | "hard" | "intense" | "beginner" | "intermediate" | "advanced";
  equipment?: string[];
}

interface WorkoutPlan {
  plan_data?: {
    workouts?: Array<{
      day: number;
      exercises: Array<{
        name: string;
        sets: number;
        reps?: number;
        duration?: number;
        rest: number;
      }>;
    }>;
  };
  targeted_body_parts?: string[];
}

interface ProgressStats {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  consistencyStreak: number;
}

interface WorkoutConfig {
  selectedMuscles: string[];
  numberOfDays: number;
  intensityLevel: string;
  workoutDuration: number;
}

interface HomeViewProps {
  profile: Profile | null;
  workoutPlan: WorkoutPlan | null;
  numberOfDays: number;
  generatingPlan: boolean;
  progressStats: ProgressStats;
  onDaysChange: (days: number) => void;
  onGeneratePlan: (config?: WorkoutConfig) => void;
  onSavePlan: () => void;
}

export const HomeView = ({
  profile,
  workoutPlan,
  numberOfDays,
  generatingPlan,
  progressStats,
  onDaysChange,
  onGeneratePlan,
  onSavePlan
}: HomeViewProps) => {
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);

  const handleBodyPartToggle = (part: string) => {
    setSelectedBodyParts(prev => {
      const isAlreadySelected = prev.includes(part);
      return isAlreadySelected
        ? prev.filter(p => p !== part)
        : [...prev, part];
    });
  };

  const handleGenerateWorkout = (config: WorkoutConfig) => {
    // Include selected body parts in the workout configuration
    const enhancedConfig = {
      ...config,
      selectedMuscles: selectedBodyParts
    };
    onGeneratePlan(enhancedConfig);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Target Body Areas Card */}
        <Card className="lg:col-span-1 bg-white/90 backdrop-blur-sm border-purple-300/20 shadow-xl shadow-purple-900/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#5C2D91]">
              <Target className="h-5 w-5 text-[#8E44AD]" />
              Target Body Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VisualBodySelector 
              selectedParts={selectedBodyParts}
              onSelectPart={handleBodyPartToggle}
              showComingSoon={false}
            />
          </CardContent>
        </Card>

        {/* Workout Generator Card */}
        <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-purple-300/20 shadow-xl shadow-purple-900/10">
          <CardContent className="p-0">
            <EnhancedWorkoutGenerator
              selectedMuscleGroups={selectedBodyParts}
              onGenerateWorkout={handleGenerateWorkout}
              isGenerating={generatingPlan}
              profile={profile}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Stats */}
        <Card className="bg-white/90 backdrop-blur-sm border-purple-300/20 shadow-xl shadow-purple-900/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#5C2D91]">
              <TrendingUp className="h-5 w-5 text-[#8E44AD]" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressStats 
              totalWorkouts={progressStats.totalWorkouts}
              totalVolume={progressStats.totalVolume}
              averageDuration={progressStats.averageDuration}
              consistencyStreak={progressStats.consistencyStreak}
            />
          </CardContent>
        </Card>

        {/* Today's Workout Plan */}
        <WorkoutPlanCard
          workoutPlan={workoutPlan}
          numberOfDays={numberOfDays}
          generatingPlan={generatingPlan}
          onDaysChange={onDaysChange}
          onGeneratePlan={() => handleGenerateWorkout({
            selectedMuscles: selectedBodyParts,
            numberOfDays,
            intensityLevel: profile?.intensity_level || "intermediate",
            workoutDuration: 45
          })}
          onSavePlan={onSavePlan}
        />
      </div>
    </div>
  );
};
