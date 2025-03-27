import { ArrowRight, Trophy, Dumbbell, Flame, Leaf, Activity, Zap, Walking, Home, Gym } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PuloFitIndex } from "@/components/dashboard/PuloFitIndex";

interface Profile {
  first_name?: string;
  age?: number;
  weight?: number;
  fitness_goal?: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workout_location?: "home" | "gym";
  intensity_level?: "easy" | "moderate" | "hard" | "intense" | "beginner" | "intermediate" | "advanced";
  equipment?: string[];
}

interface ProfileCardProps {
  profile: Profile;
  isEditing: boolean;
  editedWeight: string;
  editedIntensity: string;
  editedFitnessGoal: string;
  editedWorkoutLocation: string;
  onEditToggle: () => void;
  onEditWeight: (value: string) => void;
  onEditIntensity: (value: string) => void;
  onEditFitnessGoal: (value: string) => void;
  onEditWorkoutLocation: (value: string) => void;
  onUpdateProfile: () => void;
}

export const ProfileCard = ({
  profile,
  isEditing,
  editedWeight,
  editedIntensity,
  editedFitnessGoal,
  editedWorkoutLocation,
  onEditToggle,
  onEditWeight,
  onEditIntensity,
  onEditFitnessGoal,
  onEditWorkoutLocation,
  onUpdateProfile
}: ProfileCardProps) => {
  const mapLegacyIntensity = (intensity: string | undefined): string => {
    if (!intensity) return "moderate";
    if (["easy", "moderate", "hard", "intense"].includes(intensity)) {
      return intensity;
    }
    switch (intensity) {
      case "beginner":
        return "easy";
      case "intermediate":
        return "moderate";
      case "advanced":
        return "hard";
      default:
        return "moderate";
    }
  };

  const mapToLegacyIntensity = (intensity: string): string => {
    switch (intensity) {
      case "easy":
        return "beginner";
      case "moderate":
        return "intermediate";
      case "hard":
      case "intense":
        return "advanced";
      default:
        return "intermediate";
    }
  };

  const mapLegacyFitnessGoal = (goal: string | undefined): string => {
    if (!goal) return "build_muscle";
    if (["build_muscle", "lose_fat", "increase_mobility", "stay_active"].includes(goal)) {
      return goal;
    }
    return goal === "increase_mobility" ? "increase_mobility" : goal;
  };

  const mapToLegacyFitnessGoal = (goal: string): string => {
    if (goal === "stay_active") return "build_muscle";
    return goal;
  };

  const displayIntensity = mapLegacyIntensity(profile?.intensity_level);
  const displayFitnessGoal = mapLegacyFitnessGoal(profile?.fitness_goal);

  return <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl shadow-purple-100/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-purple-900">
          <Trophy className="h-5 w-5 text-purple-600" />
          Your Profile
        </CardTitle>
        <Button variant="outline" onClick={() => {
        if (isEditing) {
          onUpdateProfile();
        } else {
          onEditToggle();
        }
      }} className="bg-white hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200">
          {isEditing ? "Save Changes" : "Edit Profile"}
          {!isEditing && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium">Age</p>
            <p className="text-lg font-semibold text-purple-900">{profile?.age} years</p>
          </div>
          <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-purple-600 font-medium">Weight</p>
            </div>
            {isEditing ? <Input type="number" value={editedWeight} onChange={e => onEditWeight(e.target.value)} placeholder="Enter weight in lbs" className="mt-1 bg-white border-purple-100" /> : <p className="text-lg font-semibold text-purple-900">{profile?.weight} lbs</p>}
          </div>

          {!isEditing && profile && <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100 col-span-2">
              <div className="flex items-center">
                <p className="text-purple-600 text-sm font-bold">PULO Fit Index</p>
                <PuloFitIndex age={profile.age} weight={profile.weight} minimal={true} />
              </div>
            </div>}

          <div className="col-span-2 bg-purple-50/50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium mb-2">Fitness Goal</p>
            {isEditing ? <ToggleGroup type="single" className="grid grid-cols-2 gap-4" value={editedFitnessGoal} onValueChange={value => {
            if (value) onEditFitnessGoal(value);
          }}>
                <ToggleGroupItem value="build_muscle" className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-white data-[state=on]:bg-purple-700 bg-purple-600 text-white rounded-xl transition-colors">
                  <Dumbbell className="h-6 w-6 text-white" />
                  <span className="font-poppins font-bold text-white">Build Muscle</span>
                </ToggleGroupItem>
                
                <ToggleGroupItem value="lose_fat" className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-white data-[state=on]:bg-purple-700 bg-purple-600 text-white rounded-xl transition-colors">
                  <Flame className="h-6 w-6 text-white" />
                  <span className="font-poppins font-bold text-white">Lose Fat</span>
                </ToggleGroupItem>
                
                <ToggleGroupItem value="increase_mobility" className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-white data-[state=on]:bg-purple-700 bg-purple-600 text-white rounded-xl transition-colors">
                  <Leaf className="h-6 w-6 text-white" />
                  <span className="font-poppins font-bold text-white">Get More Flexible</span>
                </ToggleGroupItem>
                
                <ToggleGroupItem value="stay_active" className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-white data-[state=on]:bg-purple-700 bg-purple-600 text-white rounded-xl transition-colors">
                  <Activity className="h-6 w-6 text-white" />
                  <span className="font-poppins font-bold text-white">Stay Active</span>
                </ToggleGroupItem>
              </ToggleGroup> : <div className="flex items-center gap-2 text-lg font-semibold text-purple-900 capitalize">
                {displayFitnessGoal === "build_muscle" && <Dumbbell className="h-5 w-5 text-purple-600" />}
                {displayFitnessGoal === "lose_fat" && <Flame className="h-5 w-5 text-purple-600" />}
                {displayFitnessGoal === "increase_mobility" && <Leaf className="h-5 w-5 text-purple-600" />}
                {displayFitnessGoal === "stay_active" && <Activity className="h-5 w-5 text-purple-600" />}
                {displayFitnessGoal?.replace(/_/g, ' ')}
              </div>}
          </div>

          <div className="col-span-2 bg-purple-50/50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium mb-2">Workout Intensity</p>
            {isEditing ? <RadioGroup value={editedIntensity} onValueChange={onEditIntensity} className="grid grid-cols-2 gap-4">
                {[
                  { value: "easy", label: "Easy", icon: <Leaf className="h-5 w-5 mb-1" /> },
                  { value: "moderate", label: "Moderate", icon: <Walking className="h-5 w-5 mb-1" /> },
                  { value: "hard", label: "Hard", icon: <Dumbbell className="h-5 w-5 mb-1" /> }, 
                  { value: "intense", label: "Intense", icon: <Zap className="h-5 w-5 mb-1" /> }
                ].map(intensity => <div key={intensity.value} className="relative">
                    <RadioGroupItem value={intensity.value} id={intensity.value} className="peer sr-only" />
                    <Label htmlFor={intensity.value} className="flex flex-col items-center justify-center h-16 rounded-lg border-2 border-transparent bg-purple-600 text-white cursor-pointer peer-data-[state=checked]:bg-purple-700 peer-data-[state=checked]:border-white transition-all font-poppins font-bold">
                      {intensity.icon}
                      {intensity.label}
                    </Label>
                  </div>)}
              </RadioGroup> : <div className="flex items-center gap-2 text-lg font-semibold text-purple-900 capitalize">
                {displayIntensity === "easy" && <Leaf className="h-5 w-5 text-purple-600" />}
                {displayIntensity === "moderate" && <Walking className="h-5 w-5 text-purple-600" />}
                {displayIntensity === "hard" && <Dumbbell className="h-5 w-5 text-purple-600" />}
                {displayIntensity === "intense" && <Zap className="h-5 w-5 text-purple-600" />}
                {displayIntensity}
              </div>}
          </div>

          <div className="col-span-2 bg-purple-50/50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium mb-2">Workout Location</p>
            {isEditing ? <RadioGroup value={editedWorkoutLocation} onValueChange={onEditWorkoutLocation} className="grid grid-cols-2 gap-4">
                {[
                  { value: "home", label: "Home", icon: <Home className="h-5 w-5 mb-1" /> },
                  { value: "gym", label: "Gym", icon: <Dumbbell className="h-5 w-5 mb-1" /> }
                ].map(location => <div key={location.value} className="relative">
                    <RadioGroupItem value={location.value} id={`location-${location.value}`} className="peer sr-only" />
                    <Label htmlFor={`location-${location.value}`} className="flex flex-col items-center justify-center h-16 rounded-lg border-2 border-transparent bg-purple-600 text-white cursor-pointer peer-data-[state=checked]:bg-purple-700 peer-data-[state=checked]:border-white transition-all font-poppins font-bold">
                      {location.icon}
                      {location.label}
                    </Label>
                  </div>)}
              </RadioGroup> : <div className="flex items-center gap-2 text-lg font-semibold text-purple-900 capitalize">
                {profile?.workout_location === "home" ? <Home className="h-5 w-5 text-purple-600" /> : <Dumbbell className="h-5 w-5 text-purple-600" />}
                {profile?.workout_location}
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
};
