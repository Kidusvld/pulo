
import { Users, Brain, Award, CheckCircle2 } from "lucide-react";

export const Comparison = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      <div className="max-w-[1440px] mx-auto px-[120px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Why Choose <span className="text-indigo-400">PULO</span>?</h2>
          <p className="mt-4 text-lg text-slate-300">See how <span className="text-indigo-400">PULO</span> compares to traditional fitness solutions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-white">
              <Users className="text-indigo-400" />
              PULO vs Traditional Training
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium">24/7 Availability</span>
                  <span className="block text-sm text-slate-300">Access PULO anytime, unlike scheduled trainer sessions</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium">Affordable Price Point</span>
                  <span className="block text-sm text-slate-300">Fraction of the cost of personal training</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium">Continuous Improvement</span>
                  <span className="block text-sm text-slate-300">AI constantly learns and improves its recommendations</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium">Zero Judgment</span>
                  <span className="block text-sm text-slate-300">Supportive environment without human bias</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-white">
              <Award className="text-indigo-400" />
              PULO vs Generic Fitness Apps
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium">True Personalization</span>
                  <span className="block text-sm text-slate-300">Not just templates - truly personalized for you</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium">Adaptive Programming</span>
                  <span className="block text-sm text-slate-300">Adjusts as you progress, not static workouts</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium">Smart Feedback</span>
                  <span className="block text-sm text-slate-300">Learns from your results and provides actionable insights</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-white font-medium">Holistic Approach</span>
                  <span className="block text-sm text-slate-300">Considers your whole fitness journey, not just workouts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
