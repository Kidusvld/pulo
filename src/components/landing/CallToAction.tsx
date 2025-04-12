
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CallToAction = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };

  return (
    <div className="py-20 bg-[#5C2D91]">
      <div className="max-w-[1440px] mx-auto px-[120px]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Meet Your Fitness Companion?</h2>
          <p className="text-xl text-[#E0E0E0] mb-10 max-w-2xl mx-auto">Join <span className="text-[#8E44AD]">PULO</span> today and experience the future of personalized fitness training</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-[#8E44AD] hover:bg-[#9B59B6] text-white px-8 py-6 text-lg h-auto group transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="bg-white/20 border-[#8E44AD] border-2 text-white hover:bg-[#8E44AD]/30 px-8 py-6 text-lg h-auto transition-all"
              onClick={() => window.open('https://apps.apple.com', '_blank')}
            >
              App Store Coming Soon
            </Button>
          </div>
          
          <div className="mt-12 opacity-10">
            <img 
              src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
              alt="PULO Watermark"
              className="h-24 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
