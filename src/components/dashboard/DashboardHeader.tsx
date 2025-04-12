
import { DumbbellIcon, LogOut, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface DashboardHeaderProps {
  firstName?: string;
  onSignOut: () => void;
  streak?: number;
  lastWorkoutDate?: string;
}

export const DashboardHeader = ({
  firstName,
  onSignOut,
  streak = 0,
  lastWorkoutDate
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d");
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <img 
            alt="PULO" 
            className="h-12 w-auto rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200" 
            onClick={() => navigate("/")} 
            src="/lovable-uploads/5b723d5b-3568-487e-bb1a-7bd2c43a1223.png" 
          />
          {streak > 0 && (
            <Badge variant="purple" className="px-3 py-1 flex items-center gap-1 font-inter">
              <Target className="w-4 h-4" />
              {streak} Day Streak
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent font-poppins">
          Welcome{firstName ? `, ${firstName}` : ""}! 👋
        </h1>
        <p className="text-gray-600 mt-2 font-inter">
          {formattedDate} · {lastWorkoutDate ? 
            `Last workout: ${lastWorkoutDate}` : 
            "Ready for your first workout?"}
        </p>
      </div>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/log-workout")} 
          className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200 text-base font-inter"
        >
          <DumbbellIcon className="w-4 h-4 mr-2" />
          Log Workout
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate("/saved-workouts")} 
          className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200 font-inter"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Saved Workouts
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onSignOut} 
          className="bg-white/80 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 font-inter"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
