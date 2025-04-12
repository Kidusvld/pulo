
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";

const motivationalQuotes = [
  "Keep showing up — consistency wins!",
  "Small steps every day lead to big changes.",
  "The only workout you regret is the one you didn't do.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  "The difference between try and triumph is a little umph.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "Don't wish for it, work for it.",
  "The hardest lift of all is lifting your butt off the couch."
];

const fitnessQuotes = [
  "Drink water between sets - it improves recovery.",
  "Focus on form first, weights second.",
  "Rest days are as important as workout days.",
  "Proper warm-up reduces injury risk by 50%.",
  "Add protein to your post-workout meal within 45 minutes.",
  "Deep breathing can improve your lifting capacity.",
  "Regular stretching increases your range of motion by up to 18%.",
  "Change your routine every 4-6 weeks to avoid plateaus.",
  "Track your workouts to see patterns in your progress.",
  "Compound exercises burn more calories than isolation moves."
];

interface MotivationalBannerProps {
  type?: "motivation" | "tip";
  customMessage?: string;
}

export const MotivationalBanner = ({ 
  type = "motivation", 
  customMessage 
}: MotivationalBannerProps) => {
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (customMessage) {
      setMessage(customMessage);
      return;
    }
    
    const quotes = type === "motivation" ? motivationalQuotes : fitnessQuotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setMessage(quotes[randomIndex]);
  }, [type, customMessage]);
  
  return (
    <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-none shadow-xl shadow-purple-100/30">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Lightbulb className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-medium">{message}</p>
          <p className="text-xs text-purple-200 mt-1">
            {type === "motivation" ? "Daily Motivation" : "Fitness Tip"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
