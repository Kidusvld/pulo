
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold">Welcome to WorkoutRight</h1>
        <p className="text-xl text-gray-600">Your personalized AI workout companion</p>
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline"
            size="lg" 
            onClick={() => navigate("/auth?mode=signin")}
            className="w-32"
          >
            Sign In
          </Button>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth?mode=signup")}
            className="w-32"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
