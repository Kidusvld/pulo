import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, ArrowLeft, DumbbellIcon, Trash2, Weight, Bike, Activity, Heart } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface SavedWorkout {
  id: string;
  user_id: string;
  plan_data: {
    workouts: Array<{
      day: number;
      exercises: Array<{
        name: string;
        sets: number;
        reps: number;
        rest: number;
      }>;
    }>;
  };
  saved_at: string;
  name: string | null;
}

const getExerciseIcon = (exerciseName: string) => {
  const name = exerciseName.toLowerCase();
  
  if (name.includes("dumbbell") || name.includes("curl") || name.includes("press") || name.includes("fly")) {
    return <DumbbellIcon className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else if (name.includes("barbell") || name.includes("deadlift") || name.includes("bench") || name.includes("squat")) {
    return <Weight className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else if (name.includes("bike") || name.includes("cycling")) {
    return <Bike className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else if (name.includes("run") || name.includes("sprint") || name.includes("jog")) {
    return <Activity className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else if (name.includes("stretch") || name.includes("yoga") || name.includes("mobility")) {
    return <Heart className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else {
    return <DumbbellIcon className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  }
};

const SavedWorkouts = () => {
  const navigate = useNavigate();
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedWorkouts();
  }, []);

  const loadSavedWorkouts = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("saved_workout_plans")
        .select()
        .order("saved_at", { ascending: false });

      if (error) throw error;
      setSavedWorkouts(data as SavedWorkout[]);
    } catch (error) {
      console.error("Error loading saved workouts:", error);
      toast.error("Failed to load saved workouts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_workout_plans")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSavedWorkouts(prev => prev.filter(workout => workout.id !== id));
      toast.success("Workout plan deleted successfully");
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast.error("Failed to delete workout plan");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-purple-900 via-deep-purple-800 to-deep-purple-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-purple-900 via-deep-purple-800 to-deep-purple-900">
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-500/10 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-600/10 blur-3xl bottom-20 right-20 -z-10"></div>
        
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Saved Workout Plans</h1>
          <Button 
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="bg-white/10 hover:bg-white/20 text-white border-purple-300/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {savedWorkouts.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border-purple-300/20">
            <CardContent className="text-center py-12">
              <DumbbellIcon className="h-12 w-12 text-purple-200 mx-auto mb-4" />
              <p className="text-white/80">
                No saved workout plans yet. Generate and save some plans from the dashboard!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {savedWorkouts.map((workout) => (
              <Card key={workout.id} className="bg-white/10 backdrop-blur-sm border-purple-300/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                    <DumbbellIcon className="h-5 w-5 text-purple-300" />
                    {workout.name || "Workout Plan"}
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-purple-200">
                      Saved on {format(new Date(workout.saved_at), 'MMM d, yyyy')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(workout.id)}
                      className="text-white/70 hover:bg-red-900/30 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {workout.plan_data.workouts.map((day, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-white">
                          <Calendar className="h-4 w-4 text-purple-300" />
                          Day {day.day}
                        </h3>
                        <div className="grid gap-4">
                          {day.exercises.map((exercise, exerciseIndex) => (
                            <div
                              key={exerciseIndex}
                              className="bg-white/5 p-4 rounded-lg border border-purple-300/20"
                            >
                              <p className="font-medium text-white flex items-center">
                                {getExerciseIcon(exercise.name)}
                                {exercise.name}
                              </p>
                              <p className="text-sm text-purple-200 ml-6">
                                {exercise.sets} sets × {exercise.reps} reps
                                (Rest: {exercise.rest}s)
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedWorkouts;
