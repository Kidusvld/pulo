
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProgressStats {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  consistencyStreak: number;
}

export interface MuscleGroupData {
  muscle_group: string;
  total_volume: number;
}

export const useProgressStats = (userId: string | null) => {
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalWorkouts: 0,
    totalVolume: 0,
    averageDuration: 0,
    consistencyStreak: 0
  });
  const [muscleGroupData, setMuscleGroupData] = useState<MuscleGroupData[]>([]);

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

  const fetchProgressStats = async () => {
    if (!userId) return;
    
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

  return {
    progressStats,
    muscleGroupData,
    fetchProgressStats
  };
};
