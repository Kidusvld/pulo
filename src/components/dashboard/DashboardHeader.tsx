
import { DumbbellIcon, LogOut, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  firstName?: string;
  onSignOut: () => void;
  subscriptionStatus?: "free" | "pro";
}

export const DashboardHeader = ({
  firstName,
  onSignOut,
  subscriptionStatus = "free"
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const isPro = subscriptionStatus === "pro";

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
          {isPro && (
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
        {!isPro && (
          <Button 
            onClick={() => navigate("/subscription")} 
            style={{backgroundColor: '#9747FF'}} 
            className="hover:opacity-90 font-inter"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/log-workout")} 
                  className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200 text-base font-inter" 
                  disabled={!isPro}
                >
                  {!isPro && <Lock className="w-3 h-3 mr-1" />}
                  <DumbbellIcon className="w-4 h-4 mr-2" />
                  Logged Workouts
                </Button>
              </div>
            </TooltipTrigger>
            {!isPro && (
              <TooltipContent side="bottom" className="bg-purple-900 text-white border-purple-700">
                <p className="text-xs">Upgrade to Pro to access workout history</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/saved-workouts")} 
                  className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200 font-inter" 
                  disabled={!isPro}
                >
                  {!isPro && <Lock className="w-3 h-3 mr-1" />}
                  Saved Plans
                </Button>
              </div>
            </TooltipTrigger>
            {!isPro && (
              <TooltipContent side="bottom" className="bg-purple-900 text-white border-purple-700">
                <p className="text-xs">Upgrade to Pro to save workout plans</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
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
