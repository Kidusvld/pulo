
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface FormData {
  first_name: string;
  last_name: string;
  age: string;
  weight: string;
  fitness_goal: "lose_weight" | "build_muscle" | "stay_fit";
  workout_location: "home" | "gym";
  intensity_level: "beginner" | "intermediate" | "advanced";
  equipment: string[];
}

const initialFormData: FormData = {
  first_name: "",
  last_name: "",
  age: "",
  weight: "",
  fitness_goal: "stay_fit",
  workout_location: "home",
  intensity_level: "beginner",
  equipment: [],
};

export const useOnboardingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateWorkoutPlan = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: {
          userId,
          fitnessGoal: formData.fitness_goal,
          workoutLocation: formData.workout_location,
          intensityLevel: formData.intensity_level,
          equipment: formData.equipment
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating workout:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Please sign in to continue");
      navigate("/auth");
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          intensity_level: formData.intensity_level,
        })
        .eq("id", session.user.id);

      if (profileError) {
        throw new Error("Error saving profile");
      }

      toast.success("Profile saved, generating your workout plan...");

      const workoutPlan = await generateWorkoutPlan(session.user.id);

      const { error: planError } = await supabase
        .from('workout_plans')
        .insert({
          user_id: session.user.id,
          fitness_goal: formData.fitness_goal,
          workout_location: formData.workout_location,
          intensity_level: formData.intensity_level,
          equipment: formData.equipment,
          workout_frequency: 3,
          plan_data: workoutPlan as Json,
          is_active: true,
        });

      if (planError) {
        throw new Error("Error creating workout plan");
      }

      toast.success("Your workout plan is ready!");
      navigate("/profile");
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(error instanceof Error ? error.message : "Error saving data");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    updateFormData,
    handleSubmit,
  };
};
