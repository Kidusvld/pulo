
import { Brain, BarChart3, Calendar } from "lucide-react";

export const Features = () => {
  return (
    <div className="py-16 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 group hover:bg-white hover:shadow-lg rounded-xl transition-all duration-300">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Brain className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Adaptation</h3>
          <p className="text-gray-600">Just like a friend who knows your style, PULO learns and adjusts your workouts as you progress</p>
        </div>

        <div className="text-center p-6 group hover:bg-white hover:shadow-lg rounded-xl transition-all duration-300">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <BarChart3 className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-600">Watch your journey unfold with clear, motivating insights that celebrate every achievement</p>
        </div>

        <div className="text-center p-6 group hover:bg-white hover:shadow-lg rounded-xl transition-all duration-300">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Calendar className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
          <p className="text-gray-600">Life gets busy - PULO adapts to your schedule, not the other way around</p>
        </div>
      </div>
    </div>
  );
};
