import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="text-left space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
            Unlock Your Fitness Potential with AI
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl">
            PULO is your AI-powered personal trainer, crafting workouts tailored to your unique goals and fitness level.
          </p>
        </div>
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
      <div className="grid grid-cols-2 gap-4">
        <img
          src="https://images.unsplash.com/photo-1607617958474-5a5533ca99b6?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Fitness 1"
          className="rounded-2xl shadow-lg object-cover aspect-[4/3]"
        />
        <img
          src="https://images.unsplash.com/photo-1540496978398-dc06d70e5495?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Fitness 2"
          className="rounded-2xl shadow-lg object-cover aspect-[4/3]"
        />
        <img
          src="https://images.unsplash.com/photo-1583454110551-4515c1934342?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Fitness 3"
          className="rounded-2xl shadow-lg object-cover aspect-[4/3]"
        />
        <img
          src="https://images.unsplash.com/photo-1532667449560-72a95c8d38ca?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Fitness 4"
          className="rounded-2xl shadow-lg object-cover aspect-[4/3]"
        />
      </div>
    </div>
  );
};
