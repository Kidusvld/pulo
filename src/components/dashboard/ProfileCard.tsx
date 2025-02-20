
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Profile {
  first_name?: string;
  age?: number;
  weight?: number;
  fitness_goal?: "build_muscle" | "lose_fat" | "increase_mobility";
  workout_location?: "home" | "gym";
  intensity_level?: "beginner" | "intermediate" | "advanced";
  equipment?: string[];
}

interface ProfileCardProps {
  profile: Profile;
  isEditing: boolean;
  editedWeight: string;
  editedIntensity: "beginner" | "intermediate" | "advanced";
  editedFitnessGoal: "build_muscle" | "lose_fat" | "increase_mobility";
  editedWorkoutLocation: "home" | "gym";
  onEditToggle: () => void;
  onEditWeight: (value: string) => void;
  onEditIntensity: (value: "beginner" | "intermediate" | "advanced") => void;
  onEditFitnessGoal: (value: "build_muscle" | "lose_fat" | "increase_mobility") => void;
  onEditWorkoutLocation: (value: "home" | "gym") => void;
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
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl shadow-purple-100/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-purple-900">
          <Trophy className="h-5 w-5 text-purple-600" />
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
          className="bg-white hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200"
        >
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
            <p className="text-sm text-purple-600 font-medium">Weight</p>
            {isEditing ? (
              <Input 
                type="number" 
                value={editedWeight} 
                onChange={e => onEditWeight(e.target.value)} 
                placeholder="Enter weight in lbs" 
                className="mt-1 bg-white border-purple-100" 
              />
            ) : (
              <p className="text-lg font-semibold text-purple-900">{profile?.weight} lbs</p>
            )}
          </div>
          <div className="col-span-2 bg-purple-50/50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium">Fitness Goal</p>
            {isEditing ? (
              <Select 
                value={editedFitnessGoal} 
                onValueChange={onEditFitnessGoal}
              >
                <SelectTrigger className="mt-1 bg-white border-purple-100">
                  <SelectValue placeholder="Select fitness goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="build_muscle">Build Muscle</SelectItem>
                  <SelectItem value="lose_fat">Lose Fat</SelectItem>
                  <SelectItem value="increase_mobility">Increase Mobility</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-lg font-semibold text-purple-900 capitalize">
                {profile?.fitness_goal?.replace(/_/g, ' ')}
              </p>
            )}
          </div>
          <div className="col-span-2 bg-purple-50/50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium">Workout Intensity</p>
            {isEditing ? (
              <Select 
                value={editedIntensity} 
                onValueChange={onEditIntensity}
              >
                <SelectTrigger className="mt-1 bg-white border-purple-100">
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-lg font-semibold text-purple-900 capitalize">
                {profile?.intensity_level}
              </p>
            )}
          </div>
          <div className="col-span-2 bg-purple-50/50 rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium">Workout Location</p>
            {isEditing ? (
              <Select 
                value={editedWorkoutLocation} 
                onValueChange={onEditWorkoutLocation}
              >
                <SelectTrigger className="mt-1 bg-white border-purple-100">
                  <SelectValue placeholder="Select workout location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="gym">Gym</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-lg font-semibold text-purple-900 capitalize">
                {profile?.workout_location}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
