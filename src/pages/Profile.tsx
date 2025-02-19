
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  weight: number | null;
  intensity_level?: string | null;
}

const Profile = () => {
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
              <Button variant="outline" className="text-purple-600">
                Save Plan
              </Button>
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Generate New Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
