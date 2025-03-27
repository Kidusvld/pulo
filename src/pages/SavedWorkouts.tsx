
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

// Helper function to determine the appropriate icon for an exercise
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
    // Default icon for other exercises
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80")',
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Saved Workout Plans</h1>
            <Button 
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-purple-50 hover:text-purple-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {savedWorkouts.length === 0 ? (
            <Card className="bg-white/95 backdrop-blur-sm border-purple-100">
              <CardContent className="text-center py-12">
                <DumbbellIcon className="h-12 w-12 text-purple-200 mx-auto mb-4" />
                <p className="text-gray-500">
                  No saved workout plans yet. Generate and save some plans from the dashboard!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {savedWorkouts.map((workout) => (
                <Card key={workout.id} className="bg-white/95 backdrop-blur-sm border-purple-100">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <DumbbellIcon className="h-5 w-5 text-purple-600" />
                      {workout.name || "Workout Plan"}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        Saved on {format(new Date(workout.saved_at), 'MMM d, yyyy')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(workout.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {workout.plan_data.workouts.map((day, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            Day {day.day}
                          </h3>
                          <div className="grid gap-4">
                            {day.exercises.map((exercise, exerciseIndex) => (
                              <div
                                key={exerciseIndex}
                                className="bg-purple-50/50 p-4 rounded-lg border border-purple-100"
                              >
                                <p className="font-medium text-gray-900 flex items-center">
                                  {getExerciseIcon(exercise.name)}
                                  {exercise.name}
                                </p>
                                <p className="text-sm text-gray-600 ml-6">
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
    </div>
  );
};

export default SavedWorkouts;
