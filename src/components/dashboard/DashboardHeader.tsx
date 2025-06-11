
import { DumbbellIcon, LogOut, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getVersionDisplay } from "@/utils/version";
import { motion } from "framer-motion";

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
  
  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSignOut();
  };
  
  return (
    <motion.div 
      className="flex flex-col gap-6 mb-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <img 
            alt="PULO" 
            className="h-32 w-72 object-contain cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105" 
            onClick={() => navigate("/")} 
            src="/lovable-uploads/a1cb33b9-09aa-4558-8800-3874f34822ba.png" 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Badge variant="purple" className="py-2 px-4 flex items-center gap-2 font-montserrat font-semibold text-sm tracking-wide shadow-lg">
              All Features Unlocked
            </Badge>
          </motion.div>
          <motion.span 
            className="text-xs text-white/70 font-mono tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {getVersionDisplay()}
          </motion.span>
        </motion.div>

        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white/15 hover:bg-white/25 hover:text-white border-white/30 hover:border-white/50 transition-all duration-300 font-montserrat font-semibold text-white shadow-lg backdrop-blur-sm">
                Navigation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/98 backdrop-blur-md border-purple-100 shadow-xl">
              <DropdownMenuItem onClick={() => navigate("/log-workout")} className="cursor-pointer font-opensans">
                <DumbbellIcon className="w-4 h-4 mr-3" />
                Logged Workouts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/saved-workouts")} className="cursor-pointer font-opensans">
                <Heart className="w-4 h-4 mr-3" />
                Saved Plans
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500 font-opensans">
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-extrabold text-white tracking-tight leading-tight flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Welcome{firstName ? `, ${firstName}` : ""}!
          </span>
          <motion.img 
            src="/lovable-uploads/a985bec8-4bd3-4ddb-b5ce-b141fc180362.png" 
            alt="Waving Hand" 
            className="ml-4 h-12 md:h-16 lg:h-20 w-auto" 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-blue-50/90 mt-3 font-opensans font-medium leading-relaxed tracking-wide max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Track your fitness journey and achieve your goals with personalized workouts
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
