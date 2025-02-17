
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WorkoutPlan {
  id: string;
  plan_data: {
    workouts?: Array<{
      day: number;
      exercises: Array<{
        name: string;
        sets: number;
        reps: number;
        rest: number;
      }>;
    }>;
  };
  created_at: string;
}

interface Profile {
  first_name: string;
  age: number;
  weight: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if profile is complete
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("age, weight, first_name")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profileData?.age || !profileData?.weight || !profileData?.first_name) {
      navigate("/onboarding");
      return;
    }

    setProfile(profileData);

    // Fetch active workout plan
    const { data: planData, error: planError } = await supabase
      .from("workout_plans")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .single();

    if (!planError && planData) {
      setWorkoutPlan(planData);
    }

    setLoading(false);
  };

  const generateNewPlan = async () => {
    setGeneratingPlan(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }

    // For now, generate a simple workout plan
    const newPlan = {
      workouts: Array.from({ length: 3 }, (_, i) => ({
        day: i + 1,
        exercises: [
          {
            name: "Push-ups",
            sets: 3,
            reps: 10,
            rest: 60
          },
          {
            name: "Squats",
            sets: 3,
            reps: 12,
            rest: 60
          }
        ]
      }))
    };

    const { data: plan, error } = await supabase
      .from("workout_plans")
      .update({ 
        plan_data: newPlan,
        created_at: new Date().toISOString()
      })
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .select()
      .single();

    if (error) {
      toast.error("Failed to generate workout plan");
      setGeneratingPlan(false);
      return;
    }

    setWorkoutPlan(plan);
    setGeneratingPlan(false);
    toast.success("New workout plan generated!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}
          </h1>
          <Button 
            variant="outline" 
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-lg font-medium">{profile?.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-lg font-medium">{profile?.weight} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workout Plan */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Workout Plan</CardTitle>
              <Button
                onClick={generateNewPlan}
                disabled={generatingPlan}
              >
                {generatingPlan ? "Generating..." : "Generate New Plan"}
              </Button>
            </CardHeader>
            <CardContent>
              {workoutPlan?.plan_data?.workouts ? (
                <div className="space-y-6">
                  {workoutPlan.plan_data.workouts.map((workout, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="font-semibold">Day {workout.day}</h3>
                      <div className="grid gap-4">
                        {workout.exercises.map((exercise, exerciseIndex) => (
                          <div
                            key={exerciseIndex}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-gray-500">
                              {exercise.sets} sets × {exercise.reps} reps
                              (Rest: {exercise.rest}s)
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No workout plan generated yet. Click the button above to create one!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
