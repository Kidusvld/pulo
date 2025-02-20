import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Brain, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Star,
  Users,
  Award,
  Timer,
  TrendingUp
} from "lucide-react";

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

      {/* Social Proof Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Fitness Enthusiasts</h2>
            <p className="mt-4 text-lg text-gray-600">Join thousands of people transforming their fitness journey with PULO</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10k+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50k+</div>
              <p className="text-gray-600">Workouts Completed</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Software Developer",
                content: "PULO understands my busy schedule and adapts perfectly. It's like having a personal trainer who's always available!",
                rating: 5
              },
              {
                name: "Mike R.",
                role: "Business Owner",
                content: "The AI-powered recommendations are spot-on. I've seen more progress in 3 months than in my past year of solo training.",
                rating: 5
              },
              {
                name: "Lisa K.",
                role: "Graphic Designer",
                content: "Finally, a fitness app that actually understands and grows with me. The personalization is incredible!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why PULO Section */}
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
                  <span className="text-gray-600">Affordable pricing</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-600 p-8 rounded-xl shadow-lg transform lg:scale-105">
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
                  <span className="text-white">Affordable monthly subscription</span>
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

      {/* Final CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Fitness Journey?</h2>
            <p className="text-xl text-gray-600 mb-8">Join PULO today and experience the future of personalized fitness training</p>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth?mode=signup")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg h-auto group transition-all duration-300"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
