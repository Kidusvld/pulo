
import { Button } from "@/components/ui/button";
import { Home, User } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardTabsProps {
  activeSection: "home" | "profile";
  setActiveSection: (section: "home" | "profile") => void;
}

export const DashboardTabs = ({ activeSection, setActiveSection }: DashboardTabsProps) => {
  return (
    <motion.div 
      className="inline-flex bg-white/20 backdrop-blur-sm p-1.5 rounded-2xl shadow-lg border border-white/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Button
        variant={activeSection === "home" ? "default" : "ghost"}
        className={`px-8 py-3 rounded-xl font-montserrat font-semibold text-base tracking-wide transition-all duration-300 ${
          activeSection === "home" 
            ? "bg-white text-slate-900 shadow-lg border border-slate-200 scale-105" 
            : "text-slate-700 hover:text-slate-900 hover:bg-white/70 hover:scale-102"
        }`}
        onClick={() => setActiveSection("home")}
      >
        <Home className="h-5 w-5 mr-3" />
        Home
      </Button>
      <Button
        variant={activeSection === "profile" ? "default" : "ghost"}
        className={`px-8 py-3 rounded-xl font-montserrat font-semibold text-base tracking-wide transition-all duration-300 ${
          activeSection === "profile" 
            ? "bg-white text-slate-900 shadow-lg border border-slate-200 scale-105" 
            : "text-slate-700 hover:text-slate-900 hover:bg-white/70 hover:scale-102"
        }`}
        onClick={() => setActiveSection("profile")}
      >
        <User className="h-5 w-5 mr-3" />
        Profile
      </Button>
    </motion.div>
  );
};
