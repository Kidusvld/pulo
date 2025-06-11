
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CallToAction = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };

  return (
    <div className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600">
      <div className="max-w-[1440px] mx-auto px-[120px]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Meet Your Fitness Companion?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join <span className="text-white font-semibold">PULO</span> today and experience the future of personalized fitness training</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-6 text-lg h-auto group transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 rounded-xl font-semibold"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-white/30 hover:border-white/50 px-8 py-6 text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl font-semibold"
            >
              App Store Coming Soon
            </Button>
          </div>
          
          <div className="mt-12 opacity-10">
            
          </div>
        </div>
      </div>
    </div>
  );
};
