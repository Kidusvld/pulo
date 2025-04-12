
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { WorkoutForm } from "@/components/progress/WorkoutForm";
import { MuscleGroupChart } from "@/components/progress/MuscleGroupChart";

interface Profile {
  first_name?: string;
  age: number;
  weight: number;
  fitness_goal?: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workout_location?: "home" | "gym";
  intensity_level?: "easy" | "moderate" | "hard" | "intense" | "beginner" | "intermediate" | "advanced";
  equipment?: string[];
}

interface ProgressStats {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  consistencyStreak: number;
}

interface ProfileViewProps {
  profile: Profile | null;
  isEditing: boolean;
  editedWeight: string;
  editedIntensity: string;
  editedFitnessGoal: string;
  editedWorkoutLocation: string;
  muscleGroupData: Array<{
    muscle_group: string;
    total_volume: number;
  }>;
  progressStats: ProgressStats;
  onEditToggle: () => void;
  onEditWeight: (value: string) => void;
  onEditIntensity: (value: string) => void;
  onEditFitnessGoal: (value: string) => void;
  onEditWorkoutLocation: (value: string) => void;
  onUpdateProfile: () => void;
}

export const ProfileView = ({
  profile,
  isEditing,
  editedWeight,
  editedIntensity,
  editedFitnessGoal,
  editedWorkoutLocation,
  muscleGroupData,
  progressStats,
  onEditToggle,
  onEditWeight,
  onEditIntensity,
  onEditFitnessGoal,
  onEditWorkoutLocation,
  onUpdateProfile
}: ProfileViewProps) => {
  return (
    <div className="space-y-6">
      <ProfileCard 
        profile={profile}
        isEditing={isEditing}
        editedWeight={editedWeight}
        editedIntensity={editedIntensity}
        editedFitnessGoal={editedFitnessGoal}
        editedWorkoutLocation={editedWorkoutLocation}
        onEditToggle={onEditToggle}
        onEditWeight={onEditWeight}
        onEditIntensity={onEditIntensity}
        onEditFitnessGoal={onEditFitnessGoal}
        onEditWorkoutLocation={onEditWorkoutLocation}
        onUpdateProfile={onUpdateProfile}
      />

      <ProgressStats 
        totalWorkouts={progressStats.totalWorkouts}
        totalVolume={progressStats.totalVolume}
        averageDuration={progressStats.averageDuration}
        consistencyStreak={progressStats.consistencyStreak}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WorkoutForm />
        <MuscleGroupChart data={muscleGroupData} />
      </div>
    </div>
  );
};
