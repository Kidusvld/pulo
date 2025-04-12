
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Software Developer",
      content: "PULO understands my busy schedule and adapts perfectly. It's like having a personal trainer who's always available!",
      rating: 5,
      avatar: "SM"
    },
    {
      name: "Mike R.",
      role: "Business Owner",
      content: "The AI-powered recommendations are spot-on. I've seen more progress in 3 months than in my past year of solo training.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Lisa K.",
      role: "Graphic Designer",
      content: "Finally, a fitness app that actually understands and grows with me. The personalization is incredible!",
      rating: 5,
      avatar: "LK"
    }
  ];

  return (
    <div className="py-20 bg-[#5C2D91]/80">
      <div className="max-w-[1440px] mx-auto px-[120px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Trusted by Fitness Enthusiasts</h2>
          <p className="mt-4 text-lg text-[#E0E0E0]">Join thousands of people transforming their fitness journey with PULO</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#8E44AD] mb-2">10k+</div>
            <p className="text-[#E0E0E0]">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#8E44AD] mb-2">95%</div>
            <p className="text-[#E0E0E0]">Success Rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#8E44AD] mb-2">50k+</div>
            <p className="text-[#E0E0E0]">Workouts Completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[#E0E0E0] mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-[#8E44AD]/60 text-white">{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm italic text-[#E0E0E0]">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
