
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
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };
  
  return (
    <motion.div 
      className="space-y-10"
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center mb-8"
        variants={itemVariants}
        custom={0}
      >
        <div className="bg-gradient-to-br from-saas-brand-primary/10 to-saas-brand-secondary/10 mx-auto rounded-full w-24 h-24 flex items-center justify-center mb-6 border border-saas-brand-primary/20 shadow-lg">
          <Calendar className="h-14 w-14 text-saas-brand-primary" />
        </div>
        <h3 className="text-section text-saas-text-primary font-montserrat mb-3">Your Body Profile</h3>
        <p className="text-body text-saas-text-secondary">Helps us create workouts that match your needs</p>
      </motion.div>

      <motion.div 
        className="space-y-8"
        variants={itemVariants}
        custom={1}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Label htmlFor="age" className="text-card-title font-montserrat text-saas-text-primary">Your Age</Label>
            <span className="text-2xl font-montserrat font-black text-saas-brand-primary bg-gradient-to-br from-saas-brand-primary/10 to-saas-brand-secondary/10 px-4 py-2 rounded-full border border-saas-brand-primary/20">{ageValue}</span>
          </div>
          <div className="px-2 py-6">
            <Slider
              id="age"
              defaultValue={[ageValue]}
              max={100}
              min={18}
              step={1}
              onValueChange={handleAgeChange}
              className="bg-saas-bg-primary"
            />
            <div className="flex justify-between mt-3 text-sm text-saas-text-secondary font-inter font-medium">
              <span>18</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={itemVariants}
        custom={2}
      >
        <Label htmlFor="weight-input" className="text-card-title font-montserrat text-saas-text-primary">Your Weight (lbs)</Label>
        <div className="relative">
          <Weight className="absolute left-4 top-4 h-6 w-6 text-saas-text-muted" />
          <Input
            id="weight-input"
            type="number"
            value={weight.includes("_") ? "" : weight}
            onChange={(e) => onUpdateForm("weight", e.target.value)}
            placeholder="Enter your weight in lbs"
            className="pl-14 bg-white text-center h-16 text-xl font-opensans border-saas-border focus:ring-saas-brand-primary rounded-xl"
          />
        </div>
        <p className="text-center text-saas-text-secondary text-body-small font-opensans">
          This helps us calculate the right workout intensity for you
        </p>
      </motion.div>
    </motion.div>
  );
};
