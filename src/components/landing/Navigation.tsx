
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
        <div className="py-4 px-6 bg-purple-50 rounded-xl mt-4 mb-2">
          <div className="flex items-center gap-2 text-purple-600 font-medium mb-4">
            <MonitorCheck className="w-5 h-5" />
            <span className="text-lg">PULO is built for desktop to give you the best workout tracking experience.</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-600">
                <MonitorCheck className="w-5 h-5" />
              </div>
              <div className="text-purple-700">
                <span className="font-semibold">Bigger Screen, Better Control</span>
                <p className="text-purple-600 mt-1">Easily navigate progress stats and workout plans.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-600">
                <SplitSquareHorizontal className="w-5 h-5" />
              </div>
              <div className="text-purple-700">
                <span className="font-semibold">Multitask Like a Pro</span>
                <p className="text-purple-600 mt-1">Watch tutorials, track progress, and plan workouts side by side.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-600">
                <LineChart className="w-5 h-5" />
              </div>
              <div className="text-purple-700">
                <span className="font-semibold">Detailed Insights</span>
                <p className="text-purple-600 mt-1">Full-screen analytics for a clearer view of your fitness journey.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-600">
                <Focus className="w-5 h-5" />
              </div>
              <div className="text-purple-700">
                <span className="font-semibold">Stay Focused</span>
                <p className="text-purple-600 mt-1">No mobile distractions, just pure commitment to your goals.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-purple-700 font-semibold flex items-center justify-center gap-2">
            <span>🚀 Designed for those serious about progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};
