
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={loading}
            className="flex items-center font-inter bg-white border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        </motion.div>
      )}
      {currentStep < 3 ? (
        <motion.div
          className="ml-auto"
          whileHover={{ scale: canProceed ? 1.03 : 1 }}
          whileTap={{ scale: canProceed ? 0.97 : 1 }}
        >
          <Button
            onClick={onNext}
            disabled={!canProceed || loading}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 font-inter shadow-md shadow-purple-200/50"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="ml-auto"
          whileHover={{ scale: canProceed ? 1.03 : 1 }}
          whileTap={{ scale: canProceed ? 0.97 : 1 }}
        >
          <Button
            onClick={onComplete}
            disabled={!canProceed || loading}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 font-poppins shadow-md shadow-purple-200/50 px-6"
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
        </motion.div>
      )}
    </div>
  );
};
