
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Target Body Areas Card */}
        <Card className="lg:col-span-1 bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 group-hover:text-indigo-600 transition-colors">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              Target Body Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <VisualBodySelector 
              selectedParts={selectedBodyParts}
              onSelectPart={handleBodyPartToggle}
              showComingSoon={false}
            />
          </CardContent>
        </Card>

        {/* Workout Generator Card */}
        <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
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
        <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 group-hover:text-emerald-600 transition-colors">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
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
