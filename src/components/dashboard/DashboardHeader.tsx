import { Brain, DumbbellIcon, LogOut, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  return <div className="flex flex-col gap-4 mb-8">
      {/* Top navigation bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img alt="PULO" className="h-12 w-auto rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200" onClick={() => navigate("/")} src="/lovable-uploads/a1cb33b9-09aa-4558-8800-3874f34822ba.png" />
          <Badge variant="purple" className="py-1 flex items-center gap-1 font-inter">
            All Features Unlocked
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white/10 hover:bg-purple-500/10 hover:text-white border-purple-300/20 transition-all duration-200 font-inter text-white">
                Navigation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border-purple-100">
              <DropdownMenuItem onClick={() => navigate("/log-workout")} className="cursor-pointer">
                <DumbbellIcon className="w-4 h-4 mr-2" />
                Logged Workouts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/saved-workouts")} className="cursor-pointer">
                <Brain className="w-4 h-4 mr-2" />
                Saved Plans
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* User greeting section - simplified styling */}
      <div className="mt-4">
        <h1 className="text-3xl font-semibold text-white font-montserrat">
          Welcome{firstName ? `, ${firstName}` : ""}! 👋
        </h1>
        <p className="text-gray-100/80 mt-1 font-opensans">Track your fitness journey and achieve your goals</p>
      </div>
    </div>;
};