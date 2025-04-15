
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Generic type parameter to ensure consistent interface with caller
export const useProfileEditor = <T extends {
  first_name?: string;
  age: number;
  weight: number;
  fitness_goal?: any;
  workout_location?: any;
  intensity_level?: any;
  equipment?: string[];
}>(
  profile: T | null, 
  setProfile: (profile: T) => void, 
  workoutPlan: any,
  setWorkoutPlan: (plan: any) => void
) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState<string>("");
  const [editedAge, setEditedAge] = useState<string>("");
  const [editedIntensity, setEditedIntensity] = useState<string>("moderate");
  const [editedFitnessGoal, setEditedFitnessGoal] = useState<string>("build_muscle");
  const [editedWorkoutLocation, setEditedWorkoutLocation] = useState<string>("home");

  const mapToLegacyIntensity = (intensity: string): "beginner" | "intermediate" | "advanced" => {
    switch(intensity) {
      case "easy": return "beginner";
      case "moderate": return "intermediate";
      case "hard": 
      case "intense": return "advanced";
      case "beginner": return "beginner";
      case "intermediate": return "intermediate";
      case "advanced": return "advanced";
      default: return "intermediate";
    }
  };

  const mapToLegacyFitnessGoal = (goal: string): "build_muscle" | "lose_fat" | "increase_mobility" => {
    if (goal === "stay_active") return "build_muscle";
    
    if (goal === "build_muscle" || goal === "lose_fat" || goal === "increase_mobility") {
      return goal as "build_muscle" | "lose_fat" | "increase_mobility";
    }
    
    return "build_muscle";
  };

  const handleEditToggle = () => {
    if (!profile) return;
    
    let initialIntensity = profile?.intensity_level || "moderate";
    if (["beginner", "intermediate", "advanced"].includes(initialIntensity)) {
      switch(initialIntensity) {
        case "beginner": initialIntensity = "easy"; break;
        case "intermediate": initialIntensity = "moderate"; break;
        case "advanced": initialIntensity = "hard"; break;
      }
    }
    
    setEditedWeight(profile?.weight?.toString() || "");
    setEditedAge(profile?.age?.toString() || "");
    setEditedIntensity(initialIntensity);
    setEditedFitnessGoal(profile?.fitness_goal || "build_muscle");
    setEditedWorkoutLocation(profile?.workout_location || "home");
    setIsEditing(true);
  };

  const handleUpdateProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
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
    
    const age = parseInt(editedAge);
    if (isNaN(age) || age <= 0) {
      toast.error("Please enter a valid age");
      return;
    }
    
    try {
      const { error: profileError } = await supabase.from("profiles").update({
        weight,
        age
      }).eq("id", session.user.id);
      
      if (profileError) throw profileError;
      
      const intensityToSave = mapToLegacyIntensity(editedIntensity);
      const fitnessGoalToSave = mapToLegacyFitnessGoal(editedFitnessGoal);
      
      const { error: planError } = await supabase.from("workout_plans").update({
        intensity_level: intensityToSave,
        fitness_goal: fitnessGoalToSave,
        workout_location: editedWorkoutLocation as "home" | "gym",
        is_active: true
      }).eq("user_id", session.user.id).eq("is_active", true);
      
      if (planError) throw planError;
      
      const updatedProfile = {
        ...profile,
        weight,
        age,
        intensity_level: editedIntensity as any,
        fitness_goal: editedFitnessGoal as any,
        workout_location: editedWorkoutLocation as any
      };
      
      setProfile(updatedProfile);
      
      if (workoutPlan) {
        setWorkoutPlan({
          ...workoutPlan,
          intensity_level: intensityToSave,
          fitness_goal: fitnessGoalToSave,
          workout_location: editedWorkoutLocation
        });
      }
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };
  
  return {
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
  };
};
