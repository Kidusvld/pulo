import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Dumbbell, Calendar, Sparkles, LightbulbIcon } from "lucide-react";
import { WorkoutPlanCard } from "@/components/dashboard/WorkoutPlanCard";
import { PuloFitIndex } from "@/components/dashboard/PuloFitIndex";
import { WeeklySummaryStats } from "@/components/dashboard/WeeklySummaryStats";
import { useState, useEffect } from "react";
import { getRandomQuote } from "@/utils/motivationalQuotes";

interface Profile {
  first_name?: string;
  age: number;
  weight: number;
  fitness_goal?: string;
  workout_location?: string;
  intensity_level?: string;
}

interface WorkoutPlan {
  id: string;
  plan_data: {
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

interface HomeViewProps {
  profile: Profile | null;
  workoutPlan: WorkoutPlan | null;
  numberOfDays: number;
  generatingPlan: boolean;
  progressStats: ProgressStats;
  onDaysChange: (days: number) => void;
  onGeneratePlan: () => void;
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
  const [motivationalQuote, setMotivationalQuote] = useState(() => getRandomQuote());
  
  useEffect(() => {
    setMotivationalQuote(getRandomQuote());
  }, [workoutPlan]);
  
  const handleGeneratePlan = () => {
    onGeneratePlan();
  };
  
  const calculateWeeklyStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    return {
      workoutsThisWeek: Math.min(progressStats.consistencyStreak, 7),
      activeDays: Math.min(progressStats.consistencyStreak, 7),
      totalWorkouts: progressStats.totalWorkouts
    };
  };
  
  const weeklyStats = calculateWeeklyStats();
  
  const getMotivationalMessage = () => {
    if (progressStats.consistencyStreak > 5) {
      return "Amazing consistency! You're building great habits.";
    } else if (progressStats.consistencyStreak > 2) {
      return "Good progress this week! Keep up the momentum.";
    } else if (progressStats.totalWorkouts > 0) {
      return "Remember, consistency is key to seeing results!";
    } else {
      return "Get started with your first workout to begin tracking progress!";
    }
  };
  
  const getAdviceMessage = () => {
    if (!profile) return "";
    
    if (profile.fitness_goal === "build_muscle") {
      return "Focus on progressive overload and protein intake to maximize muscle growth.";
    } else if (profile.fitness_goal === "lose_fat") {
      return "Combine your strength training with cardio for optimal fat loss.";
    } else if (profile.fitness_goal === "increase_mobility") {
      return "Remember to hold each stretch for at least 30 seconds for best results.";
    } else {
      return "Consistency is more important than intensity - keep showing up!";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-[#6E59A5]/90 text-white border-none shadow-lg overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-center">
            <LightbulbIcon className="h-5 w-5 mr-2 text-yellow-200" />
            <div>
              <h3 className="font-semibold text-base">{motivationalQuote.quote}</h3>
              <p className="text-xs text-white/80">{motivationalQuote.source}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 order-2 lg:order-1">
          <WorkoutPlanCard 
            workoutPlan={workoutPlan}
            numberOfDays={numberOfDays}
            generatingPlan={generatingPlan}
            onDaysChange={onDaysChange}
            onGeneratePlan={handleGeneratePlan}
            onSavePlan={onSavePlan}
          />
        </div>
        
        <div className="lg:col-span-4 space-y-4 order-1 lg:order-2">
          <Card className="bg-white/90 backdrop-blur-sm border-purple-300/20 shadow-xl shadow-purple-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#5C2D91]">
                <Calendar className="h-5 w-5 text-[#8E44AD]" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <WeeklySummaryStats stats={calculateWeeklyStats()} consistencyStreak={progressStats.consistencyStreak} />
            </CardContent>
          </Card>

          {profile && (
            <Card className="bg-white/90 backdrop-blur-sm border-purple-300/20 shadow-xl shadow-purple-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#5C2D91]">
                  <Sparkles className="h-5 w-5 text-[#8E44AD]" />
                  PULO Fit Index
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 px-4">
                <div className="flex flex-col gap-3">
                  <div className="mb-1">
                    {profile && <PuloFitIndex age={profile.age} weight={profile.weight} horizontal={true} />}
                  </div>
                  <div className="bg-purple-50/50 rounded-lg p-3 border border-purple-100">
                    <h4 className="text-sm font-semibold text-[#8E44AD] mb-1">PULO Says:</h4>
                    <p className="text-sm text-gray-700 italic">{getMotivationalMessage()}</p>
                    <div className="mt-2 pt-2 border-t border-purple-100/50">
                      <p className="text-xs text-[#5C2D91] font-medium">Advice:</p>
                      <p className="text-xs text-gray-600">{getAdviceMessage()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
