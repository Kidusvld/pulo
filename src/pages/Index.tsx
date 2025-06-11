
import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { Comparison } from "@/components/landing/Comparison";
import { CallToAction } from "@/components/landing/CallToAction";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { motion } from "framer-motion";
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
    <motion.div 
      className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Modern SaaS Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-saas-bg-primary via-white to-purple-50 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-slate-100 opacity-20 pointer-events-none" />
      
      {/* Subtle gradient overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-saas-brand-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-saas-brand-secondary/8 blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <Navigation />
        
        <motion.div 
          className="relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Hero Section with modern spacing */}
          <div className="saas-container">
            <div className="py-20 lg:py-28">
              <Hero />
            </div>
            <Features />
          </div>
        </motion.div>

        <Testimonials />
        <Comparison />
        <CallToAction />
      </div>

      <FeedbackButton />
    </motion.div>
  );
};

export default Index;
