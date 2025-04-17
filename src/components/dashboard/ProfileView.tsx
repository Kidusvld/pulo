
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { WorkoutForm } from "@/components/progress/WorkoutForm";
import { MuscleGroupChart } from "@/components/progress/MuscleGroupChart";
import { BodyPartSelector, bodyPartsList } from "@/components/dashboard/BodyPartSelector";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

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
  editedAge: string;
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
  onEditAge: (value: string) => void;
  onEditIntensity: (value: string) => void;
  onEditFitnessGoal: (value: string) => void;
  onEditWorkoutLocation: (value: string) => void;
  onUpdateProfile: () => void;
  onBodyPartSelect?: (bodyParts: string[]) => void;
}

export const ProfileView = ({
  profile,
  isEditing,
  editedWeight,
  editedAge,
  editedIntensity,
  editedFitnessGoal,
  editedWorkoutLocation,
  muscleGroupData,
  progressStats,
  onEditToggle,
  onEditWeight,
  onEditAge,
  onEditIntensity,
  onEditFitnessGoal,
  onEditWorkoutLocation,
  onUpdateProfile,
  onBodyPartSelect
}: ProfileViewProps) => {
  // State for tracking selected body parts
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);

  // Handle body part selection toggle
  const handleBodyPartToggle = (part: string) => {
    setSelectedBodyParts(prev => {
      const isAlreadySelected = prev.includes(part);
      const newSelection = isAlreadySelected
        ? prev.filter(p => p !== part)
        : [...prev, part];
      
      // Notify parent component if callback provided
      if (onBodyPartSelect) {
        onBodyPartSelect(newSelection);
      }
      
      return newSelection;
    });
  };

  return (
    <div className="space-y-6">
      <ProfileCard 
        profile={profile}
        isEditing={isEditing}
        editedWeight={editedWeight}
        editedAge={editedAge}
        editedIntensity={editedIntensity}
        editedFitnessGoal={editedFitnessGoal}
        editedWorkoutLocation={editedWorkoutLocation}
        onEditToggle={onEditToggle}
        onEditWeight={onEditWeight}
        onEditAge={onEditAge}
        onEditIntensity={onEditIntensity}
        onEditFitnessGoal={onEditFitnessGoal}
        onEditWorkoutLocation={onEditWorkoutLocation}
        onUpdateProfile={onUpdateProfile}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-purple-300/20 shadow-xl shadow-purple-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#5C2D91]">
              <Target className="h-5 w-5 text-[#8E44AD]" />
              Target Body Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BodyPartSelector 
              selectedParts={selectedBodyParts}
              onSelectPart={handleBodyPartToggle}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <ProgressStats 
            totalWorkouts={progressStats.totalWorkouts}
            totalVolume={progressStats.totalVolume}
            averageDuration={progressStats.averageDuration}
            consistencyStreak={progressStats.consistencyStreak}
          />
          <MuscleGroupChart data={muscleGroupData} />
        </div>
      </div>

      <WorkoutForm />
    </div>
  );
};
