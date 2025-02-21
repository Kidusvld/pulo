
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
            <div className="bg-purple-600 p-2 rounded-xl cursor-pointer hover:bg-purple-700 transition-colors duration-200" onClick={() => navigate("/")}>
              <img 
                src="/lovable-uploads/909957ea-fca3-4bb3-bdc5-dc90b7bd1779.png"
                alt="PULO"
                className="h-8 w-auto"
              />
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
