
import { Star } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
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
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-pulo-gradient mb-3">Trusted by Fitness Enthusiasts</h2>
          <p className="mt-4 text-lg text-gray-600">Join thousands of people transforming their fitness journey with PULO</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-pulo mb-2">10k+</div>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pulo mb-2">95%</div>
            <p className="text-gray-600">Success Rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pulo mb-2">50k+</div>
            <p className="text-gray-600">Workouts Completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-pulo text-pulo" />
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
  );
};
