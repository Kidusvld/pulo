
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PreferencesStepProps {
  fitnessGoal: "lose_weight" | "build_muscle" | "stay_fit";
  workoutLocation: "home" | "gym";
  intensityLevel: "beginner" | "intermediate" | "advanced";
  onUpdate: (field: string, value: string) => void;
}

export const PreferencesStep = ({
  fitnessGoal,
  workoutLocation,
  intensityLevel,
  onUpdate,
}: PreferencesStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Fitness Goal</Label>
        <Select
          value={fitnessGoal}
          onValueChange={(value: "lose_weight" | "build_muscle" | "stay_fit") =>
            onUpdate("fitness_goal", value)
          }
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select your goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lose_weight">Lose Weight</SelectItem>
            <SelectItem value="build_muscle">Build Muscle</SelectItem>
            <SelectItem value="stay_fit">Stay Fit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Workout Location</Label>
        <Select
          value={workoutLocation}
          onValueChange={(value: "home" | "gym") =>
            onUpdate("workout_location", value)
          }
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="gym">Gym</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Intensity Level</Label>
        <Select
          value={intensityLevel}
          onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
            onUpdate("intensity_level", value)
          }
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select intensity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
