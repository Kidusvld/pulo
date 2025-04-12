
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface Profile {
  first_name: string;
  age: number;
  weight: number;
  fitness_goal: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workout_location: "home" | "gym";
  intensity_level: "easy" | "moderate" | "hard" | "intense" | "beginner" | "intermediate" | "advanced";
  equipment: string[];
  subscription_status?: "free" | "pro";
  subscription_end_date?: string;
}

export const useProfileData = (userId: string | null) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    if (!userId) return null;
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, age, weight, subscription_status, subscription_end_date")
        .eq("id", userId)
        .single();
      
      if (profileError || !profileData?.age || !profileData?.weight || !profileData?.first_name) {
        navigate("/onboarding");
        return null;
      }
      
      return profileData;
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Failed to load profile data");
      return null;
    }
  };

  const updateProfile = async (weight: number) => {
    if (!userId) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ weight })
        .eq("id", userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
      return false;
    }
  };

  return {
    profile,
    setProfile,
    fetchProfile,
    updateProfile
  };
};
