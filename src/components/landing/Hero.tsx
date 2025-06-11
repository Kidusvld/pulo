
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Smartphone, Star, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="relative">
      {/* Hero Content */}
      <div className="text-center space-y-8">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saas-brand-primary/10 text-saas-brand-primary border border-saas-brand-primary/20 text-sm font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Zap className="w-4 h-4" />
          <span>AI-Powered Fitness Platform</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-5xl lg:text-7xl font-bold text-saas-text-primary tracking-tight">
            Transform Your{" "}
            <span className="saas-text-gradient">Fitness Journey</span>
          </h1>
          <p className="text-xl lg:text-2xl text-saas-text-secondary max-w-3xl mx-auto leading-relaxed">
            Get personalized AI-powered workout plans that adapt to your goals, schedule, and progress. Join thousands who've revolutionized their fitness.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-saas-text-secondary">
            <Users className="w-5 h-5 text-saas-brand-primary" />
            <span className="font-semibold">10K+ Active Users</span>
          </div>
          <div className="flex items-center gap-2 text-saas-text-secondary">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2 text-saas-text-secondary">
            <Zap className="w-5 h-5 text-saas-brand-primary" />
            <span className="font-semibold">AI-Powered</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="saas-button-primary group"
            onClick={() => navigate("/auth?mode=signup")}
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="saas-button-secondary group"
            onClick={() => setIsVideoPlaying(true)}
          >
            <Play className="mr-2 w-5 h-5" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-saas-border text-saas-text-secondary text-sm font-medium shadow-sm">
            <Smartphone className="w-4 h-4" />
            <span>Mobile app coming soon to App Store & Google Play</span>
          </div>
        </motion.div>
      </div>

      {/* Hero Image/Video */}
      <motion.div
        className="mt-16 lg:mt-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-saas-border bg-gradient-to-br from-saas-brand-primary/10 to-saas-brand-secondary/10">
            {!isVideoPlaying ? (
              <div 
                className="relative w-full h-full bg-cover bg-center cursor-pointer group"
                style={{ backgroundImage: "url('/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png')" }}
                onClick={() => setIsVideoPlaying(true)}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-saas-brand-primary ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-saas-brand-primary/10 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="animate-spin w-8 h-8 border-2 border-saas-brand-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-saas-text-secondary">Demo video coming soon...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-saas-brand-primary/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-saas-brand-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
        </div>
      </motion.div>
    </div>
  );
};
