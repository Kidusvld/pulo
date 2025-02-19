
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DumbbellIcon, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  weight: number | null;
  fitness_goal?: string | null;
  workout_location?: string | null;
  intensity_level?: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-purple-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-100/50 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-blue-100/50 blur-3xl bottom-20 right-20 -z-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">
            Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
          </h1>
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                </div>
                {profile?.age && (
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{profile.age} years</p>
                  </div>
                )}
                {profile?.weight && (
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{profile.weight} lbs</p>
                  </div>
                )}
                {profile?.fitness_goal && (
                  <div>
                    <p className="text-sm text-gray-500">Fitness Goal</p>
                    <p className="font-medium capitalize">{profile.fitness_goal.replace('_', ' ')}</p>
                  </div>
                )}
                {profile?.workout_location && (
                  <div>
                    <p className="text-sm text-gray-500">Preferred Location</p>
                    <p className="font-medium capitalize">{profile.workout_location}</p>
                  </div>
                )}
                {profile?.intensity_level && (
                  <div>
                    <p className="text-sm text-gray-500">Intensity Level</p>
                    <p className="font-medium capitalize">{profile.intensity_level}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generate Workout Card */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Generate New Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create a personalized workout plan based on your goals and preferences.
              </p>
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <DumbbellIcon className="h-5 w-5" />
                Generate Workout
              </Link>
            </CardContent>
          </Card>

          {/* Saved Workouts Card */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Saved Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access your previously generated workout plans.
              </p>
              <Link
                to="/saved-workouts"
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
              >
                View Saved Workouts
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
