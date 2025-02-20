
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PreferencesStepProps {
  fitnessGoal: "build_muscle" | "lose_fat" | "increase_mobility";
  workoutLocation: "home" | "gym";
  intensityLevel: "beginner" | "intermediate" | "advanced";
  onUpdateForm: (field: string, value: string) => void;
}

export const PreferencesStep = ({
  fitnessGoal,
  workoutLocation,
  intensityLevel,
  onUpdateForm,
}: PreferencesStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Fitness Goal</Label>
        <Select
          value={fitnessGoal}
          onValueChange={(value: "build_muscle" | "lose_fat" | "increase_mobility") =>
            onUpdateForm("fitness_goal", value)
          }
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select your goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lose_fat">Lose Fat</SelectItem>
            <SelectItem value="build_muscle">Build Muscle</SelectItem>
            <SelectItem value="increase_mobility">Increase Mobility</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Workout Location</Label>
        <Select
          value={workoutLocation}
          onValueChange={(value: "home" | "gym") =>
            onUpdateForm("workout_location", value)
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
            onUpdateForm("intensity_level", value)
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
