
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute inset-0 bg-grid-slate-100 opacity-30"></div>
      
      <div className="absolute bottom-0 left-0 w-full h-full opacity-[0.02] pointer-events-none flex items-center justify-center">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="h-64"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-600 shadow-lg"></div>
          <div className="absolute inset-0 rounded-full bg-indigo-600/10 animate-pulse"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Loading Dashboard</h3>
          <p className="text-sm text-slate-500">Preparing your fitness journey...</p>
        </div>
      </div>
    </div>
  );
};
