
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Profile, WorkoutPlan } from "./useDashboardData";

export function useProfileActions(
  profile: Profile | null,
  workoutPlan: WorkoutPlan | null,
  refreshData?: () => Promise<void>
) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState<string>("");
  const [editedIntensity, setEditedIntensity] = useState<string>("moderate");
  const [editedFitnessGoal, setEditedFitnessGoal] = useState<string>("build_muscle");
  const [editedWorkoutLocation, setEditedWorkoutLocation] = useState<string>("home");
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState<number>(3);

  // Map intensity levels between legacy and new format
  const mapToLegacyIntensity = (intensity: string): "beginner" | "intermediate" | "advanced" => {
    switch(intensity) {
      case "easy": return "beginner";
      case "moderate": return "intermediate";
      case "hard": 
      case "intense": return "advanced";
      // If it's already a legacy value, return it as is
      case "beginner": return "beginner";
      case "intermediate": return "intermediate";
      case "advanced": return "advanced";
      default: return "intermediate";
    }
  };

  // Map fitness goals to database format
  const mapToLegacyFitnessGoal = (goal: string): "build_muscle" | "lose_fat" | "increase_mobility" => {
    // stay_active is not supported in the database, map it to a supported value
    if (goal === "stay_active") return "build_muscle";
    
    // If it's already a valid database value, return it
    if (goal === "build_muscle" || goal === "lose_fat" || goal === "increase_mobility") {
      return goal as "build_muscle" | "lose_fat" | "increase_mobility";
    }
    
    // Default fallback
    return "build_muscle";
  };

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
    const {
      data: { session }
    } = await supabase.auth.getSession();
    
    if (!session || !profile) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }
    
    const weight = parseFloat(editedWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }
    
    try {
      // Update profile weight
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ weight })
        .eq("id", session.user.id);
      
      if (profileError) throw profileError;
      
      // Convert to database format
      const intensityToSave = mapToLegacyIntensity(editedIntensity);
      const fitnessGoalToSave = mapToLegacyFitnessGoal(editedFitnessGoal);
      
      // Update active workout plan
      const { error: planError } = await supabase
        .from("workout_plans")
        .update({
          intensity_level: intensityToSave,
          fitness_goal: fitnessGoalToSave,
          workout_location: editedWorkoutLocation as "home" | "gym",
          is_active: true
        })
        .eq("user_id", session.user.id)
        .eq("is_active", true);
      
      if (planError) throw planError;
      
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
    
    setGeneratingPlan(true);
    
    const {
      data: { session }
    } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }
    
    try {
      // Use mapToLegacyIntensity to ensure we're using the correct enum value
      const intensityToUse = mapToLegacyIntensity(profile.intensity_level || "intermediate");
      // Use mapToLegacyFitnessGoal to ensure we're using the correct enum value
      const fitnessGoalToUse = mapToLegacyFitnessGoal(profile.fitness_goal || "build_muscle");
      
      // Call Edge Function to generate workout plan
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('generate-workout', {
        body: {
          age: profile.age,
          weight: profile.weight,
          fitnessGoal: fitnessGoalToUse,
          workoutLocation: profile.workout_location,
          equipment: profile.equipment,
          intensityLevel: intensityToUse,
          numberOfDays: numberOfDays
        }
      });
      
      if (aiError || !aiResponse) {
        throw new Error(aiError?.message || 'Failed to generate workout plan');
      }
      
      if (aiResponse.error) {
        throw new Error(aiResponse.error);
      }
      
      if (!aiResponse.workouts || !Array.isArray(aiResponse.workouts)) {
        throw new Error('Invalid workout plan structure received from AI');
      }
      
      // Deactivate existing workout plans
      const { error: deactivateError } = await supabase
        .from("workout_plans")
        .update({ is_active: false })
        .eq("user_id", session.user.id);
      
      if (deactivateError) {
        throw new Error('Failed to deactivate existing workout plans');
      }
      
      // Create new workout plan
      const { data: plan, error: createError } = await supabase
        .from("workout_plans")
        .insert([{
          user_id: session.user.id,
          fitness_goal: fitnessGoalToUse,
          workout_location: profile.workout_location,
          intensity_level: intensityToUse,
          equipment: profile.equipment,
          plan_data: aiResponse,
          is_active: true,
          workout_frequency: numberOfDays
        }])
        .select()
        .single();
      
      if (createError || !plan) {
        throw new Error('Failed to save new workout plan');
      }
      
      toast.success("New workout plan generated!");
      
      // Refresh data if callback provided
      if (refreshData) {
        await refreshData();
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate workout plan");
    } finally {
      setGeneratingPlan(false);
    }
  };

  // Save workout plan to saved plans
  const handleSaveWorkout = async () => {
    if (!workoutPlan) {
      toast.error("No workout plan to save");
      return;
    }
    
    const {
      data: session
    } = await supabase.auth.getSession();
    
    if (!session?.session) {
      toast.error("Please sign in to save workouts");
      navigate("/auth");
      return;
    }
    
    try {
      const {
        error
      } = await supabase
        .from("saved_workout_plans")
        .insert({
          user_id: session.session.user.id,
          plan_data: workoutPlan.plan_data,
          name: `Workout Plan - ${new Date().toLocaleDateString()}`
        });
      
      if (error) throw error;
      
      toast.success("Workout plan saved successfully!");
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout plan");
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out");
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
    handleSaveWorkout,
    handleSignOut
  };
}
