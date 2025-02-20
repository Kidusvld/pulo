
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, BarChart3, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="relative z-20 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center px-3 h-10 rounded-xl bg-purple-600 text-white">
                <span className="text-xl font-bold tracking-tight">PULO</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth?mode=signin")}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth?mode=signup")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80")',
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700">
                  <Brain className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">AI-Powered Workout Partner</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Meet PULO, Your
                  <span className="text-purple-600 block">Fitness Friend</span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-lg">
                  Think of PULO as your supportive workout buddy who's always there to guide, motivate, and adapt to your unique fitness journey. No judgment, just personalized support that grows with you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/auth?mode=signup")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg h-auto group transition-all duration-300"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg" 
                    onClick={() => navigate("/auth?mode=signin")}
                    className="px-8 py-6 text-lg h-auto"
                  >
                    Sign In
                  </Button>
                </div>
              </div>

              <div className="hidden md:block relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <img 
                      src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&q=80" 
                      alt="Person exercising" 
                      className="rounded-lg shadow-lg h-48 w-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80" 
                      alt="Workout equipment" 
                      className="rounded-lg shadow-lg h-64 w-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-4 pt-8">
                    <img 
                      src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80" 
                      alt="Yoga pose" 
                      className="rounded-lg shadow-lg h-64 w-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80" 
                      alt="Weight training" 
                      className="rounded-lg shadow-lg h-48 w-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
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
        </div>
      </div>
    </div>
  );
};

export default Index;

