
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useProfileData } from "./useProfileData";
import { useWorkoutPlan } from "./useWorkoutPlan";
import { Profile, WorkoutPlan } from "./useDashboardData";
import { toast } from "sonner";

export function useProfileActions(
  profile: Profile | null,
  workoutPlan: WorkoutPlan | null,
  refreshData?: () => Promise<void>
) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { updateProfile } = useProfileData(null);
  const { updateWorkoutPlan, generateNewWorkoutPlan, saveCurrentWorkout, generatingPlan } = useWorkoutPlan(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState<string>("");
  const [editedIntensity, setEditedIntensity] = useState<string>("moderate");
  const [editedFitnessGoal, setEditedFitnessGoal] = useState<string>("build_muscle");
  const [editedWorkoutLocation, setEditedWorkoutLocation] = useState<string>("home");
  const [numberOfDays, setNumberOfDays] = useState<number>(3);

  // Handle profile editing toggle
  const handleEditToggle = () => {
    // Map legacy intensity values to new format for editing
    let initialIntensity = profile?.intensity_level || "moderate";
    if (["beginner", "intermediate", "advanced"].includes(initialIntensity)) {
      switch(initialIntensity) {
        case "beginner": initialIntensity = "easy"; break;
        case "intermediate": initialIntensity = "moderate"; break;
        case "advanced": initialIntensity = "hard"; break;
      }
    }
    
    setEditedWeight(profile?.weight?.toString() || "");
    setEditedIntensity(initialIntensity);
    setEditedFitnessGoal(profile?.fitness_goal || "build_muscle");
    setEditedWorkoutLocation(profile?.workout_location || "home");
    setIsEditing(true);
  };

  // Update user profile and workout plan settings
  const handleUpdateProfile = async () => {
    if (!profile) {
      toast.error("Profile not loaded");
      return;
    }
    
    const weight = parseFloat(editedWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }
    
    try {
      // Update profile weight
      const profileSuccess = await updateProfile(weight);
      if (!profileSuccess) return;
      
      // Update workout plan
      const workoutSuccess = await updateWorkoutPlan(
        editedIntensity,
        editedFitnessGoal, 
        editedWorkoutLocation
      );
      
      if (!workoutSuccess) return;
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      
      // Refresh data if callback provided
      if (refreshData) {
        await refreshData();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  // Generate new workout plan
  const generateNewPlan = async () => {
    if (!profile) return;
    
    const success = await generateNewWorkoutPlan(profile, numberOfDays);
    
    if (success && refreshData) {
      await refreshData();
    }
  };

  return {
    isEditing,
    editedWeight,
    editedIntensity,
    editedFitnessGoal,
    editedWorkoutLocation,
    generatingPlan,
    numberOfDays,
    setEditedWeight,
    setEditedIntensity,
    setEditedFitnessGoal,
    setEditedWorkoutLocation,
    setNumberOfDays,
    handleEditToggle,
    handleUpdateProfile,
    generateNewPlan,
    handleSaveWorkout: saveCurrentWorkout,
    handleSignOut: signOut
  };
}
