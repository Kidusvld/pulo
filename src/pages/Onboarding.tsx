
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    weight: "",
    fitness_goal: "" as "lose_weight" | "build_muscle" | "stay_fit" | "",
    workout_location: "home" as "home" | "gym",
    intensity_level: "beginner" as "beginner" | "intermediate" | "advanced",
    equipment: [] as string[],
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Please sign in to continue");
      navigate("/auth");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
      })
      .eq("id", session.user.id);

    if (error) {
      toast.error("Error saving profile");
      setLoading(false);
      return;
    }

    // Create initial workout plan with properly typed values
    const { error: planError } = await supabase
      .from("workout_plans")
      .insert({
        user_id: session.user.id,
        fitness_goal: formData.fitness_goal as "lose_weight" | "build_muscle" | "stay_fit",
        workout_location: formData.workout_location,
        intensity_level: formData.intensity_level,
        equipment: formData.equipment,
        workout_frequency: 3,
        plan_data: {} as Json,
      });

    if (planError) {
      toast.error("Error creating workout plan");
      setLoading(false);
      return;
    }

    toast.success("Profile completed!");
    navigate("/dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={(e) => updateFormData("first_name", e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => updateFormData("last_name", e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => updateFormData("age", e.target.value)}
                placeholder="Enter your age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (in kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => updateFormData("weight", e.target.value)}
                placeholder="Enter your weight"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fitness Goal</Label>
              <Select
                value={formData.fitness_goal}
                onValueChange={(value) => updateFormData("fitness_goal", value)}
              >
                <SelectTrigger>
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
                value={formData.workout_location}
                onValueChange={(value) => updateFormData("workout_location", value)}
              >
                <SelectTrigger>
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
                value={formData.intensity_level}
                onValueChange={(value) => updateFormData("intensity_level", value)}
              >
                <SelectTrigger>
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

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.first_name.trim() && formData.last_name.trim();
      case 2:
        return formData.age && formData.weight;
      case 3:
        return formData.fitness_goal && formData.workout_location && formData.intensity_level;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Complete Your Profile ({step}/3)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {renderStep()}
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={loading}
                >
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed() || loading}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                  className="ml-auto"
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
