
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, UserCircle2 } from "lucide-react";

interface PersonalInfoStepProps {
  firstName: string;
  lastName: string;
  onUpdateForm: (field: string, value: string) => void;
}

export const PersonalInfoStep = ({ firstName, lastName, onUpdateForm }: PersonalInfoStepProps) => {
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
      className="space-y-6"
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center mb-6"
        variants={itemVariants}
        custom={0}
      >
        <div className="bg-purple-100 mx-auto rounded-full w-20 h-20 flex items-center justify-center mb-4">
          <UserCircle2 className="h-12 w-12 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-purple-800 font-poppins">Let's get to know you</h3>
        <p className="text-gray-600 mt-1">We'll use this to personalize your experience</p>
      </motion.div>

      <motion.div 
        className="space-y-4"
        variants={itemVariants}
        custom={1}
      >
        <div className="space-y-2">
          <Label htmlFor="first_name" className="font-inter text-purple-900">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="first_name"
              type="text"
              value={firstName}
              onChange={(e) => onUpdateForm("first_name", e.target.value)}
              placeholder="Enter your first name"
              className="pl-10 bg-white border-purple-200 focus-visible:ring-purple-500 font-inter"
            />
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-2"
        variants={itemVariants}
        custom={2}
      >
        <Label htmlFor="last_name" className="font-inter text-purple-900">Last Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="last_name"
            type="text"
            value={lastName}
            onChange={(e) => onUpdateForm("last_name", e.target.value)}
            placeholder="Enter your last name"
            className="pl-10 bg-white border-purple-200 focus-visible:ring-purple-500 font-inter"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
