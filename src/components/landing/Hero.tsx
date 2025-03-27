
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
          Meet PULO, Your
          <span className="text-purple-600 block">Fitness Friend</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-lg">
          Think of PULO as your supportive workout buddy who's always there to guide, motivate, and adapt to your unique fitness journey. No judgment, just personalized support that grows with you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg h-auto group transition-all duration-300"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline"
            size="lg" 
            onClick={() => navigate("/auth?mode=signin")}
            className="px-8 py-6 text-lg h-auto"
          >
            Sign In
          </Button>
        </div>
      </div>

      <div className="hidden md:block relative">
        <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full">
          <div className="bg-purple-100 rounded-lg flex flex-col items-center justify-center p-6 transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <Dumbbell className="w-16 h-16 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-purple-800">Strength Training</h3>
            <p className="text-purple-700 text-center mt-2">Personalized resistance workouts</p>
          </div>
          
          <div className="bg-purple-100 rounded-lg flex flex-col items-center justify-center p-6 transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <Activity className="w-16 h-16 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-purple-800">Cardio & HIIT</h3>
            <p className="text-purple-700 text-center mt-2">Heart-pumping interval training</p>
          </div>
          
          <div className="bg-purple-100 rounded-lg flex flex-col items-center justify-center p-6 transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <Flame className="w-16 h-16 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-purple-800">Calorie Burning</h3>
            <p className="text-purple-700 text-center mt-2">Maximize your workout efficiency</p>
          </div>
          
          <div className="bg-purple-100 rounded-lg flex flex-col items-center justify-center p-6 transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <Zap className="w-16 h-16 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-purple-800">Energy Boosting</h3>
            <p className="text-purple-700 text-center mt-2">Revitalize your daily routine</p>
          </div>
        </div>
      </div>
    </div>
  );
};
