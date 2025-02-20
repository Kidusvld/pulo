
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <AspectRatio ratio={4/3} className="bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&q=80" 
                alt="Person exercising" 
                className="rounded-lg shadow-lg w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
            </AspectRatio>
            <AspectRatio ratio={4/3} className="bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80" 
                alt="Workout equipment" 
                className="rounded-lg shadow-lg w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
            </AspectRatio>
          </div>
          <div className="space-y-4 pt-8">
            <AspectRatio ratio={4/3} className="bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80" 
                alt="Yoga pose" 
                className="rounded-lg shadow-lg w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
            </AspectRatio>
            <AspectRatio ratio={4/3} className="bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80" 
                alt="Weight training" 
                className="rounded-lg shadow-lg w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </div>
  );
};
