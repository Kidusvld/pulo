
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export const Navigation = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="relative z-20 sticky top-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="h-20 bg-white/95 backdrop-blur-xl border-b border-saas-border shadow-sm">
        <div className="saas-container h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                alt="PULO" 
                className="h-12 w-auto object-contain cursor-pointer hover:opacity-90 transition-all duration-300" 
                onClick={() => navigate("/")} 
                src="/lovable-uploads/1c8d5492-3bdc-4f1e-895c-19bd9cf6ac54.png" 
              />
            </motion.div>

            {/* Actions Section */}
            <div className="flex items-center gap-6">
              {/* Coming Soon Badge */}
              <motion.div 
                className="hidden md:flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-saas-brand-primary/10 to-saas-brand-secondary/10 border border-saas-brand-primary/20 text-saas-brand-primary font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Smartphone className="w-4 h-4" />
                <span className="font-montserrat font-semibold text-sm tracking-wide">Coming Soon on App Store</span>
              </motion.div>

              {/* Sign In Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white border-2 border-saas-border text-saas-text-primary hover:bg-saas-bg-primary hover:border-saas-brand-primary hover:text-saas-brand-primary font-montserrat font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 px-6 py-3" 
                  onClick={() => navigate("/auth?mode=signin")}
                >
                  <LogIn className="mr-2 w-4 h-4" />
                  <span className="tracking-wide">Sign In</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  );
};
