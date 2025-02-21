
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Smartphone, Dumbbell, MonitorCheck, SplitSquareHorizontal, LineChart, Focus } from "lucide-react";

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
              <img 
                src="/lovable-uploads/21b3ca3c-11f1-4d5e-81e3-9b2dddbec6f7.png"
                alt="PULO"
                className="h-12 w-auto rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200" 
                onClick={() => navigate("/")}
              />
              <div className="bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>PULO is launching soon on the App Store. Be the first to experience the future of fitness!</span>
                <Dumbbell className="w-4 h-4" />
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth?mode=signin")}
              >
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                style={{ backgroundColor: '#9747FF' }}
                className="hover:opacity-90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 px-4 bg-purple-50/70 rounded-lg mt-3 mb-2">
          <div className="flex items-center gap-2 text-purple-600 text-sm mb-2">
            <MonitorCheck className="w-4 h-4" />
            <span>PULO is built for desktop to give you the best workout tracking experience</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <MonitorCheck className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-purple-600">Bigger screen for better control</span>
            </div>
            
            <div className="flex items-center gap-2">
              <SplitSquareHorizontal className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-purple-600">Multitask like a pro</span>
            </div>
            
            <div className="flex items-center gap-2">
              <LineChart className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-purple-600">Detailed insights</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Focus className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-purple-600">Stay focused on goals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
