
import { Brain, BarChart3, Calendar, Dumbbell, Activity, Flame, Zap } from "lucide-react";

export const Features = () => {
  return (
    <div id="features" className="py-16">
      <h2 className="text-3xl font-bold text-white text-center mb-12">What PULO Offers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
          <div className="bg-[#8E44AD] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white text-center mb-2">Strength Training</h3>
          <p className="text-[#E0E0E0] text-center">Personalized resistance workouts tailored to your goals, equipment and experience level</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
          <div className="bg-[#8E44AD] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white text-center mb-2">Cardio & HIIT</h3>
          <p className="text-[#E0E0E0] text-center">Heart-pumping interval training that maximizes your time and delivers results quickly</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
          <div className="bg-[#8E44AD] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white text-center mb-2">Calorie Burning</h3>
          <p className="text-[#E0E0E0] text-center">Optimize your energy expenditure with scientifically designed workout patterns for maximum efficiency</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
          <div className="bg-[#8E44AD] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white text-center mb-2">Energy Boosting</h3>
          <p className="text-[#E0E0E0] text-center">Revitalize your daily routine with exercises that increase energy levels and improve mood</p>
        </div>
      </div>
      
      <div className="mt-20 py-16 bg-white/5 backdrop-blur-sm rounded-xl px-10">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Feature Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 group">
            <div className="bg-[#8E44AD]/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8E44AD] transition-colors">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Adaptation</h3>
            <p className="text-[#E0E0E0]">Just like a friend who knows your style, PULO learns and adjusts your workouts as you progress</p>
          </div>

          <div className="text-center p-6 group">
            <div className="bg-[#8E44AD]/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8E44AD] transition-colors">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-[#E0E0E0]">Watch your journey unfold with clear, motivating insights that celebrate every achievement</p>
          </div>

          <div className="text-center p-6 group">
            <div className="bg-[#8E44AD]/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8E44AD] transition-colors">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Flexible Schedule</h3>
            <p className="text-[#E0E0E0]">Life gets busy - PULO adapts to your schedule, not the other way around</p>
          </div>
        </div>
      </div>
    </div>
  );
};
