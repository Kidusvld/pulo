
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HomeView } from "@/components/dashboard/HomeView";
import { ProfileView } from "@/components/dashboard/ProfileView";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProfileEditor } from "@/hooks/useProfileEditor";
import { useWorkoutPlan } from "@/hooks/useWorkoutPlan";

const Dashboard = () => {
  const navigate = useNavigate();
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
  } = useDashboardData();
  
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
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error('Error signing out:', error);
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
