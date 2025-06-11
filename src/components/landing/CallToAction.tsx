
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const CallToAction = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };

  return (
    <div className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white opacity-10"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-[1440px] mx-auto px-[120px] relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-hero text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Ready to Meet Your Fitness Companion?
          </motion.h2>
          
          <motion.p 
            className="text-body-large text-indigo-100 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join <span className="text-white font-montserrat font-bold">PULO</span> today and experience the future of personalized fitness training
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                size="lg" 
                onClick={handleGetStarted} 
                className="bg-white hover:bg-gray-50 text-indigo-600 px-12 py-8 text-xl h-auto group transition-all duration-300 shadow-2xl hover:shadow-3xl transform font-montserrat font-bold rounded-xl"
              >
                <span className="tracking-wide">Get Started Now</span>
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-200" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/30 hover:border-white/50 px-12 py-8 text-xl h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform font-montserrat font-semibold rounded-xl"
              >
                <span className="tracking-wide">App Store Coming Soon</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
