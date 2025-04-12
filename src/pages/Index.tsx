
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
    bgImage.src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80";
    bgImage.onload = () => setIsLoaded(true);

    // Add cache control headers for static assets
    if ('caches' in window) {
      caches.open('static-assets').then(cache => {
        cache.addAll([
          '/favicon.ico',
          '/og-image.png',
          bgImage.src,
          '/lovable-uploads/bc47a5b1-0da4-4e4e-8ca1-17980443a5b2.png'
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

      {/* PULO Character Fixed at the bottom right corner */}
      <div className="fixed bottom-6 right-6 w-20 h-20 z-50 cursor-pointer hover:scale-110 transition-transform duration-300 hidden md:block">
        <img 
          src="/lovable-uploads/bc47a5b1-0da4-4e4e-8ca1-17980443a5b2.png" 
          alt="PULO Assistant" 
          className="w-full h-full object-contain drop-shadow-lg animate-bounce-subtle"
          title="Need help with your fitness journey? I'm PULO, your AI Fitness Companion!"
        />
      </div>
    </div>
  );
};

export default Index;
