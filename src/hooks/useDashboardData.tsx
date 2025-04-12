import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
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

interface WorkoutPlan {
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

interface ProgressStats {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  consistencyStreak: number;
}

interface MuscleGroupData {
  muscle_group: string;
  total_volume: number;
}

export function useDashboardData() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalWorkouts: 0,
    totalVolume: 0,
    averageDuration: 0,
    consistencyStreak: 0
  });
  const [muscleGroupData, setMuscleGroupData] = useState<MuscleGroupData[]>([]);

  const checkAuth = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, age, weight, subscription_status, subscription_end_date")
        .eq("id", session.user.id)
        .single();
      
      if (profileError || !profileData?.age || !profileData?.weight || !profileData?.first_name) {
        navigate("/onboarding");
        return;
      }
      
      const { data: planData, error: planError } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .maybeSingle();
      
      if (planError) {
        console.error('Error loading workout plan:', planError);
        toast.error("Failed to load workout plan");
      }
      
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
        setWorkoutPlan(planData as WorkoutPlan);
      }
      
      await fetchProgressStats();
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Failed to load profile data");
      navigate("/auth");
    }
  };

  const fetchProgressStats = async () => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from("progress_tracking")
        .select("total_volume, workout_duration")
        .order("created_at", { ascending: false });
      
      if (progressError) throw progressError;
      
      const { data: muscleData, error: muscleError } = await supabase
        .from("muscle_group_tracking")
        .select("muscle_group, total_weight");
      
      if (muscleError) throw muscleError;
      
      const totalWorkouts = progressData?.length || 0;
      const totalVolume = progressData?.reduce((sum, record) => sum + (record.total_volume || 0), 0) || 0;
      const averageDuration = Math.round(
        progressData?.reduce((sum, record) => sum + (record.workout_duration || 0), 0) / (totalWorkouts || 1)
      );
      
      const muscleGroupStats = muscleData?.reduce((acc: Record<string, MuscleGroupData>, curr) => {
        const group = curr.muscle_group;
        if (!acc[group]) {
          acc[group] = {
            muscle_group: group,
            total_volume: 0
          };
        }
        acc[group].total_volume += curr.total_weight || 0;
        return acc;
      }, {});
      
      setProgressStats({
        totalWorkouts,
        totalVolume,
        averageDuration,
        consistencyStreak: calculateStreak(progressData || [])
      });
      
      setMuscleGroupData(Object.values(muscleGroupStats || {}));
    } catch (error) {
      console.error("Error fetching progress stats:", error);
      toast.error("Failed to load progress statistics");
    }
  };

  const calculateStreak = (progressData: any[]) => {
    let streak = 0;
    const today = new Date();
    const dailyWorkouts = progressData.reduce((acc: Record<string, boolean>, curr) => {
      const date = new Date(curr.created_at).toDateString();
      acc[date] = true;
      return acc;
    }, {});
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (dailyWorkouts[date.toDateString()]) {
        streak++;
      } else break;
    }
    return streak;
  };

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return {
    loading,
    profile,
    workoutPlan,
    progressStats,
    muscleGroupData
  };
}

export type { Profile, WorkoutPlan, ProgressStats, MuscleGroupData };
