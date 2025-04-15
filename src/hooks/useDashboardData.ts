
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateStreak } from "@/components/progress/utils/calculateStreak";

// Generic type parameter to ensure consistency with the caller's Profile type
export function useDashboardData<T>() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<T | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<any | null>(null);
  const [progressStats, setProgressStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    averageDuration: 0,
    consistencyStreak: 0
  });
  const [muscleGroupData, setMuscleGroupData] = useState<Array<{
    muscle_group: string;
    total_volume: number;
  }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, age, weight")
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
          navigate("/onboarding");
          return;
        }
        
        setProfile({
          first_name: profileData.first_name,
          age: profileData.age,
          weight: profileData.weight,
          fitness_goal: planData?.fitness_goal || "build_muscle",
          workout_location: planData?.workout_location || "home",
          intensity_level: planData?.intensity_level || "beginner",
          equipment: planData?.equipment || []
        } as T);
        
        if (planData) {
          setWorkoutPlan(planData);
        }
        
        await fetchProgressStats(session.user.id);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error("Failed to load profile data");
        navigate("/auth");
      }
    };
    
    fetchData();
  }, [navigate]);
  
  const fetchProgressStats = async (userId: string) => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from("progress_tracking")
        .select("total_volume, workout_duration, created_at")
        .order("created_at", { ascending: false });
        
      if (progressError) throw progressError;
      
      const { data: muscleData, error: muscleError } = await supabase
        .from("muscle_group_tracking")
        .select("muscle_group, total_volume");
      
      if (muscleError) {
        console.error("Error fetching muscle group data:", muscleError);
      }
      
      const totalWorkouts = progressData?.length || 0;
      const totalVolume = progressData?.reduce((sum, record) => sum + (record.total_volume || 0), 0) || 0;
      const averageDuration = Math.round(progressData?.reduce((sum, record) => sum + (record.workout_duration || 0), 0) / (totalWorkouts || 1));
      
      const muscleGroupStats = muscleData ? muscleData.reduce((acc: any, curr) => {
        if (!curr) return acc;
        
        const group = curr.muscle_group;
        if (!group) return acc;
        
        if (!acc[group]) {
          acc[group] = {
            muscle_group: group,
            total_volume: 0
          };
        }
        acc[group].total_volume += curr.total_volume || 0;
        return acc;
      }, {}) : {};
      
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
  
  return {
    loading,
    profile,
    workoutPlan,
    progressStats,
    muscleGroupData,
    setProfile,
    setWorkoutPlan
  };
}
