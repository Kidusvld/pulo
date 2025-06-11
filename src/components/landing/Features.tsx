
import { BarChart3, Calendar, Dumbbell, Activity, Flame, Zap, Hand } from "lucide-react";
import { motion } from "framer-motion";

export const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div id="features" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h2 className="text-section text-slate-900 mb-4">What PULO Offers</h2>
        <p className="text-body-large text-slate-600 max-w-2xl mx-auto">
          Experience the future of personalized fitness with AI-powered workouts tailored just for you
        </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200/60 group"
        >
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-card-title text-slate-900 text-center mb-4">Strength Training</h3>
          <p className="text-body text-slate-700 text-center">Personalized resistance workouts tailored to your goals, equipment and experience level</p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200/60 group"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-card-title text-slate-900 text-center mb-4">Cardio & HIIT</h3>
          <p className="text-body text-slate-700 text-center">Heart-pumping interval training that maximizes your time and delivers results quickly</p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200/60 group"
        >
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Flame className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-card-title text-slate-900 text-center mb-4">Calorie Burning</h3>
          <p className="text-body text-slate-700 text-center">Optimize your energy expenditure with scientifically designed workout patterns for maximum efficiency</p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200/60 group"
        >
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-card-title text-slate-900 text-center mb-4">Energy Boosting</h3>
          <p className="text-body text-slate-700 text-center">Revitalize your daily routine with exercises that increase energy levels and improve mood</p>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="py-16 bg-white/90 backdrop-blur-sm rounded-2xl px-12 shadow-lg border border-slate-200/60"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-section text-slate-900 mb-4">Feature Highlights</h2>
          <p className="text-body-large text-slate-600 max-w-2xl mx-auto">
            Discover what makes PULO your perfect fitness companion
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center p-8 group">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:scale-110">
              <Hand className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-card-title text-slate-900 mb-4">Smart Adaptation</h3>
            <p className="text-body text-slate-700">Just like a friend who knows your style, PULO learns and adjusts your workouts as you progress</p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center p-8 group">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:from-emerald-500 group-hover:to-teal-600 transition-all duration-300 shadow-lg group-hover:scale-110">
              <BarChart3 className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-card-title text-slate-900 mb-4">Track Progress</h3>
            <p className="text-body text-slate-700">Watch your journey unfold with clear, motivating insights that celebrate every achievement</p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center p-8 group">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300 shadow-lg group-hover:scale-110">
              <Calendar className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-card-title text-slate-900 mb-4">Flexible Schedule</h3>
            <p className="text-body text-slate-700">Life gets busy - PULO adapts to your schedule, not the other way around</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
