import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Smartphone, Dumbbell } from "lucide-react";
export const Navigation = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };
  return <div className="relative z-20">
      <nav className="border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img alt="PULO" className="h-12 w-auto rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200" onClick={() => navigate("/")} src="/lovable-uploads/d5a3d106-9961-461f-9c75-11ba2b80b6e0.png" />
              <div className="bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 font-inter">
                <Smartphone className="w-4 h-4" />
                <span><span style={{
                  color: "#7c3aed"
                }} className="font-semibold">PULO</span> is launching soon on the App Store. Be the first to experience the future of fitness!</span>
                <Dumbbell className="w-4 h-4" />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate("/auth?mode=signin")} className="font-inter">
                Sign In
              </Button>
              <Button onClick={handleGetStarted} style={{
              backgroundColor: '#9747FF'
            }} className="hover:opacity-90 font-poppins">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>;
};