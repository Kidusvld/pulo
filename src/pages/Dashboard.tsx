
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
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  
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
  } = useWorkoutPlan(profile, workoutPlan, setWorkoutPlan, selectedBodyParts);
  
  // Handle body part selection
  const handleBodyPartSelect = (bodyParts: string[]) => {
    setSelectedBodyParts(bodyParts);
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      
      // First check if there's even a session to sign out from
      const { data: sessionData } = await supabase.auth.getSession();
      
      // If no session, just redirect to auth page directly
      if (!sessionData.session) {
        console.log("No active session found, redirecting to auth page");
        toast.success("Successfully signed out");
        window.location.href = "/auth"; // Use direct navigation to ensure complete reset
        return;
      }
      
      // Otherwise proceed with normal sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        // Even if there's an error, try to navigate to auth page anyway
        toast.error("Error during sign out, redirecting to login page");
        window.location.href = "/auth"; // Use direct navigation as fallback
        return;
      }
      
      // Auth state change will handle redirection in useAuthCheck
      console.log("Sign out successful");
      // No need to redirect here as useAuthCheck will handle it
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error during sign out. Redirecting to login page.");
      window.location.href = "/auth"; // Use direct navigation as fallback
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
          onBodyPartSelect={handleBodyPartSelect}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
