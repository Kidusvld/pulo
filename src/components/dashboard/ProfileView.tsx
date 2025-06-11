
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { WorkoutForm } from "@/components/progress/WorkoutForm";
import { MuscleGroupChart } from "@/components/progress/MuscleGroupChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, BarChart3, Activity } from "lucide-react";

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
  onUpdateProfile
}: ProfileViewProps) => {
  return (
    <div className="space-y-8">
      {/* Profile Information Card */}
      <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 group-hover:text-blue-600 transition-colors">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Progress Stats Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 group-hover:text-emerald-600 transition-colors">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Progress Statistics
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

          {/* Muscle Group Chart Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 group-hover:text-purple-600 transition-colors">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                Muscle Group Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <MuscleGroupChart data={muscleGroupData} />
            </CardContent>
          </Card>
        </div>
        
        {/* Workout Logging Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 group-hover:text-orange-600 transition-colors">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Log Workout
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <WorkoutForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
