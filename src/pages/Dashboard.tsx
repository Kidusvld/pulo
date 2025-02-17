
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("age, weight, first_name")
      .eq("id", session.user.id)
      .single();

    if (error || !profile?.age || !profile?.weight || !profile?.first_name) {
      navigate("/onboarding");
      return;
    }

    setLoading(false);
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
        <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Your workout plan will appear here soon.</p>
          <Button 
            variant="outline" 
            onClick={() => supabase.auth.signOut()}
            className="mt-4"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
