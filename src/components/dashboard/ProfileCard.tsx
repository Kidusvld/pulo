
import { ArrowRight, Trophy, Dumbbell, Flame, Leaf, Activity, Zap, Home, Pencil, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PuloFitIndex } from "@/components/dashboard/PuloFitIndex";
import { Badge } from "@/components/ui/badge";

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
  editedAge: string;
  editedIntensity: string;
  editedFitnessGoal: string;
  editedWorkoutLocation: string;
  onEditToggle: () => void;
  onEditWeight: (value: string) => void;
  onEditAge: (value: string) => void;
  onEditIntensity: (value: string) => void;
  onEditFitnessGoal: (value: string) => void;
  onEditWorkoutLocation: (value: string) => void;
  onUpdateProfile: () => void;
}

export const ProfileCard = ({
  profile,
  isEditing,
  editedWeight,
  editedAge,
  editedIntensity,
  editedFitnessGoal,
  editedWorkoutLocation,
  onEditToggle,
  onEditWeight,
  onEditAge,
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

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-300/20 shadow-xl shadow-purple-900/10 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-purple-100/20">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-[#5C2D91]">
          <Trophy className="h-5 w-5 text-[#8E44AD]" />
          Your Profile
        </CardTitle>
        <Button 
          variant="outline" 
          onClick={() => {
            if (isEditing) {
              onUpdateProfile();
            } else {
              onEditToggle();
            }
          }} 
          className={`${isEditing ? 
            'bg-[#8E44AD] hover:bg-[#7D3C98] text-white' : 
            'bg-white hover:bg-purple-50 hover:text-[#8E44AD]'} 
            border-purple-200 transition-all duration-200`}
        >
          {isEditing ? (
            "Save Changes"
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left column for basic info */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-[#5C2D91] rounded-lg p-4 border border-purple-400/20 flex items-center justify-between shadow-md">
              <div>
                <p className="text-sm text-white/80 font-medium">Age</p>
                {!isEditing && (
                  <p className="text-lg font-semibold text-white">{profile?.age} years</p>
                )}
                {isEditing && (
                  <Input 
                    type="number" 
                    value={editedAge} 
                    onChange={e => onEditAge(e.target.value)} 
                    placeholder="Enter age" 
                    className="mt-2 bg-white border-purple-200" 
                  />
                )}
              </div>
              {!isEditing && (
                <Badge variant="outline" className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold bg-[#8E44AD] text-white border-white/20 shadow-lg">
                  {profile?.age}
                </Badge>
              )}
              {isEditing && (
                <Calendar className="h-10 w-10 text-white/80" />
              )}
            </div>
            
            <div className="bg-[#5C2D91] rounded-lg p-4 border border-purple-400/20 shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/80 font-medium">Weight</p>
                {!isEditing && (
                  <Badge variant="outline" className="px-3 py-1 bg-[#8E44AD] text-white border-white/20">
                    {profile?.weight} lbs
                  </Badge>
                )}
              </div>
              {isEditing ? (
                <Input 
                  type="number" 
                  value={editedWeight} 
                  onChange={e => onEditWeight(e.target.value)} 
                  placeholder="Enter weight in lbs" 
                  className="mt-2 bg-white border-purple-200" 
                />
              ) : (
                <p className="text-lg font-semibold text-white">{profile?.weight} lbs</p>
              )}
            </div>
            
            {!isEditing && profile && (
              <div className="bg-purple-50/70 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center">
                  <p className="text-[#8E44AD] text-sm font-bold">PULO Fit Index</p>
                  <PuloFitIndex age={profile.age} weight={profile.weight} minimal={true} />
                </div>
              </div>
            )}
          </div>
          
          {/* Right column for preferences */}
          <div className="md:col-span-8 space-y-4">
            <div className="bg-purple-50/70 rounded-lg p-4 border border-purple-100">
              <p className="text-sm text-[#8E44AD] font-medium mb-2">Fitness Goal</p>
              {isEditing ? (
                <ToggleGroup 
                  type="single" 
                  className="grid grid-cols-2 gap-4" 
                  value={editedFitnessGoal} 
                  onValueChange={value => {
                    if (value) onEditFitnessGoal(value);
                  }}
                >
                  <ToggleGroupItem 
                    value="build_muscle" 
                    className="flex flex-col items-center gap-3 py-6 border-2 data-[state=on]:border-white data-[state=on]:bg-[#8E44AD] bg-[#5C2D91] text-white rounded-xl transition-colors"
                  >
                    <Dumbbell className="h-7 w-7 text-white" />
                    <span className="font-montserrat font-bold text-white">Build Muscle</span>
                  </ToggleGroupItem>
                  
                  <ToggleGroupItem 
                    value="lose_fat" 
                    className="flex flex-col items-center gap-3 py-6 border-2 data-[state=on]:border-white data-[state=on]:bg-[#8E44AD] bg-[#5C2D91] text-white rounded-xl transition-colors"
                  >
                    <Flame className="h-7 w-7 text-white" />
                    <span className="font-montserrat font-bold text-white">Lose Fat</span>
                  </ToggleGroupItem>
                  
                  <ToggleGroupItem 
                    value="increase_mobility" 
                    className="flex flex-col items-center gap-3 py-6 border-2 data-[state=on]:border-white data-[state=on]:bg-[#8E44AD] bg-[#5C2D91] text-white rounded-xl transition-colors"
                  >
                    <Leaf className="h-7 w-7 text-white" />
                    <span className="font-montserrat font-bold text-white">Get More Flexible</span>
                  </ToggleGroupItem>
                  
                  <ToggleGroupItem 
                    value="stay_active" 
                    className="flex flex-col items-center gap-3 py-6 border-2 data-[state=on]:border-white data-[state=on]:bg-[#8E44AD] bg-[#5C2D91] text-white rounded-xl transition-colors"
                  >
                    <Activity className="h-7 w-7 text-white" />
                    <span className="font-montserrat font-bold text-white">Stay Active</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-white/30">
                  <div className="h-12 w-12 rounded-full bg-[#8E44AD] flex items-center justify-center">
                    {displayFitnessGoal === "build_muscle" && <Dumbbell className="h-6 w-6 text-white" />}
                    {displayFitnessGoal === "lose_fat" && <Flame className="h-6 w-6 text-white" />}
                    {displayFitnessGoal === "increase_mobility" && <Leaf className="h-6 w-6 text-white" />}
                    {displayFitnessGoal === "stay_active" && <Activity className="h-6 w-6 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#5C2D91] capitalize">
                      {displayFitnessGoal === "increase_mobility" ? "Get More Flexible" : displayFitnessGoal?.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-sm text-[#5C2D91]/70">Your primary fitness goal</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50/70 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-[#8E44AD] font-medium mb-2">Workout Intensity</p>
                {isEditing ? (
                  <RadioGroup 
                    value={editedIntensity} 
                    onValueChange={onEditIntensity} 
                    className="grid grid-cols-2 gap-4"
                  >
                    {[
                      { value: "easy", label: "Easy", icon: <Leaf className="h-5 w-5 mb-1" /> },
                      { value: "moderate", label: "Moderate", icon: <Activity className="h-5 w-5 mb-1" /> },
                      { value: "hard", label: "Hard", icon: <Dumbbell className="h-5 w-5 mb-1" /> }, 
                      { value: "intense", label: "Intense", icon: <Zap className="h-5 w-5 mb-1" /> }
                    ].map(intensity => (
                      <div key={intensity.value} className="relative">
                        <RadioGroupItem value={intensity.value} id={intensity.value} className="peer sr-only" />
                        <Label 
                          htmlFor={intensity.value} 
                          className="flex flex-col items-center justify-center h-16 rounded-lg border-2 border-transparent bg-[#5C2D91] text-white cursor-pointer peer-data-[state=checked]:bg-[#8E44AD] peer-data-[state=checked]:border-white transition-all font-montserrat font-bold"
                        >
                          {intensity.icon}
                          {intensity.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-white/30 backdrop-blur-sm rounded-lg border border-white/30">
                    <div className="h-10 w-10 rounded-full bg-[#8E44AD] flex items-center justify-center">
                      {displayIntensity === "easy" && <Leaf className="h-5 w-5 text-white" />}
                      {displayIntensity === "moderate" && <Activity className="h-5 w-5 text-white" />}
                      {displayIntensity === "hard" && <Dumbbell className="h-5 w-5 text-white" />}
                      {displayIntensity === "intense" && <Zap className="h-5 w-5 text-white" />}
                    </div>
                    <p className="text-lg font-semibold text-[#5C2D91] capitalize">{displayIntensity}</p>
                  </div>
                )}
              </div>

              <div className="bg-purple-50/70 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-[#8E44AD] font-medium mb-2">Workout Location</p>
                {isEditing ? (
                  <RadioGroup 
                    value={editedWorkoutLocation} 
                    onValueChange={onEditWorkoutLocation} 
                    className="grid grid-cols-2 gap-4"
                  >
                    {[
                      { value: "home", label: "Home", icon: <Home className="h-5 w-5 mb-1" /> },
                      { value: "gym", label: "Gym", icon: <Dumbbell className="h-5 w-5 mb-1" /> }
                    ].map(location => (
                      <div key={location.value} className="relative">
                        <RadioGroupItem value={location.value} id={`location-${location.value}`} className="peer sr-only" />
                        <Label 
                          htmlFor={`location-${location.value}`} 
                          className="flex flex-col items-center justify-center h-16 rounded-lg border-2 border-transparent bg-[#5C2D91] text-white cursor-pointer peer-data-[state=checked]:bg-[#8E44AD] peer-data-[state=checked]:border-white transition-all font-montserrat font-bold"
                        >
                          {location.icon}
                          {location.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-white/30 backdrop-blur-sm rounded-lg border border-white/30">
                    <div className="h-10 w-10 rounded-full bg-[#8E44AD] flex items-center justify-center">
                      {profile?.workout_location === "home" ? 
                        <Home className="h-5 w-5 text-white" /> : 
                        <Dumbbell className="h-5 w-5 text-white" />
                      }
                    </div>
                    <p className="text-lg font-semibold text-[#5C2D91] capitalize">{profile?.workout_location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
