
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };

  return (
    <nav className="relative z-20 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center px-3 h-10 rounded-xl bg-purple-600 text-white">
              <span className="text-xl font-bold tracking-tight">PULO</span>
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
              className="bg-purple-600 hover:bg-purple-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
