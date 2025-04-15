
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Use generic type parameter to ensure consistency with caller's Profile type
export const useWorkoutPlan = <T extends {
  age: number;
  weight: number;
  workout_location?: string;
  intensity_level?: string;
  equipment?: string[];
  fitness_goal?: string;
}>(
  profile: T | null, 
  workoutPlan: any, 
  setWorkoutPlan: (plan: any) => void
) => {
  const navigate = useNavigate();
  const [numberOfDays, setNumberOfDays] = useState<number>(3);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  
  const mapToLegacyIntensity = (intensity: string | undefined): "beginner" | "intermediate" | "advanced" => {
    if (!intensity) return "intermediate";
    
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

  const mapToLegacyFitnessGoal = (goal: string | undefined): "build_muscle" | "lose_fat" | "increase_mobility" => {
    if (!goal) return "build_muscle";
    if (goal === "stay_active") return "build_muscle";
    
    if (goal === "build_muscle" || goal === "lose_fat" || goal === "increase_mobility") {
      return goal as "build_muscle" | "lose_fat" | "increase_mobility";
    }
    
    return "build_muscle";
  };
  
  const generateNewPlan = async () => {
    if (!profile) return;
    setGeneratingPlan(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }
    
    try {
      const intensityToUse = mapToLegacyIntensity(profile.intensity_level);
      const fitnessGoalToUse = mapToLegacyFitnessGoal(profile.fitness_goal);
      
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
      
      console.log('Saving workout plan:', {
        userId: session.user.id,
        fitnessGoal: fitnessGoalToUse,
        workoutLocation: profile.workout_location,
        intensityLevel: intensityToUse,
        equipment: profile.equipment,
        planData: aiResponse
      });
      
      const { error: deactivateError } = await supabase.from("workout_plans").update({
        is_active: false
      }).eq("user_id", session.user.id);
      
      if (deactivateError) {
        throw new Error('Failed to deactivate existing workout plans');
      }
      
      const { data: plan, error: createError } = await supabase.from("workout_plans").insert([{
        user_id: session.user.id,
        fitness_goal: fitnessGoalToUse,
        workout_location: profile.workout_location,
        intensity_level: intensityToUse,
        equipment: profile.equipment,
        plan_data: aiResponse,
        is_active: true,
        workout_frequency: numberOfDays
      }]).select().single();
      
      if (createError) {
        throw new Error('Failed to save new workout plan');
      }
      
      if (!plan) {
        throw new Error('No workout plan returned after save');
      }
      
      setWorkoutPlan(plan);
      toast.success("New workout plan generated!");
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate workout plan");
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!workoutPlan) {
      toast.error("No workout plan to save");
      return;
    }
    
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      toast.error("Please sign in to save workouts");
      navigate("/auth");
      return;
    }
    
    try {
      const { error } = await supabase.from("saved_workout_plans").insert({
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
  
  return {
    numberOfDays,
    generatingPlan,
    setNumberOfDays,
    generateNewPlan,
    handleSaveWorkout
  };
};
