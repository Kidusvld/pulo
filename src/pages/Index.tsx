
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
    bgImage.src = "/lovable-uploads/6434dcfe-7cd3-440e-8597-fe6e8dd89821.png";
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
    <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
         style={{ 
           backgroundImage: 'url("/lovable-uploads/6434dcfe-7cd3-440e-8597-fe6e8dd89821.png")', 
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-500/10 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-600/10 blur-3xl bottom-20 right-20 -z-10"></div>
      
      <Navigation />
      
      <div className="relative overflow-hidden">
        <div className="relative z-10 max-w-[1440px] mx-auto px-[120px]">
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
