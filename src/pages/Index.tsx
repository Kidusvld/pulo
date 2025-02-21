
import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { Comparison } from "@/components/landing/Comparison";
import { CallToAction } from "@/components/landing/CallToAction";
import { useEffect, useState } from "react";
import { AssetGenerator } from "@/components/admin/AssetGenerator";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAssetGenerator, setShowAssetGenerator] = useState(false);

  useEffect(() => {
    // Preload critical background image
    const bgImage = new Image();
    bgImage.src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80";
    bgImage.onload = () => setIsLoaded(true);

    // Add cache control headers for static assets
    if ('caches' in window) {
      caches.open('static-assets').then(cache => {
        cache.addAll([
          '/favicon.ico',
          '/og-image.png',
          bgImage.src
        ]);
      });
    }

    // Only show asset generator in development
    setShowAssetGenerator(process.env.NODE_ENV === 'development');
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />
      
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80")',
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-28">
            <Hero />
          </div>
          <Features />
        </div>
      </div>

      <Testimonials />
      <Comparison />
      <CallToAction />

      {showAssetGenerator && (
        <div className="max-w-4xl mx-auto my-20">
          <AssetGenerator />
        </div>
      )}
    </div>
  );
};

export default Index;
