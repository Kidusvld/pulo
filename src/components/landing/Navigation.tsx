
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Smartphone, Dumbbell } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };

  return (
    <div className="relative z-20">
      <nav className="border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <img 
                  src="/lovable-uploads/bc47a5b1-0da4-4e4e-8ca1-17980443a5b2.png"
                  alt="PULO"
                  className="h-12 w-auto rounded-xl hover:opacity-90 transition-all duration-200" 
                />
                <span className="text-2xl font-bold text-pulo-gradient">PULO</span>
              </div>
              <div className="bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 font-inter">
                <Smartphone className="w-4 h-4" />
                <span><span style={{ color: "#7c3aed" }} className="font-semibold">PULO</span> is launching soon on the App Store. Be the first to experience the future of fitness!</span>
                <Dumbbell className="w-4 h-4" />
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth?mode=signin")}
                className="font-inter"
              >
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-pulo hover:bg-purple-700 font-poppins"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
