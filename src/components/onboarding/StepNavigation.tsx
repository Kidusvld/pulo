
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
            className="flex items-center font-montserrat bg-white border-saas-border hover:bg-saas-bg-primary hover:text-saas-brand-primary transition-all duration-300 rounded-xl"
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
            className="bg-gradient-to-r from-saas-brand-primary to-saas-brand-secondary hover:from-saas-brand-primary/90 hover:to-saas-brand-secondary/90 font-montserrat shadow-md hover:shadow-lg rounded-xl"
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
            className="bg-gradient-to-r from-saas-brand-primary to-saas-brand-secondary hover:from-saas-brand-primary/90 hover:to-saas-brand-secondary/90 font-montserrat shadow-md hover:shadow-lg px-6 rounded-xl"
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
