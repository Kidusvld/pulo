
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, User } from "lucide-react";

interface DashboardTabsProps {
  activeSection: "home" | "profile";
  setActiveSection: (section: "home" | "profile") => void;
}

export const DashboardTabs = ({ activeSection, setActiveSection }: DashboardTabsProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-2 rounded-lg flex w-[280px] mx-auto">
      <Button
        variant={activeSection === "home" ? "default" : "ghost"}
        className={`flex-1 ${activeSection === "home" 
          ? "bg-[#8E44AD] hover:bg-[#7D3C98]" 
          : "text-white hover:bg-white/10"}`}
        onClick={() => setActiveSection("home")}
      >
        <Home className="h-4 w-4 mr-2" />
        Home
      </Button>
      <Button
        variant={activeSection === "profile" ? "default" : "ghost"}
        className={`flex-1 ${activeSection === "profile" 
          ? "bg-[#8E44AD] hover:bg-[#7D3C98]" 
          : "text-white hover:bg-white/10"}`}
        onClick={() => setActiveSection("profile")}
      >
        <User className="h-4 w-4 mr-2" />
        Profile
      </Button>
    </div>
  );
};
