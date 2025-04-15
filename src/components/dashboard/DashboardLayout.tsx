
import { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

interface DashboardLayoutProps {
  firstName?: string;
  onSignOut: () => void;
  activeSection: "home" | "profile";
  setActiveSection: (section: "home" | "profile") => void;
  children: ReactNode;
}

export const DashboardLayout = ({
  firstName,
  onSignOut,
  activeSection,
  setActiveSection,
  children
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5C2D91] via-[#6D3CAA] to-[#502680] text-white">
      <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
      <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="absolute bottom-8 left-8 h-48 w-48"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-[120px] py-4">
        <DashboardHeader 
          firstName={firstName} 
          onSignOut={onSignOut}
          subscriptionStatus="free"
        />

        <div className="flex flex-col space-y-4">
          <DashboardTabs activeSection={activeSection} setActiveSection={setActiveSection} />
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
