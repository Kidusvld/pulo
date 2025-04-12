
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Dumbbell, Flame, Activity, Zap } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const Hero = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="text-left space-y-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700">
          <Brain className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">AI-Powered Workout Partner</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Meet <span style={{ color: "#7c3aed" }}>PULO</span>, Your
          <span className="text-black block">Fitness Friend</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-lg">
          Think of <span style={{ color: "#7c3aed" }} className="font-bold">PULO</span> as your supportive workout buddy who's always there to guide, motivate, and adapt to your unique fitness journey. No judgment, just personalized support that grows with you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            onClick={handleGetStarted} 
            className="bg-pulo hover:bg-purple-700 text-white px-8 py-6 text-lg h-auto group transition-all duration-300"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/auth?mode=signin")} 
            className="px-8 py-6 text-lg h-auto border-purple-300 hover:bg-purple-50"
          >
            Sign In
          </Button>
        </div>
      </div>

      <div className="relative hidden md:block animate-bounce-subtle">
        <img
          src="/lovable-uploads/bc47a5b1-0da4-4e4e-8ca1-17980443a5b2.png"
          alt="PULO Character"
          className="w-full max-w-md mx-auto"
        />
      </div>
    </div>
  );
};
