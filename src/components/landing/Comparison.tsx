
import { Users, Brain, Award, CheckCircle2 } from "lucide-react";

export const Comparison = () => {
  return (
    <div className="py-20 bg-[#6D3AA5]">
      <div className="max-w-[1440px] mx-auto px-[120px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Why Choose <span className="text-[#8E44AD]">PULO</span>?</h2>
          <p className="mt-4 text-lg text-[#E0E0E0]">See how <span className="text-[#8E44AD]">PULO</span> compares to traditional fitness solutions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-white">
              <Users className="text-[#8E44AD]" />
              PULO vs Traditional Training
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#8E44AD]" />
                <div>
                  <span className="text-white">24/7 Availability</span>
                  <span className="block text-sm text-[#E0E0E0]">Access PULO anytime, unlike scheduled trainer sessions</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3">
                <CheckCircle2 className="w-5 h-5 text-[#8E44AD]" />
                <div>
                  <span className="text-white">Affordable Price Point</span>
                  <span className="block text-sm text-[#E0E0E0]">Fraction of the cost of personal training</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#8E44AD]" />
                <div>
                  <span className="text-white">Continuous Improvement</span>
                  <span className="block text-sm text-[#E0E0E0]">AI constantly learns and improves its recommendations</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3">
                <CheckCircle2 className="w-5 h-5 text-[#8E44AD]" />
                <div>
                  <span className="text-white">Zero Judgment</span>
                  <span className="block text-sm text-[#E0E0E0]">Supportive environment without human bias</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-white">
              <Award className="text-[#8E44AD]" />
              PULO vs Generic Fitness Apps
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#8E44AD]" />
                <div>
                  <span className="text-white">True Personalization</span>
                  <span className="block text-sm text-[#E0E0E0]">Not just templates - truly personalized for you</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3">
                <CheckCircle2 className="w-5 h-5 text-[#8E44AD]" />
                <div>
                  <span className="text-white">Adaptive Programming</span>
                  <span className="block text-sm text-[#E0E0E0]">Adjusts as you progress, not static workouts</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#8E44AD]" />
                <div>
                  <span className="text-white">Smart Feedback</span>
                  <span className="block text-sm text-[#E0E0E0]">Learns from your results and provides actionable insights</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3">
                <CheckCircle2 className="w-5 h-5 text-[#8E44AD]" />
                <div>
                  <span className="text-white">Holistic Approach</span>
                  <span className="block text-sm text-[#E0E0E0]">Considers your whole fitness journey, not just workouts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
