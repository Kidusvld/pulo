
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "sonner";
import { Activity, Clock, Dumbbell, ThermometerSun } from "lucide-react";

interface WorkoutLog {
  id: string;
  created_at: string;
  workout_duration: number;
  total_volume: number;
  mood: string | null;
  energy_level: number;
  muscle_groups: {
    muscle_group: string;
    total_weight: number;
  }[];
}

const WorkoutLogs = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutLogs();
  }, []);

  const fetchWorkoutLogs = async () => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from("progress_tracking")
        .select(`
          id,
          created_at,
          workout_duration,
          total_volume,
          mood,
          energy_level,
          muscle_group_tracking (
            muscle_group,
            total_weight
          )
        `)
        .order("created_at", { ascending: false });

      if (progressError) throw progressError;

      const formattedLogs = progressData?.map(log => ({
        ...log,
        muscle_groups: log.muscle_group_tracking || []
      })) || [];

      setLogs(formattedLogs);
    } catch (error) {
      console.error("Error fetching workout logs:", error);
      toast.error("Failed to load workout logs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Loading workout logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-900 mb-8">Workout History</h1>
        <div className="space-y-6">
          {logs.length === 0 ? (
            <p className="text-center text-gray-600">No workout logs found. Start logging your workouts!</p>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="bg-white/90 backdrop-blur-sm border-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-purple-900">
                      {format(new Date(log.created_at), "MMMM d, yyyy")}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(log.created_at), "h:mm a")}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span>{log.workout_duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Dumbbell className="h-5 w-5 text-purple-600" />
                      <span>{log.total_volume.toLocaleString()} lbs</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Activity className="h-5 w-5 text-purple-600" />
                      <span>Energy Level: {log.energy_level}/5</span>
                    </div>
                    {log.mood && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <ThermometerSun className="h-5 w-5 text-purple-600" />
                        <span>Mood: {log.mood}</span>
                      </div>
                    )}
                  </div>
                  {log.muscle_groups.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Muscle Groups Trained:</h3>
                      <div className="flex flex-wrap gap-2">
                        {log.muscle_groups.map((mg, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm"
                          >
                            {mg.muscle_group} ({mg.total_weight.toLocaleString()} lbs)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogs;
