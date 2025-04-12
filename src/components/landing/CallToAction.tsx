
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CallToAction = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };

  return (
    <div className="bg-white py-16 relative overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 right-10 opacity-10 w-64 h-64">
        <img 
          src="/lovable-uploads/bc47a5b1-0da4-4e4e-8ca1-17980443a5b2.png" 
          alt="PULO Mascot" 
          className="w-full h-full object-contain animate-pulse-gentle"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Ready to Transform Your Fitness Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 font-inter">Join <span style={{ color: "#7c3aed" }}>PULO</span> today and experience the future of personalized fitness training</p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-pulo hover:bg-purple-700 text-white px-8 py-6 text-lg h-auto group transition-all duration-300 font-poppins"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};
