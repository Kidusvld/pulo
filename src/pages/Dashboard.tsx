
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { WorkoutForm } from "@/components/progress/WorkoutForm";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, DumbbellIcon, Trophy, Calendar, LogOut, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProgressData {
  id: string;
  total_volume: number;
  workout_duration: number;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else if (profileData) {
          setFirstName(profileData.first_name);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
    } else {
      navigate('/auth');
    }
  };

  const fetchProgressData = async (): Promise<ProgressData[]> => {
    const { data, error } = await supabase
      .from('progress_tracking')
      .select('id, total_volume, workout_duration, created_at');

    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  };

  const { data: progressData, isLoading, isError } = useQuery({
    queryKey: ['progress'],
    queryFn: fetchProgressData
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const totalWorkouts = progressData.length;
  const totalVolume = progressData.reduce((sum, record) => sum + (record.total_volume || 0), 0);
  const averageDuration = totalWorkouts ? 
    Math.round(progressData.reduce((sum, record) => sum + (record.workout_duration || 0), 0) / totalWorkouts) : 
    0;
  const consistencyStreak = 7; // This could be calculated based on workout dates

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-purple-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-100/50 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-blue-100/50 blur-3xl bottom-20 right-20 -z-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">
            Welcome back{firstName ? `, ${firstName}` : ''}!
          </h1>
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <ProgressStats
          totalWorkouts={totalWorkouts}
          totalVolume={totalVolume}
          averageDuration={averageDuration}
          consistencyStreak={consistencyStreak}
        />

        <div className="mt-8">
          <WorkoutForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
