import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoStep } from "@/components/onboarding/PersonalInfoStep";
import { BodyInfoStep } from "@/components/onboarding/BodyInfoStep";
import { PreferencesStep } from "@/components/onboarding/PreferencesStep";
import { StepNavigation } from "@/components/onboarding/StepNavigation";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "30",
    weight: "",
    fitness_goal: "build_muscle" as "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active",
    workout_location: "home" as "home" | "gym",
    intensity_level: "moderate" as "easy" | "moderate" | "hard" | "intense",
    equipment: [] as string[],
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getIntensityLevel = (intensity: string): "beginner" | "intermediate" | "advanced" => {
    switch (intensity) {
      case "easy": return "beginner";
      case "moderate": return "intermediate";
      case "hard": return "advanced";
      case "intense": return "advanced";
      default: return "intermediate";
    }
  };

  const mapFitnessGoal = (goal: string): "build_muscle" | "lose_fat" | "increase_mobility" => {
    if (goal === "stay_active") {
      return "increase_mobility";
    }
    return goal as "build_muscle" | "lose_fat" | "increase_mobility";
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Please sign in to continue");
      navigate("/auth");
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: parseInt(formData.age),
          weight: parseInt(formData.weight) || 150,
        })
        .eq("id", session.user.id);

      if (profileError) {
        throw new Error("Error saving profile: " + profileError.message);
      }

      const { error: deactivateError } = await supabase
        .from("workout_plans")
        .update({ is_active: false })
        .eq("user_id", session.user.id);

      if (deactivateError) {
        throw new Error("Error deactivating existing plans: " + deactivateError.message);
      }

      const { error: planError } = await supabase
        .from("workout_plans")
        .insert({
          user_id: session.user.id,
          fitness_goal: mapFitnessGoal(formData.fitness_goal),
          workout_location: formData.workout_location,
          intensity_level: getIntensityLevel(formData.intensity_level),
          equipment: formData.equipment,
          workout_frequency: 3,
          plan_data: {} as Json,
          is_active: true,
        });

      if (planError) {
        throw new Error("Error creating workout plan: " + planError.message);
      }

      toast.success("Profile completed! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(error instanceof Error ? error.message : "Error saving data");
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return Boolean(formData.first_name.trim() && formData.last_name.trim());
      case 2:
        return Boolean(formData.age && formData.weight);
      case 3:
        return Boolean(formData.fitness_goal && formData.workout_location && formData.intensity_level);
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep
            firstName={formData.first_name}
            lastName={formData.last_name}
            onUpdateForm={updateFormData}
          />
        );
      case 2:
        return (
          <BodyInfoStep
            age={formData.age}
            weight={formData.weight}
            onUpdateForm={updateFormData}
          />
        );
      case 3:
        return (
          <PreferencesStep
            fitnessGoal={formData.fitness_goal}
            workoutLocation={formData.workout_location}
            intensityLevel={formData.intensity_level}
            onUpdateForm={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-purple-900 via-deep-purple-800 to-deep-purple-900">
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-500/10 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-600/10 blur-3xl bottom-20 right-20 -z-10"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-xl border-purple-300">
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl font-bold text-center text-purple-900 font-poppins">
              {step === 1 ? "Welcome to PULO" : `Step ${step} of 3`}
            </CardTitle>
            <div className="w-full bg-gray-200 h-3 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-purple-700 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="font-inter">
            <div className="space-y-8">
              {renderStep()}
              <StepNavigation
                currentStep={step}
                loading={loading}
                canProceed={canProceed()}
                onPrevious={() => setStep((s) => s - 1)}
                onNext={() => setStep((s) => s + 1)}
                onComplete={handleSubmit}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
