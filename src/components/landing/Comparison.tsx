
import { Users, Brain, Award, CheckCircle2 } from "lucide-react";

export const Comparison = () => {
  return (
    <div className="bg-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose PULO?</h2>
          <p className="mt-4 text-lg text-gray-600">See how PULO compares to traditional fitness solutions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="text-purple-600" />
              Traditional Personal Training
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-600">Professional guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-600">Personalized workouts</span>
              </li>
              <li className="flex items-start gap-2 opacity-50">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-600">24/7 availability</span>
              </li>
              <li className="flex items-start gap-2 opacity-50">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-600">Flexibility</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-600 p-8 rounded-xl shadow-lg transform lg:scale-105 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
              Recommended
            </div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <Brain className="text-white" />
              PULO AI Training
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-white mt-1" />
                <span className="text-white">AI-powered personalization</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-white mt-1" />
                <span className="text-white">Available 24/7</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-white mt-1" />
                <span className="text-white">Adaptive programming</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-white mt-1" />
                <span className="text-white">Consistent workout quality</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="text-purple-600" />
              Generic Fitness Apps
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-600">Workout tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-600">Exercise library</span>
              </li>
              <li className="flex items-start gap-2 opacity-50">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-600">Real personalization</span>
              </li>
              <li className="flex items-start gap-2 opacity-50">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-600">Adaptive programming</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
