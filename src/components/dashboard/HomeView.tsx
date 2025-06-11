
import { WeeklySummaryStats } from "@/components/dashboard/WeeklySummaryStats";
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
            stats={{
              workoutsThisWeek: progressStats.totalWorkouts || 0,
              activeDays: Math.min(progressStats.consistencyStreak || 0, 7),
              totalWorkouts: progressStats.totalWorkouts || 0
            }}
            consistencyStreak={progressStats.consistencyStreak || 0}
          />
          <PuloFitIndex 
            age={profile?.age || 25}
            weight={profile?.weight || 150}
          />
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
