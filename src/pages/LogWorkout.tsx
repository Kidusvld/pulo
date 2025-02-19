
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { WorkoutForm } from "@/components/progress/WorkoutForm";

const LogWorkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);

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
            <h1 className="text-3xl font-bold text-gray-900">Log Workout</h1>
            <Button 
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-purple-50 hover:text-purple-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="space-y-8">
            <WorkoutForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogWorkout;
