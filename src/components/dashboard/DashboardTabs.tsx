
import { Button } from "@/components/ui/button";
import { Home, User } from "lucide-react";

interface DashboardTabsProps {
  activeSection: "home" | "profile";
  setActiveSection: (section: "home" | "profile") => void;
}

export const DashboardTabs = ({ activeSection, setActiveSection }: DashboardTabsProps) => {
  return (
    <div className="inline-flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
      <Button
        variant={activeSection === "home" ? "default" : "ghost"}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
          activeSection === "home" 
            ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
        }`}
        onClick={() => setActiveSection("home")}
      >
        <Home className="h-4 w-4 mr-2" />
        Home
      </Button>
      <Button
        variant={activeSection === "profile" ? "default" : "ghost"}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
          activeSection === "profile" 
            ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
        }`}
        onClick={() => setActiveSection("profile")}
      >
        <User className="h-4 w-4 mr-2" />
        Profile
      </Button>
    </div>
  );
};
