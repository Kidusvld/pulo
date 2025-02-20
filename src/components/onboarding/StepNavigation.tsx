
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  loading: boolean;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export const StepNavigation = ({
  currentStep,
  loading,
  canProceed,
  onPrevious,
  onNext,
  onComplete,
}: StepNavigationProps) => {
  return (
    <div className="flex justify-between pt-4">
      {currentStep > 1 && (
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={loading}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
      )}
      {currentStep < 3 ? (
        <Button
          onClick={onNext}
          disabled={!canProceed || loading}
          className="ml-auto bg-purple-600 hover:bg-purple-700"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={onComplete}
          disabled={!canProceed || loading}
          className="ml-auto bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              Complete Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};
