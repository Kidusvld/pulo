
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
          <img 
            src="/lovable-uploads/21b3ca3c-11f1-4d5e-81e3-9b2dddbec6f7.png"
            alt="PULO"
            className="h-12 w-auto rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200" 
            onClick={() => navigate("/")}
          />
          {subscriptionStatus === "pro" && (
            <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 font-inter">
              <Crown className="w-4 h-4" />
              Pro Plan
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent font-poppins">
          Welcome{firstName ? `, ${firstName}` : ""}! 👋
        </h1>
        <p className="text-gray-600 mt-2 font-inter">Track your fitness journey and achieve your goals</p>
      </div>
      <div className="flex gap-4">
        {subscriptionStatus === "free" && (
          <Button 
            onClick={() => navigate("/subscription")} 
            style={{ backgroundColor: '#9747FF' }}
            className="hover:opacity-90 font-inter"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => navigate("/log-workout")} 
          className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200 text-base font-inter"
          disabled={subscriptionStatus === "free"}
        >
          <DumbbellIcon className="w-4 h-4 mr-2" />
          Logged Workouts
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/saved-workouts")} 
          className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200 font-inter"
          disabled={subscriptionStatus === "free"}
        >
          Saved Plans
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
