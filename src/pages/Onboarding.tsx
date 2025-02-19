
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PersonalInfoStep } from "@/components/onboarding/PersonalInfoStep";
import { PhysicalInfoStep } from "@/components/onboarding/PhysicalInfoStep";
import { PreferencesStep } from "@/components/onboarding/PreferencesStep";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { formData, loading, updateFormData, handleSubmit } = useOnboardingForm();

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep
            firstName={formData.first_name}
            lastName={formData.last_name}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <PhysicalInfoStep
            age={formData.age}
            weight={formData.weight}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <PreferencesStep
            fitnessGoal={formData.fitness_goal}
            workoutLocation={formData.workout_location}
            intensityLevel={formData.intensity_level}
            onUpdate={updateFormData}
          />
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
        return (
          formData.fitness_goal &&
          formData.workout_location &&
          formData.intensity_level
        );
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80")',
          }}
        />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Complete Your Profile ({step}/3)
              </CardTitle>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
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
                      className="flex items-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      onClick={() => setStep((s) => s + 1)}
                      disabled={!canProceed() || loading}
                      className="ml-auto bg-purple-600 hover:bg-purple-700"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || loading}
                      className="ml-auto bg-purple-600 hover:bg-purple-700"
                    >
                      Complete Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
