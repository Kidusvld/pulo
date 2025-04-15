
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HomeView } from "@/components/dashboard/HomeView";
import { ProfileView } from "@/components/dashboard/ProfileView";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProfileEditor } from "@/hooks/useProfileEditor";
import { useWorkoutPlan } from "@/hooks/useWorkoutPlan";
import { toast } from "sonner";

// Define a shared Profile interface to ensure consistency
interface Profile {
  first_name?: string;
  age: number;
  weight: number;
  fitness_goal?: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workout_location?: "home" | "gym";
  intensity_level?: "easy" | "moderate" | "hard" | "intense" | "beginner" | "intermediate" | "advanced";
  equipment?: string[];
}

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<"home" | "profile">("home");
  
  // Check authentication status
  useAuthCheck();
  
  // Fetch dashboard data
  const {
    loading,
    profile,
    workoutPlan,
    progressStats,
    muscleGroupData,
    setProfile,
    setWorkoutPlan
  } = useDashboardData<Profile>();
  
  // Profile editor state and handlers
  const {
    isEditing,
    editedWeight,
    editedAge,
    editedIntensity,
    editedFitnessGoal,
    editedWorkoutLocation,
    setEditedWeight,
    setEditedAge,
    setEditedIntensity,
    setEditedFitnessGoal,
    setEditedWorkoutLocation,
    handleEditToggle,
    handleUpdateProfile
  } = useProfileEditor(profile, setProfile, workoutPlan, setWorkoutPlan);
  
  // Workout plan state and handlers
  const {
    numberOfDays,
    generatingPlan,
    setNumberOfDays,
    generateNewPlan,
    handleSaveWorkout
  } = useWorkoutPlan(profile, workoutPlan, setWorkoutPlan);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Failed to sign out: " + error.message);
        return;
      }
      
      // Auth state change will handle redirection in useAuthCheck
      console.log("Sign out successful");
      // No need to redirect here as useAuthCheck will handle it
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error during sign out. Please try again.");
    }
  };
  
  if (loading) {
    return <LoadingState />;
  }

  return (
    <DashboardLayout
      firstName={profile?.first_name}
      onSignOut={handleSignOut}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {activeSection === "home" ? (
        <HomeView 
          profile={profile}
          workoutPlan={workoutPlan}
          numberOfDays={numberOfDays}
          generatingPlan={generatingPlan}
          progressStats={progressStats}
          onDaysChange={setNumberOfDays}
          onGeneratePlan={generateNewPlan}
          onSavePlan={handleSaveWorkout}
        />
      ) : (
        <ProfileView
          profile={profile}
          isEditing={isEditing}
          editedWeight={editedWeight}
          editedAge={editedAge}
          editedIntensity={editedIntensity}
          editedFitnessGoal={editedFitnessGoal}
          editedWorkoutLocation={editedWorkoutLocation}
          muscleGroupData={muscleGroupData}
          progressStats={progressStats}
          onEditToggle={handleEditToggle}
          onEditWeight={setEditedWeight}
          onEditAge={setEditedAge}
          onEditIntensity={setEditedIntensity}
          onEditFitnessGoal={setEditedFitnessGoal}
          onEditWorkoutLocation={setEditedWorkoutLocation}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
