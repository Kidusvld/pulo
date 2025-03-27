
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dumbbell, Flame, Leaf, Activity } from "lucide-react";

interface PreferencesStepProps {
  fitnessGoal: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workoutLocation: "home" | "gym";
  intensityLevel: "easy" | "moderate" | "hard" | "intense";
  onUpdateForm: (field: string, value: string) => void;
}

export const PreferencesStep = ({
  fitnessGoal,
  workoutLocation,
  intensityLevel,
  onUpdateForm,
}: PreferencesStepProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-lg font-medium">What's your goal today?</Label>
        <ToggleGroup 
          type="single" 
          className="grid grid-cols-2 gap-4"
          value={fitnessGoal}
          onValueChange={(value) => {
            if (value) onUpdateForm("fitness_goal", value);
          }}
        >
          <ToggleGroupItem 
            value="build_muscle" 
            className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-white data-[state=on]:bg-purple-700 bg-purple-600 text-white rounded-xl transition-colors"
          >
            <Dumbbell className="h-8 w-8" />
            <span className="font-medium">Build Muscle 💪</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="lose_fat" 
            className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-white data-[state=on]:bg-purple-700 bg-purple-600 text-white rounded-xl transition-colors"
          >
            <Flame className="h-8 w-8" />
            <span className="font-medium">Lose Fat 🔥</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="increase_mobility" 
            className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-white data-[state=on]:bg-purple-700 bg-purple-600 text-white rounded-xl transition-colors"
          >
            <Leaf className="h-8 w-8" />
            <span className="font-medium">Get More Flexible 🧘</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="stay_active" 
            className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-white data-[state=on]:bg-purple-700 bg-purple-600 text-white rounded-xl transition-colors"
          >
            <Activity className="h-8 w-8" />
            <span className="font-medium">Stay Active 🏃</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">How hard do you want to push today?</Label>
        <RadioGroup 
          value={intensityLevel} 
          onValueChange={(value) => onUpdateForm("intensity_level", value)}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { value: "easy", label: "Easy" },
            { value: "moderate", label: "Moderate" },
            { value: "hard", label: "Hard" },
            { value: "intense", label: "Intense" }
          ].map((intensity) => (
            <div key={intensity.value} className="relative">
              <RadioGroupItem 
                value={intensity.value} 
                id={intensity.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={intensity.value}
                className="flex items-center justify-center h-16 rounded-lg border-2 border-transparent bg-purple-600 text-white cursor-pointer peer-data-[state=checked]:bg-purple-700 peer-data-[state=checked]:border-white transition-all font-medium"
              >
                {intensity.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">Workout Location</Label>
        <RadioGroup 
          value={workoutLocation}
          onValueChange={(value) => onUpdateForm("workout_location", value)}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { value: "home", label: "Home" },
            { value: "gym", label: "Gym" }
          ].map((location) => (
            <div key={location.value} className="relative">
              <RadioGroupItem 
                value={location.value} 
                id={`location-${location.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`location-${location.value}`}
                className="flex items-center justify-center h-16 rounded-lg border-2 border-transparent bg-purple-600 text-white cursor-pointer peer-data-[state=checked]:bg-purple-700 peer-data-[state=checked]:border-white transition-all font-medium"
              >
                {location.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
