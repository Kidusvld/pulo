
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5C2D91] via-[#6D3CAA] to-[#502680]">
      <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
      <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none flex items-center justify-center">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="h-64 opacity-10"
        />
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
    </div>
  );
};
