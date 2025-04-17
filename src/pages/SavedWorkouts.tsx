
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, ArrowLeft, DumbbellIcon, Trash2, Weight, Bike, Activity, Heart, Send, Phone } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Json } from "@/integrations/supabase/types";

interface Exercise {
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  rest: number;
}

interface Workout {
  day: number;
  exercises: Exercise[];
}

interface SavedWorkout {
  id: string;
  user_id: string;
  plan_data: {
    workouts: Workout[];
  };
  saved_at: string;
  name: string | null;
  targeted_body_parts?: string[];
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendingSMS, setSendingSMS] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

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
      
      // Properly cast the data to ensure type safety
      const typedData = data?.map(item => ({
        ...item,
        plan_data: item.plan_data as unknown as { workouts: Workout[] }
      })) as SavedWorkout[];
      
      setSavedWorkouts(typedData);
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

  const handleSendSMS = async (workoutId: string) => {
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setSendingSMS(true);
    const workout = savedWorkouts.find(w => w.id === workoutId);
    
    try {
      // Format workout plan for SMS
      const workoutText = formatWorkoutForSMS(workout);
      
      // Call Supabase Edge Function to send SMS
      const { data, error } = await supabase.functions.invoke('send-workout-sms', {
        body: {
          phone: phoneNumber,
          workoutText: workoutText,
          workoutName: workout?.name || "Workout Plan"
        }
      });

      if (error) throw error;
      
      toast.success("Workout plan sent to your phone!");
      setPhoneNumber("");
      setSelectedWorkoutId(null);
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("Failed to send workout plan to your phone");
    } finally {
      setSendingSMS(false);
    }
  };

  // Format workout for SMS
  const formatWorkoutForSMS = (workout: SavedWorkout | undefined) => {
    if (!workout) return "";
    
    let smsText = `${workout.name || "PULO Workout Plan"}\n\n`;
    
    workout.plan_data.workouts.forEach(day => {
      smsText += `Day ${day.day}:\n`;
      day.exercises.forEach(exercise => {
        const repsOrDuration = exercise.duration 
          ? `${exercise.duration} seconds` 
          : `${exercise.reps} reps`;
        smsText += `- ${exercise.name}: ${exercise.sets} sets x ${repsOrDuration} (${exercise.rest}s rest)\n`;
      });
      smsText += "\n";
    });
    
    smsText += "Powered by PULO Fitness";
    return smsText;
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
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedWorkoutId(workout.id)}
                          className="text-white bg-purple-600/40 hover:bg-purple-600/60 border-purple-400/20"
                        >
                          <Send className="h-4 w-4 mr-1.5" />
                          Send to Phone
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white/95 backdrop-blur-md border-purple-200">
                        <DialogHeader>
                          <DialogTitle className="text-purple-900">Send Workout to Phone</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex flex-col space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                              <Phone className="h-4 w-4 text-purple-500 mr-2" />
                              Enter Phone Number
                            </label>
                            <Input
                              id="phone"
                              placeholder="e.g. +1 555 123 4567"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="border-purple-100 focus:border-purple-300"
                            />
                            <p className="text-xs text-gray-500">
                              Enter your full phone number including country code (e.g. +1 for US)
                            </p>
                          </div>
                          <div className="flex justify-end gap-4">
                            <DialogClose asChild>
                              <Button variant="outline" className="border-purple-200">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button 
                              onClick={() => handleSendSMS(workout.id)} 
                              disabled={sendingSMS}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              {sendingSMS ? "Sending..." : "Send Workout"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
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
                                {exercise.sets} sets × {exercise.duration ? `${exercise.duration} sec` : `${exercise.reps} reps`}
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
