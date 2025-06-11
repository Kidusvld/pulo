
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
import { motion } from "framer-motion";

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
      title: "Workouts",
      value: stats.totalWorkouts,
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Volume",
      value: `${stats.totalVolume.toLocaleString()} lbs`,
      icon: Dumbbell,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg Duration",
      value: `${stats.averageDuration} min`,
      icon: Clock,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Streak",
      value: `${stats.consistencyStreak} days`,
      icon: Target,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
    },
  ], [stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex justify-between items-center mb-4"
        variants={itemVariants}
      >
        <h2 className="text-xl md:text-2xl font-montserrat font-bold text-slate-800 flex items-center gap-3 tracking-tight">
          <BarChart className="h-6 w-6 text-indigo-600" />
          Your Progress
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700 transition-all duration-300 font-montserrat font-semibold shadow-sm hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-montserrat font-bold text-xl">Reset Progress Statistics</AlertDialogTitle>
              <AlertDialogDescription className="font-opensans text-base leading-relaxed">
                Are you sure you want to reset all your progress statistics? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-montserrat font-semibold">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetStats}
                className="bg-red-600 hover:bg-red-700 text-white font-montserrat font-semibold"
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {statItems.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants} custom={index}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
