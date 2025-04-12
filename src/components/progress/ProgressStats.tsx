
import { Activity, Dumbbell, Clock, Target, RotateCcw, BarChart } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatCard } from "./StatCard";
import { calculateStreak } from "./utils/calculateStreak";
import { ProgressStats as ProgressStatsType, ProgressStatsProps, WorkoutData } from "./types";

export const ProgressStats = ({ 
  totalWorkouts, 
  totalVolume, 
  averageDuration, 
  consistencyStreak 
}: ProgressStatsProps) => {
  const [stats, setStats] = useState<ProgressStatsType>({
    totalWorkouts: 0,
    totalVolume: 0,
    averageDuration: 0,
    consistencyStreak: 0
  });

  const handleResetStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to reset stats");
        return;
      }

      const { error } = await supabase
        .from('progress_tracking')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;

      setStats({
        totalWorkouts: 0,
        totalVolume: 0,
        averageDuration: 0,
        consistencyStreak: 0
      });

      toast.success("Progress stats have been reset successfully");
    } catch (error) {
      console.error('Error resetting stats:', error);
      toast.error("Failed to reset progress stats");
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: workouts, error } = await supabase
        .from('progress_tracking')
        .select('workout_duration, total_volume, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { totalVolume, totalDuration } = workouts?.reduce((acc, workout) => ({
        totalVolume: acc.totalVolume + (workout.total_volume || 0),
        totalDuration: acc.totalDuration + (workout.workout_duration || 0)
      }), { totalVolume: 0, totalDuration: 0 }) || { totalVolume: 0, totalDuration: 0 };

      const totalWorkouts = workouts?.length || 0;
      const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
      const streak = calculateStreak(workouts as WorkoutData[] || []);

      setStats({
        totalWorkouts,
        totalVolume,
        averageDuration,
        consistencyStreak: streak
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load workout statistics');
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel('progress-tracking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress_tracking'
        },
        fetchStats
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStats]);

  const statItems = useMemo(() => [
    {
      title: "Total Workouts",
      value: stats.totalWorkouts,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Volume",
      value: `${stats.totalVolume.toLocaleString()} lbs`,
      icon: Dumbbell,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg. Duration",
      value: `${stats.averageDuration} min`,
      icon: Clock,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Streak",
      value: `${stats.consistencyStreak} days`,
      icon: Target,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ], [stats]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2 font-montserrat">
          <BarChart className="h-5 w-5 text-purple-300" />
          Progress Statistics
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-white/10 hover:bg-red-500/20 hover:text-white border-red-300/20 text-red-100/80 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Stats
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Progress Statistics</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset all your progress statistics? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetStats}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statItems.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};
