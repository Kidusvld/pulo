
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };

  // Enhanced stagger animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-8rem)]">
      {/* Content Section */}
      <motion.div 
        className="text-left space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-saas-brand-primary/10 to-saas-brand-secondary/10 border border-saas-brand-primary/20 text-saas-brand-primary font-semibold text-sm tracking-wide"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-montserrat font-semibold uppercase tracking-wider">AI-Powered Fitness Revolution</span>
        </motion.div>

        {/* Enhanced Main Heading */}
        <motion.div variants={heroTextVariants}>
          <h1 className="text-display">
            <span className="text-slate-900 block">Meet{" "}</span>
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 bg-clip-text text-transparent font-black drop-shadow-sm block">
              PULO
            </span>
            <span className="text-slate-900 block">Your AI Fitness Friend</span>
          </h1>
        </motion.div>
        
        {/* Enhanced Description */}
        <motion.div variants={itemVariants}>
          <p className="text-body-large text-slate-700 max-w-2xl">
            Think of{" "}
            <span className="font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">PULO</span>{" "}
            as your supportive workout buddy who's always there to guide, motivate, and adapt to your unique fitness journey. No judgment, just personalized support that grows with you.
          </p>
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 pt-4"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="bg-gradient-to-r from-saas-brand-primary to-saas-brand-secondary text-white font-montserrat font-bold px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-saas-brand-primary/50 group"
            >
              <span className="tracking-wide">Get Started Free</span>
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/#features")} 
              className="bg-white text-slate-700 border-2 border-slate-300 font-montserrat font-semibold px-12 py-6 text-lg rounded-xl shadow-md hover:bg-slate-50 hover:shadow-lg hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-saas-brand-primary/20 group"
            >
              <Info className="mr-3 h-5 w-5" />
              <span className="tracking-wide">Learn More</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Social Proof */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-8 pt-12 border-t border-slate-200"
        >
          <div className="text-center">
            <div className="text-3xl font-montserrat font-black text-slate-900 tracking-tight">10k+</div>
            <div className="text-sm font-inter font-medium text-slate-600 tracking-wide uppercase">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-montserrat font-black text-slate-900 tracking-tight">95%</div>
            <div className="text-sm font-inter font-medium text-slate-600 tracking-wide uppercase">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-montserrat font-black text-slate-900 tracking-tight">50k+</div>
            <div className="text-sm font-inter font-medium text-slate-600 tracking-wide uppercase">Workouts</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Image Section */}
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
