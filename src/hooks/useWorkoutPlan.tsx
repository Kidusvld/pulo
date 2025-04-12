
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface WorkoutPlan {
  id: string;
  plan_data: {
    workouts?: Array<{
      day: number;
      exercises: Array<{
        name: string;
        sets: number;
        reps?: number;
        duration?: number;
        rest: number;
      }>;
    }>;
  };
  created_at: string;
  fitness_goal: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workout_location: "home" | "gym";
  intensity_level: "easy" | "moderate" | "hard" | "intense" | "beginner" | "intermediate" | "advanced";
  equipment: string[];
}

export const useWorkoutPlan = (userId: string | null) => {
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const fetchWorkoutPlan = async () => {
    if (!userId) return null;
    
    try {
      const { data: planData, error: planError } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle();
      
      if (planError) {
        console.error('Error loading workout plan:', planError);
        toast.error("Failed to load workout plan");
        return null;
      }
      
      return planData as WorkoutPlan;
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      return null;
    }
  };

  // Map intensity levels between legacy and new format
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

  // Map fitness goals to database format
  const mapToLegacyFitnessGoal = (goal: string): "build_muscle" | "lose_fat" | "increase_mobility" => {
    if (goal === "stay_active") return "build_muscle";
    
    if (goal === "build_muscle" || goal === "lose_fat" || goal === "increase_mobility") {
      return goal as "build_muscle" | "lose_fat" | "increase_mobility";
    }
    
    return "build_muscle";
  };

  const updateWorkoutPlan = async (intensity: string, fitnessGoal: string, workoutLocation: string) => {
    if (!userId) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return false;
    }
    
    try {
      const intensityToSave = mapToLegacyIntensity(intensity);
      const fitnessGoalToSave = mapToLegacyFitnessGoal(fitnessGoal);
      
      const { error } = await supabase
        .from("workout_plans")
        .update({
          intensity_level: intensityToSave,
          fitness_goal: fitnessGoalToSave,
          workout_location: workoutLocation as "home" | "gym",
          is_active: true
        })
        .eq("user_id", userId)
        .eq("is_active", true);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating workout plan:', error);
      toast.error("Failed to update workout plan");
      return false;
    }
  };

  const generateNewWorkoutPlan = async (profile: any, numberOfDays: number) => {
    if (!userId || !profile) return false;
    
    setGeneratingPlan(true);
    
    try {
      const intensityToUse = mapToLegacyIntensity(profile.intensity_level || "intermediate");
      const fitnessGoalToUse = mapToLegacyFitnessGoal(profile.fitness_goal || "build_muscle");
      
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
      
      const { error: deactivateError } = await supabase
        .from("workout_plans")
        .update({ is_active: false })
        .eq("user_id", userId);
      
      if (deactivateError) {
        throw new Error('Failed to deactivate existing workout plans');
      }
      
      const { data: plan, error: createError } = await supabase
        .from("workout_plans")
        .insert([{
          user_id: userId,
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
      setWorkoutPlan(plan as WorkoutPlan);
      return true;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate workout plan");
      return false;
    } finally {
      setGeneratingPlan(false);
    }
  };

  const saveCurrentWorkout = async () => {
    if (!userId || !workoutPlan) {
      toast.error("No workout plan to save");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from("saved_workout_plans")
        .insert({
          user_id: userId,
          plan_data: workoutPlan.plan_data,
          name: `Workout Plan - ${new Date().toLocaleDateString()}`
        });
      
      if (error) throw error;
      
      toast.success("Workout plan saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout plan");
      return false;
    }
  };

  return {
    workoutPlan,
    setWorkoutPlan,
    generatingPlan,
    fetchWorkoutPlan,
    updateWorkoutPlan,
    generateNewWorkoutPlan,
    saveCurrentWorkout
  };
};
