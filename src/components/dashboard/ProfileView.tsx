import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { WorkoutForm } from "@/components/progress/WorkoutForm";
import { MuscleGroupChart } from "@/components/progress/MuscleGroupChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, BarChart3, Activity } from "lucide-react";
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
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
      {/* Profile Information Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.01]">
          <CardHeader className="pb-6 border-b border-slate-100">
            <CardTitle className="text-xl md:text-2xl font-montserrat font-bold flex items-center gap-3 text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <span className="tracking-tight">Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
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
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={itemVariants}
      >
        <div className="space-y-8">
          {/* Progress Stats Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02]">
              <CardHeader className="pb-6 border-b border-slate-100">
                <CardTitle className="text-xl md:text-2xl font-montserrat font-bold flex items-center gap-3 text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <span className="tracking-tight">Progress Statistics</span>
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
          </motion.div>

          {/* Muscle Group Chart Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02]">
              <CardHeader className="pb-6 border-b border-slate-100">
                <CardTitle className="text-xl md:text-2xl font-montserrat font-bold flex items-center gap-3 text-slate-800 group-hover:text-purple-600 transition-colors duration-300">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <span className="tracking-tight">Muscle Group Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <MuscleGroupChart data={muscleGroupData} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Workout Logging Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02] h-fit">
            <CardHeader className="pb-6 border-b border-slate-100">
              <CardTitle className="text-xl md:text-2xl font-montserrat font-bold flex items-center gap-3 text-slate-800 group-hover:text-orange-600 transition-colors duration-300">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="tracking-tight">Log Workout</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <WorkoutForm />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
