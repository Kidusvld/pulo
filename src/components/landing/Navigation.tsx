
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
      <nav className="h-32 bg-gradient-to-r from-saas-brand-primary via-saas-brand-secondary to-saas-brand-primary shadow-xl border-b border-white/10">
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
                className="h-32 w-72 object-contain cursor-pointer hover:opacity-90 transition-all duration-300 filter drop-shadow-lg" 
                onClick={() => navigate("/")} 
                src="/lovable-uploads/1c8d5492-3bdc-4f1e-895c-19bd9cf6ac54.png" 
              />
            </motion.div>

            {/* Actions Section */}
            <div className="flex items-center gap-6">
              {/* Coming Soon Badge */}
              <motion.div 
                className="glass text-white px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Smartphone className="w-5 h-5" />
                <span>Coming Soon on the App Store</span>
              </motion.div>

              {/* Sign In Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white/95 backdrop-blur-sm text-saas-brand-primary border-white/30 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 font-semibold rounded-2xl shadow-md transition-all duration-300" 
                  onClick={() => navigate("/auth?mode=signin")}
                >
                  <LogIn className="mr-2 w-5 h-5" />
                  Sign In
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  );
};
