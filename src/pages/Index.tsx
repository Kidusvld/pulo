
import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { Comparison } from "@/components/landing/Comparison";
import { CallToAction } from "@/components/landing/CallToAction";
import { useEffect, useState } from "react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload critical background image
    const bgImage = new Image();
    bgImage.src = "/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png";
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
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-deep-purple-900 via-deep-purple-800 to-deep-purple-900 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-500/10 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-600/10 blur-3xl bottom-20 right-20 -z-10"></div>
      
      <Navigation />
      
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{ 
            backgroundImage: 'url("/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png")',
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
    </div>
  );
};

export default Index;
