
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
      <div className="text-left space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          Meet <span className="text-[#8E44AD]">PULO</span>, Your
          <span className="text-white block">Fitness Friend</span>
        </h1>
        
        <p className="text-xl text-[#E0E0E0] max-w-lg">
          Think of <span className="text-[#8E44AD] font-bold">PULO</span> as your supportive workout buddy who's always there to guide, motivate, and adapt to your unique fitness journey. No judgment, just personalized support that grows with you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            onClick={handleGetStarted} 
            className="bg-[#8E44AD] hover:bg-[#9B59B6] text-white px-8 py-6 text-lg h-auto group transition-all duration-300 shadow-lg shadow-purple-900/30"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/#features")} 
            className="bg-white/20 border-[#8E44AD] border-2 text-white hover:bg-[#8E44AD]/30 px-8 py-6 text-lg h-auto font-medium flex items-center shadow-lg shadow-purple-900/20 transition-all"
          >
            <Info className="mr-2 h-5 w-5" />
            Learn More
          </Button>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center">
        <img 
          src="/lovable-uploads/0c6ba37f-748f-4f95-97f3-ed0ca45e618b.png" 
          alt="PULO Mascot" 
          className="w-3/4 max-w-md transform hover:scale-105 transition-all duration-500 drop-shadow-2xl"
        />
      </div>
    </div>
  );
};
