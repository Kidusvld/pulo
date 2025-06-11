
import { BarChart3, Calendar, Dumbbell, Activity, Flame, Zap, Hand } from "lucide-react";

export const Features = () => {
  return (
    <div id="features" className="py-16">
      <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What PULO Offers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200/60">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Strength Training</h3>
          <p className="text-slate-700 text-center">Personalized resistance workouts tailored to your goals, equipment and experience level</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200/60">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Cardio & HIIT</h3>
          <p className="text-slate-700 text-center">Heart-pumping interval training that maximizes your time and delivers results quickly</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200/60">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Calorie Burning</h3>
          <p className="text-slate-700 text-center">Optimize your energy expenditure with scientifically designed workout patterns for maximum efficiency</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200/60">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Energy Boosting</h3>
          <p className="text-slate-700 text-center">Revitalize your daily routine with exercises that increase energy levels and improve mood</p>
        </div>
      </div>
      
      <div className="mt-20 py-16 bg-white/90 backdrop-blur-sm rounded-2xl px-10 shadow-lg border border-slate-200/60">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Feature Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 group">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-300 shadow-lg">
              <Hand className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Adaptation</h3>
            <p className="text-slate-700">Just like a friend who knows your style, PULO learns and adjusts your workouts as you progress</p>
          </div>

          <div className="text-center p-6 group">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:from-emerald-500 group-hover:to-teal-600 transition-all duration-300 shadow-lg">
              <BarChart3 className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Track Progress</h3>
            <p className="text-slate-700">Watch your journey unfold with clear, motivating insights that celebrate every achievement</p>
          </div>

          <div className="text-center p-6 group">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300 shadow-lg">
              <Calendar className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Flexible Schedule</h3>
            <p className="text-slate-700">Life gets busy - PULO adapts to your schedule, not the other way around</p>
          </div>
        </div>
      </div>
    </div>
  );
};
