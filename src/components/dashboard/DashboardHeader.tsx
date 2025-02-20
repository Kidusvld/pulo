
import { Brain, DumbbellIcon, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  firstName?: string;
  onSignOut: () => void;
  subscriptionStatus?: "free" | "pro";
}

export const DashboardHeader = ({ firstName, onSignOut, subscriptionStatus }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center justify-center px-3 py-2 rounded-xl bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition-colors duration-200"
          >
            <Brain className="h-5 w-5 mr-2" />
            <span className="text-xl font-bold tracking-tight">PULO</span>
          </div>
          {subscriptionStatus === "pro" && (
            <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Pro Plan
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
          Welcome{firstName ? `, ${firstName}` : ""}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Track your fitness journey and achieve your goals</p>
      </div>
      <div className="flex gap-4">
        {subscriptionStatus === "free" && (
          <Button 
            onClick={() => navigate("/subscription")} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => navigate("/log-workout")} 
          className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200 text-base"
          disabled={subscriptionStatus === "free"}
        >
          <DumbbellIcon className="w-4 h-4 mr-2" />
          Logged Workouts
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/saved-workouts")} 
          className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200"
          disabled={subscriptionStatus === "free"}
        >
          Saved Plans
        </Button>
        <Button 
          variant="outline" 
          onClick={onSignOut} 
          className="bg-white/80 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
