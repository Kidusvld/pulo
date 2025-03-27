
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
            className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-purple-600 data-[state=on]:bg-purple-50 rounded-xl"
          >
            <Dumbbell className="h-8 w-8 text-purple-600" />
            <span className="font-medium">Build Muscle 💪</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="lose_fat" 
            className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-purple-600 data-[state=on]:bg-purple-50 rounded-xl"
          >
            <Flame className="h-8 w-8 text-orange-500" />
            <span className="font-medium">Lose Fat 🔥</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="increase_mobility" 
            className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-purple-600 data-[state=on]:bg-purple-50 rounded-xl"
          >
            <Leaf className="h-8 w-8 text-green-500" />
            <span className="font-medium">Get More Flexible 🧘</span>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="stay_active" 
            className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-purple-600 data-[state=on]:bg-purple-50 rounded-xl"
          >
            <Activity className="h-8 w-8 text-blue-500" />
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
            { value: "easy", label: "Easy", color: "bg-green-100 border-green-300 text-green-800" },
            { value: "moderate", label: "Moderate", color: "bg-blue-100 border-blue-300 text-blue-800" },
            { value: "hard", label: "Hard", color: "bg-orange-100 border-orange-300 text-orange-800" },
            { value: "intense", label: "Intense", color: "bg-red-100 border-red-300 text-red-800" }
          ].map((intensity) => (
            <div key={intensity.value} className="relative">
              <RadioGroupItem 
                value={intensity.value} 
                id={intensity.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={intensity.value}
                className={`flex items-center justify-center h-16 rounded-lg border-2 cursor-pointer ${intensity.color} peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-purple-600 peer-data-[state=checked]:border-purple-600 transition-all`}
              >
                <span className="text-lg font-medium">{intensity.label}</span>
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
                className="flex items-center justify-center h-16 rounded-lg border-2 border-purple-200 bg-purple-50 cursor-pointer peer-data-[state=checked]:bg-purple-100 peer-data-[state=checked]:border-purple-600 transition-all"
              >
                <span className="text-lg font-medium">{location.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
