
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Smartphone } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };
  
  return (
    <div className="relative z-20 sticky top-0">
      <nav className="h-20 bg-[#5C2D91] shadow-md">
        <div className="max-w-[1440px] mx-auto px-[120px]">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img 
                alt="PULO" 
                className="h-10 w-20 object-contain cursor-pointer hover:opacity-90 transition-all duration-200" 
                onClick={() => navigate("/")} 
                src="/lovable-uploads/d5a3d106-9961-461f-9c75-11ba2b80b6e0.png" 
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>Coming Soon on the App Store</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white/10 font-medium rounded-lg"
                onClick={() => navigate("/auth?mode=signin")}
              >
                <LogIn className="mr-1 w-4 h-4" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
