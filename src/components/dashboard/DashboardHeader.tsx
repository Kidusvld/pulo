
import { Brain, DumbbellIcon, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  firstName?: string;
  onSignOut: () => void;
  subscriptionStatus?: "free" | "pro";
}

export const DashboardHeader = ({
  firstName,
  onSignOut,
  subscriptionStatus
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
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
          {subscriptionStatus === "pro" && (
            <Badge variant="purple" className="py-1 flex items-center gap-1 font-inter">
              <Crown className="w-4 h-4" />
              Pro Plan
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5C2D91] to-[#8E44AD] bg-clip-text text-transparent font-montserrat">
          Welcome{firstName ? `, ${firstName}` : ""}! 👋
        </h1>
        <p className="text-gray-100/80 mt-2 font-opensans">Track your fitness journey and achieve your goals</p>
      </div>
      <div className="flex gap-4">
        {subscriptionStatus === "free" && (
          <Button 
            onClick={() => navigate("/subscription")} 
            className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white font-inter"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => navigate("/log-workout")} 
          className="bg-white/10 hover:bg-purple-500/10 hover:text-white border-purple-300/20 transition-all duration-200 text-base font-inter text-white" 
          disabled={subscriptionStatus === "free"}
        >
          <DumbbellIcon className="w-4 h-4 mr-2" />
          Logged Workouts
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/saved-workouts")} 
          className="bg-white/10 hover:bg-purple-500/10 hover:text-white border-purple-300/20 transition-all duration-200 font-inter text-white" 
          disabled={subscriptionStatus === "free"}
        >
          Saved Plans
        </Button>
        <Button 
          variant="outline" 
          onClick={onSignOut} 
          className="bg-white/10 hover:bg-red-500/10 hover:text-red-300 border-purple-300/20 transition-all duration-200 font-inter text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
