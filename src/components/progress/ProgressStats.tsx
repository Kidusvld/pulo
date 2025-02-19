
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface ProgressStatsProps {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  consistencyStreak: number;
}

export const ProgressStats = ({ 
  totalWorkouts, 
  totalVolume, 
  averageDuration, 
  consistencyStreak 
}: ProgressStatsProps) => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    averageDuration: 0,
    consistencyStreak: 0
  });

  const calculateStreak = useCallback((workouts: any[]) => {
    if (!workouts.length) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workoutDates = new Set(
      workouts.map(workout => 
        new Date(workout.created_at).toISOString().split('T')[0]
      )
    );

    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (workoutDates.has(dateStr)) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }

    return streak;
  }, []);

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
      const streak = calculateStreak(workouts || []);

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
  }, [calculateStreak]);

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
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-purple-900 flex items-center gap-2">
          <BarChart className="h-5 w-5 text-purple-600" />
          Progress Statistics
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-white hover:bg-red-50 hover:text-red-600 border-red-100 transition-all duration-200"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat) => (
          <Card key={stat.title} className="bg-white/900 backdrop-blur-sm border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-gray-600/90 uppercase">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-gray-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
