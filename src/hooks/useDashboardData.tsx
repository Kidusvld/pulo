
import { useState } from "react";
import { useAuth } from "./useAuth";
import { useProfileData, Profile } from "./useProfileData";
import { useWorkoutPlan, WorkoutPlan } from "./useWorkoutPlan";
import { useProgressStats, ProgressStats, MuscleGroupData } from "./useProgressStats";

export function useDashboardData() {
  const { loading: authLoading, setLoading, userId, checkAuth } = useAuth();
  const { profile, setProfile, fetchProfile } = useProfileData(userId);
  const { workoutPlan, setWorkoutPlan, fetchWorkoutPlan } = useWorkoutPlan(userId);
  const { progressStats, muscleGroupData, fetchProgressStats } = useProgressStats(userId);
  const [loading, setDashboardLoading] = useState(true);

  const fetchAllData = async () => {
    const uid = await checkAuth();
    if (!uid) return;
    
    try {
      const profileData = await fetchProfile();
      if (!profileData) return;
      
      const planData = await fetchWorkoutPlan();
      
      setProfile({
        first_name: profileData.first_name,
        age: profileData.age,
        weight: profileData.weight,
        fitness_goal: planData?.fitness_goal || "build_muscle",
        workout_location: planData?.workout_location || "home",
        intensity_level: planData?.intensity_level || "beginner",
        equipment: planData?.equipment || [],
        subscription_status: profileData.subscription_status || "free",
        subscription_end_date: profileData.subscription_end_date
      });
      
      if (planData) {
        setWorkoutPlan(planData);
      }
      
      await fetchProgressStats();
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setDashboardLoading(false);
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setDashboardLoading(true);
    setLoading(true);
    await fetchAllData();
  };

  return {
    loading: authLoading || loading,
    profile,
    workoutPlan,
    progressStats,
    muscleGroupData,
    refreshData
  };
}

export type { Profile, WorkoutPlan, ProgressStats, MuscleGroupData };
