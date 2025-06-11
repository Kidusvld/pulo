
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-30"></div>
      
      {/* Subtle Watermark */}
      <div className="absolute bottom-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="absolute bottom-8 left-8 h-48 w-48"
        />
      </div>
      
      <div className="relative z-10">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[120px] py-6">
            <DashboardHeader 
              firstName={firstName} 
              onSignOut={onSignOut}
              subscriptionStatus="free"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[120px] py-4">
            <DashboardTabs activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[120px] py-8">
          {children}
        </div>
      </div>
    </div>
  );
};
