
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndProfile();
  }, []);

  const checkAuthAndProfile = async () => {
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

    if (error) {
      toast.error("Error checking profile");
      return;
    }

    // If profile is incomplete, redirect to onboarding
    if (!profile?.age || !profile?.weight || !profile?.first_name) {
      navigate("/onboarding");
      return;
    }

    // If profile is complete, redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold">Welcome to WorkoutRight</h1>
        <p className="text-xl text-gray-600">Your personalized AI workout companion</p>
        <Button 
          size="lg" 
          onClick={() => navigate("/auth")}
          className="w-full max-w-sm"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
