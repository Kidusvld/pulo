import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dumbbell, Timer, Weight, Dices, Smile } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";

type MuscleGroup = "chest" | "back" | "legs" | "shoulders" | "arms" | "core" | "full_body" | "cardio";

interface WorkoutFormProps {
  onSuccess?: () => void;
}

// Input validation schemas
const workoutSchema = z.object({
  duration: z.string()
    .min(1, "Duration is required")
    .transform(val => parseInt(val))
    .refine(val => val > 0 && val <= 480, "Duration must be between 1 and 480 minutes"),
  mood: z.string()
    .min(1, "Mood is required")
    .max(100, "Mood description too long")
    .transform(val => val.trim()),
  energyLevel: z.string()
    .transform(val => parseInt(val))
    .refine(val => val >= 1 && val <= 5, "Energy level must be between 1 and 5"),
  muscleGroup: z.enum(["chest", "back", "legs", "shoulders", "arms", "core", "full_body", "cardio"] as const),
  volume: z.string()
    .min(1, "Volume is required")
    .transform(val => parseInt(val))
    .refine(val => val > 0 && val <= 100000, "Volume must be between 1 and 100,000 lbs"),
});

export const WorkoutForm = ({ onSuccess }: WorkoutFormProps) => {
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("");
  const [mood, setMood] = useState<string>("");
  const [energyLevel, setEnergyLevel] = useState<string>("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | "">("");
  const [volume, setVolume] = useState("");

  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim(); // Remove leading/trailing whitespace
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate and sanitize input
      const validatedData = workoutSchema.parse({
        duration,
        mood: sanitizeInput(mood),
        energyLevel,
        muscleGroup,
        volume,
      });

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("Please sign in to log workouts");
        return;
      }

      // Transaction-like operation using Promise.all for atomicity
      const [progressResult] = await Promise.all([
        supabase
          .from("progress_tracking")
          .insert({
            user_id: session.user.id,
            workout_duration: validatedData.duration,
            mood: validatedData.mood,
            energy_level: validatedData.energyLevel,
            total_volume: validatedData.volume,
          })
          .select()
          .single(),
      ]);

      if (progressResult.error) throw progressResult.error;

      if (progressResult.data && validatedData.muscleGroup) {
        const { error: muscleError } = await supabase
          .from("muscle_group_tracking")
          .insert({
            progress_tracking_id: progressResult.data.id,
            muscle_group: validatedData.muscleGroup,
            total_weight: validatedData.volume,
          });

        if (muscleError) throw muscleError;
      }

      toast.success("Workout logged successfully!");
      setDuration("");
      setMood("");
      setEnergyLevel("");
      setMuscleGroup("");
      setVolume("");
      onSuccess?.();
    } catch (error) {
      console.error("Error logging workout:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to log workout");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl">
        <CardHeader className="pb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardTitle className="text-card-title text-purple-900 flex items-center gap-3 font-montserrat font-bold tracking-tight">
              <Dumbbell className="h-6 w-6 text-purple-600" />
              Log Workout
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="space-y-3">
                <label className="text-sm font-montserrat font-semibold text-gray-700 flex items-center gap-2 tracking-wide">
                  <Timer className="h-4 w-4 text-purple-500" />
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter duration"
                  className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 placeholder:text-gray-400 font-opensans"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-montserrat font-semibold text-gray-700 flex items-center gap-2 tracking-wide">
                  <Weight className="h-4 w-4 text-purple-500" />
                  Total Volume (lbs)
                </label>
                <Input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="Enter total weight"
                  className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 placeholder:text-gray-400 font-opensans"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-montserrat font-semibold text-gray-700 flex items-center gap-2 tracking-wide">
                  <Dumbbell className="h-4 w-4 text-purple-500" />
                  Muscle Group
                </label>
                <Select value={muscleGroup} onValueChange={(value: MuscleGroup) => setMuscleGroup(value)}>
                  <SelectTrigger className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 font-opensans">
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-100">
                    <SelectItem value="chest">Chest</SelectItem>
                    <SelectItem value="back">Back</SelectItem>
                    <SelectItem value="legs">Legs</SelectItem>
                    <SelectItem value="shoulders">Shoulders</SelectItem>
                    <SelectItem value="arms">Arms</SelectItem>
                    <SelectItem value="core">Core</SelectItem>
                    <SelectItem value="full_body">Full Body</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-montserrat font-semibold text-gray-700 flex items-center gap-2 tracking-wide">
                  <Dices className="h-4 w-4 text-purple-500" />
                  Energy Level (1-5)
                </label>
                <Select value={energyLevel} onValueChange={setEnergyLevel}>
                  <SelectTrigger className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 font-opensans">
                    <SelectValue placeholder="Select energy level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-100">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label className="text-sm font-montserrat font-semibold text-gray-700 flex items-center gap-2 tracking-wide">
                <Smile className="h-4 w-4 text-purple-500" />
                Mood
              </label>
              <Input
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="How are you feeling?"
                className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 placeholder:text-gray-400 font-opensans"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-sm font-montserrat font-semibold text-base py-3 rounded-xl hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                {loading ? "Logging..." : "Log Workout"}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
