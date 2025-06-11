
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Weight, Calendar } from "lucide-react";

interface BodyInfoStepProps {
  age: string;
  weight: string;
  onUpdateForm: (field: string, value: string) => void;
}

export const BodyInfoStep = ({ age, weight, onUpdateForm }: BodyInfoStepProps) => {
  // Convert age string to number for slider
  const ageValue = age ? parseInt(age) : 30;
  
  const handleAgeChange = (value: number[]) => {
    onUpdateForm("age", value[0].toString());
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };
  
  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center mb-6"
        variants={itemVariants}
        custom={0}
      >
        <div className="bg-gradient-to-br from-saas-brand-primary/10 to-saas-brand-secondary/10 mx-auto rounded-full w-20 h-20 flex items-center justify-center mb-4 border border-saas-brand-primary/20">
          <Calendar className="h-12 w-12 text-saas-brand-primary" />
        </div>
        <h3 className="text-xl font-semibold text-saas-text-primary font-montserrat">Your Body Profile</h3>
        <p className="text-saas-text-secondary mt-1 font-opensans">Helps us create workouts that match your needs</p>
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={itemVariants}
        custom={1}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="age" className="text-lg font-medium font-montserrat text-saas-text-primary">Your Age</Label>
            <span className="text-xl font-bold text-saas-brand-primary font-montserrat bg-gradient-to-br from-saas-brand-primary/10 to-saas-brand-secondary/10 px-3 py-1 rounded-full border border-saas-brand-primary/20">{ageValue}</span>
          </div>
          <div className="px-1 py-4">
            <Slider
              id="age"
              defaultValue={[ageValue]}
              max={100}
              min={18}
              step={1}
              onValueChange={handleAgeChange}
              className="bg-saas-bg-primary"
            />
            <div className="flex justify-between mt-2 text-sm text-saas-text-secondary font-opensans">
              <span>18</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-4"
        variants={itemVariants}
        custom={2}
      >
        <Label htmlFor="weight-input" className="text-lg font-medium font-montserrat text-saas-text-primary">Your Weight (lbs)</Label>
        <div className="relative">
          <Weight className="absolute left-3 top-3 h-5 w-5 text-saas-text-muted" />
          <Input
            id="weight-input"
            type="number"
            value={weight.includes("_") ? "" : weight}
            onChange={(e) => onUpdateForm("weight", e.target.value)}
            placeholder="Enter your weight in lbs"
            className="pl-10 bg-white text-center h-12 text-lg font-opensans border-saas-border focus:ring-saas-brand-primary rounded-xl"
          />
        </div>
        <p className="text-center text-saas-text-secondary text-sm mt-2 font-opensans">
          This helps us calculate the right workout intensity for you
        </p>
      </motion.div>
    </motion.div>
  );
};
