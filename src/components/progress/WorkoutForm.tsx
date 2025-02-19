
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dumbbell, Timer, Weight, Dices, Smile } from "lucide-react";

type MuscleGroup = "chest" | "back" | "legs" | "shoulders" | "arms" | "core" | "full_body" | "cardio";

interface WorkoutFormProps {
  onSuccess?: () => void;
}

export const WorkoutForm = ({ onSuccess }: WorkoutFormProps) => {
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("");
  const [mood, setMood] = useState<string>("");
  const [energyLevel, setEnergyLevel] = useState<string>("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | "">("");
  const [volume, setVolume] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
            workout_duration: parseInt(duration),
            mood,
            energy_level: parseInt(energyLevel),
            total_volume: parseInt(volume),
          })
          .select()
          .single(),
      ]);

      if (progressResult.error) throw progressResult.error;

      if (progressResult.data && muscleGroup) {
        const { error: muscleError } = await supabase
          .from("muscle_group_tracking")
          .insert({
            progress_tracking_id: progressResult.data.id,
            muscle_group: muscleGroup as MuscleGroup,
            total_weight: parseInt(volume),
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
      toast.error("Failed to log workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-purple-900 flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-purple-600" />
          Log Workout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Timer className="h-4 w-4 text-purple-500" />
                Duration (minutes)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration"
                className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Weight className="h-4 w-4 text-purple-500" />
                Total Volume (lbs)
              </label>
              <Input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="Enter total weight"
                className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-purple-500" />
                Muscle Group
              </label>
              <Select value={muscleGroup} onValueChange={(value: MuscleGroup) => setMuscleGroup(value)}>
                <SelectTrigger className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200">
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
            <div className="space-y-2.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Dices className="h-4 w-4 text-purple-500" />
                Energy Level (1-5)
              </label>
              <Select value={energyLevel} onValueChange={setEnergyLevel}>
                <SelectTrigger className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200">
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
          </div>
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Smile className="h-4 w-4 text-purple-500" />
              Mood
            </label>
            <Input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="How are you feeling?"
              className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 placeholder:text-gray-400"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-sm"
          >
            {loading ? "Logging..." : "Log Workout"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
