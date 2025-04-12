
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dumbbell, Flame, Leaf, Activity, Zap, Home, Target } from "lucide-react";
import { motion } from "framer-motion";

interface PreferencesStepProps {
  fitnessGoal: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workoutLocation: "home" | "gym";
  intensityLevel: "easy" | "moderate" | "hard" | "intense";
  onUpdateForm: (field: string, value: string) => void;
}

export const PreferencesStep = ({
  fitnessGoal,
  workoutLocation,
  intensityLevel,
  onUpdateForm,
}: PreferencesStepProps) => {
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

  const cardVariants = {
    inactive: { scale: 0.95, opacity: 0.7 },
    active: { scale: 1, opacity: 1 }
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
        <div className="bg-purple-100 mx-auto rounded-full w-20 h-20 flex items-center justify-center mb-4">
          <Target className="h-12 w-12 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-purple-800 font-poppins">Your Fitness Goals</h3>
        <p className="text-gray-600 mt-1">Tell us what you want to achieve</p>
      </motion.div>

      <motion.div 
        className="space-y-4" 
        variants={itemVariants} 
        custom={1}
      >
        <Label className="text-lg font-medium font-poppins text-purple-800">What's your goal today?</Label>
        <ToggleGroup 
          type="single" 
          className="grid grid-cols-2 gap-4"
          value={fitnessGoal}
          onValueChange={(value) => {
            if (value) onUpdateForm("fitness_goal", value);
          }}
        >
          {[
            { value: "build_muscle", label: "Build Muscle", icon: Dumbbell },
            { value: "lose_fat", label: "Lose Fat", icon: Flame },
            { value: "increase_mobility", label: "Get More Flexible", icon: Leaf },
            { value: "stay_active", label: "Stay Active", icon: Activity }
          ].map((goal, index) => (
            <motion.div 
              key={goal.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              animate={fitnessGoal === goal.value ? "active" : "inactive"}
              variants={cardVariants}
              custom={index}
              className="relative"
            >
              <ToggleGroupItem 
                value={goal.value} 
                className="flex flex-col items-center gap-2 py-4 border-2 data-[state=on]:border-white data-[state=on]:bg-gradient-to-br from-purple-600 to-purple-700 bg-purple-500 text-white rounded-xl transition-all w-full h-full"
              >
                <goal.icon className="h-8 w-8 text-white" />
                <span className="font-poppins font-bold text-white">{goal.label}</span>
              </ToggleGroupItem>
            </motion.div>
          ))}
        </ToggleGroup>
      </motion.div>

      <motion.div 
        className="space-y-4" 
        variants={itemVariants} 
        custom={2}
      >
        <Label className="text-lg font-medium font-poppins text-purple-800">How hard do you want to push today?</Label>
        <RadioGroup 
          value={intensityLevel} 
          onValueChange={(value) => onUpdateForm("intensity_level", value)}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { value: "easy", label: "Easy", icon: <Leaf className="h-6 w-6 mb-1" /> },
            { value: "moderate", label: "Moderate", icon: <Activity className="h-6 w-6 mb-1" /> },
            { value: "hard", label: "Hard", icon: <Dumbbell className="h-6 w-6 mb-1" /> },
            { value: "intense", label: "Intense", icon: <Zap className="h-6 w-6 mb-1" /> }
          ].map((intensity, index) => (
            <motion.div 
              key={intensity.value} 
              className="relative"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              animate={intensityLevel === intensity.value ? "active" : "inactive"}
              variants={cardVariants}
              custom={index}
            >
              <RadioGroupItem 
                value={intensity.value} 
                id={intensity.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={intensity.value}
                className="flex flex-col items-center justify-center h-16 rounded-lg border-2 border-transparent bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-purple-600 peer-data-[state=checked]:to-purple-800 peer-data-[state=checked]:border-white transition-all font-poppins font-bold"
              >
                {intensity.icon}
                {intensity.label}
              </Label>
            </motion.div>
          ))}
        </RadioGroup>
      </motion.div>

      <motion.div 
        className="space-y-4"
        variants={itemVariants} 
        custom={3}
      >
        <Label className="text-lg font-medium font-poppins text-purple-800">Workout Location</Label>
        <RadioGroup 
          value={workoutLocation}
          onValueChange={(value) => onUpdateForm("workout_location", value)}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { value: "home", label: "Home", icon: <Home className="h-6 w-6 mb-1" /> },
            { value: "gym", label: "Gym", icon: <Dumbbell className="h-6 w-6 mb-1" /> }
          ].map((location, index) => (
            <motion.div 
              key={location.value} 
              className="relative"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              animate={workoutLocation === location.value ? "active" : "inactive"}
              variants={cardVariants}
              custom={index}
            >
              <RadioGroupItem 
                value={location.value} 
                id={`location-${location.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`location-${location.value}`}
                className="flex flex-col items-center justify-center h-16 rounded-lg border-2 border-transparent bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-purple-600 peer-data-[state=checked]:to-purple-800 peer-data-[state=checked]:border-white transition-all font-poppins font-bold"
              >
                {location.icon}
                {location.label}
              </Label>
            </motion.div>
          ))}
        </RadioGroup>
      </motion.div>
    </motion.div>
  );
};
