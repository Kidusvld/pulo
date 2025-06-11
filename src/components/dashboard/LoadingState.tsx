
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute bottom-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="h-64 opacity-10"
        />
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#8E44AD]"></div>
    </div>
  );
};
