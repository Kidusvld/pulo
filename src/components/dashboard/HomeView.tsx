import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { WorkoutPlanCard } from "@/components/dashboard/WorkoutPlanCard";
import { EnhancedWorkoutGenerator } from "@/components/dashboard/EnhancedWorkoutGenerator";
import { VisualBodySelector } from "@/components/dashboard/VisualBodySelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div 
      className="space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        variants={itemVariants}
      >
        {/* Target Body Areas Card */}
        <Card className="lg:col-span-1 bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02]">
          <CardHeader className="pb-6 border-b border-slate-100">
            <CardTitle className="text-xl md:text-2xl font-montserrat font-bold flex items-center gap-3 text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="tracking-tight">Target Body Areas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <VisualBodySelector 
              selectedParts={selectedBodyParts}
              onSelectPart={handleBodyPartToggle}
              showComingSoon={false}
            />
          </CardContent>
        </Card>

        {/* Workout Generator Card */}
        <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]">
          <CardContent className="p-0">
            <EnhancedWorkoutGenerator
              selectedMuscleGroups={selectedBodyParts}
              onGenerateWorkout={handleGenerateWorkout}
              isGenerating={generatingPlan}
              profile={profile}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={itemVariants}
      >
        {/* Progress Stats */}
        <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02]">
          <CardHeader className="pb-6 border-b border-slate-100">
            <CardTitle className="text-xl md:text-2xl font-montserrat font-bold flex items-center gap-3 text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="tracking-tight">Progress Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <ProgressStats 
              totalWorkouts={progressStats.totalWorkouts}
              totalVolume={progressStats.totalVolume}
              averageDuration={progressStats.averageDuration}
              consistencyStreak={progressStats.consistencyStreak}
            />
          </CardContent>
        </Card>

        {/* Today's Workout Plan */}
        <motion.div variants={itemVariants}>
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
