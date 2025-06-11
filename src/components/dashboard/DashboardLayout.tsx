
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
    <div className="min-h-screen bg-gray-50">
      <div className="absolute bottom-0 left-0 w-full h-full opacity-5 pointer-events-none">
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
