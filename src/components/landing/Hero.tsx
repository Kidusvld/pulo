
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-8rem)]">
      {/* Content Section */}
      <motion.div 
        className="text-left space-y-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-saas-brand-primary/10 to-saas-brand-secondary/10 border border-saas-brand-primary/20 text-saas-brand-primary font-semibold text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Fitness Revolution
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="text-5xl lg:text-7xl font-bold text-saas-text-primary leading-tight tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Meet{" "}
          <span className="saas-text-gradient">PULO</span>,{" "}
          <span className="block text-saas-text-primary">Your AI Fitness Friend</span>
        </motion.h1>
        
        {/* Description */}
        <motion.p 
          className="text-xl lg:text-2xl text-saas-text-secondary max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Think of{" "}
          <span className="font-bold saas-text-gradient">PULO</span>{" "}
          as your supportive workout buddy who's always there to guide, motivate, and adapt to your unique fitness journey. No judgment, just personalized support that grows with you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Button 
            size="lg" 
            onClick={handleGetStarted} 
            className="saas-button-primary group px-10 py-5 text-lg font-semibold"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/#features")} 
            className="saas-button-secondary px-10 py-5 text-lg font-semibold group"
          >
            <Info className="mr-2 h-5 w-5" />
            Learn More
          </Button>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          className="flex items-center gap-6 pt-8 border-t border-saas-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-saas-text-primary">10k+</div>
            <div className="text-sm text-saas-text-muted">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-saas-text-primary">95%</div>
            <div className="text-sm text-saas-text-muted">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-saas-text-primary">50k+</div>
            <div className="text-sm text-saas-text-muted">Workouts</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Image Section */}
      <motion.div 
        className="hidden lg:flex items-center justify-center"
        initial={{ opacity: 0, x: 50, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.img 
          src="/lovable-uploads/0c6ba37f-748f-4f95-97f3-ed0ca45e618b.png" 
          alt="PULO AI Fitness Companion" 
          className="w-full max-w-lg h-auto drop-shadow-2xl"
          whileHover={{ scale: 1.05, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
};
