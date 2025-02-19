
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  weight: number | null;
  intensity_level?: string | null;
}

interface WorkoutPlan {
  workouts: Array<{
    day: number;
    focus: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      rest: number;
      duration?: number;
    }>;
  }>;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else if (profileData) {
          setProfile(profileData);
        }
      }
    };

    fetchProfile();
  }, []);

  const generateWorkout = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: workoutPlan, error } = await supabase.functions.invoke('generate-workout', {
        body: {
          userId: user.id,
          intensityLevel: profile?.intensity_level || 'beginner'
        }
      });

      if (error) throw error;
      setCurrentPlan(workoutPlan);
      toast.success("New workout plan generated!");
    } catch (error) {
      console.error("Error generating workout:", error);
      toast.error("Failed to generate workout plan");
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!currentPlan) {
      toast.error("No workout plan to save");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('saved_workout_plans')
        .insert({
          user_id: user.id,
          plan_data: currentPlan,
          name: `Workout Plan - ${new Date().toLocaleDateString()}`
        });

      if (error) throw error;
      toast.success("Workout plan saved successfully!");
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save workout plan");
    }
  };

  const renderWorkoutPlan = () => {
    if (!currentPlan) return null;

    return (
      <div className="space-y-6">
        {currentPlan.workouts.map((workout, index) => (
          <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <h3 className="text-lg font-semibold text-purple-700 mb-3">
              Day {workout.day} - {workout.focus}
            </h3>
            <div className="space-y-3">
              {workout.exercises.map((exercise, exIndex) => (
                <div key={exIndex} className="bg-purple-50 rounded-lg p-4">
                  <p className="font-medium text-purple-900">{exercise.name}</p>
                  <p className="text-sm text-purple-700">
                    {exercise.sets} sets × {exercise.reps} reps
                    {exercise.duration ? ` (${exercise.duration}s)` : ''} • {exercise.rest}s rest
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-purple-600 mb-2">
              Welcome, {profile?.first_name}! 👋
            </h1>
            <p className="text-gray-600">
              Track your fitness journey and achieve your goals
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/saved-workouts">
              <Button variant="outline">Saved Plans</Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-purple-700">
              👤 Your Profile
            </h2>
            <Link to="/onboarding">
              <Button variant="ghost" className="flex items-center gap-2">
                Edit Profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-purple-400">Age</h3>
                <p className="text-2xl font-semibold">
                  {profile?.age || '-'} years
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-purple-400">Weight</h3>
                <p className="text-2xl font-semibold">
                  {profile?.weight || '-'} lbs
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-purple-400">
                  Workout Intensity
                </h3>
                <p className="text-2xl font-semibold capitalize">
                  {profile?.intensity_level?.replace('_', ' ') || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-purple-700">
              💪 Your Workout Plan
            </h2>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="text-purple-600"
                onClick={savePlan}
                disabled={!currentPlan || loading}
              >
                Save Plan
              </Button>
              <Button 
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={generateWorkout}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate New Plan"}
              </Button>
            </div>
          </div>
          {currentPlan && renderWorkoutPlan()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
