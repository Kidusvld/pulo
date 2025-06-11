import { WeeklySummaryStats } from "@/components/progress/WeeklySummaryStats";
import { PuloFitIndex } from "@/components/dashboard/PuloFitIndex";
import { WorkoutPlanCard } from "@/components/dashboard/WorkoutPlanCard";

interface HomeViewProps {
  profile: any;
  workoutPlan: any;
  numberOfDays: number;
  generatingPlan: boolean;
  progressStats: any;
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <WeeklySummaryStats 
            totalWorkouts={progressStats.totalWorkouts}
            totalVolume={progressStats.totalVolume}
            averageDuration={progressStats.averageDuration}
            consistencyStreak={progressStats.consistencyStreak}
          />
          <PuloFitIndex profile={profile} />
        </div>
        
        <div className="space-y-6">
          <WorkoutPlanCard 
            workoutPlan={workoutPlan}
            numberOfDays={numberOfDays}
            generatingPlan={generatingPlan}
            onDaysChange={onDaysChange}
            onGeneratePlan={onGeneratePlan}
            onSavePlan={onSavePlan}
          />
        </div>
      </div>
    </div>
  );
};
