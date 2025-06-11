
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
      className="space-y-8"
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center mb-8"
        variants={itemVariants}
        custom={0}
      >
        <div className="bg-gradient-to-br from-saas-brand-primary/10 to-saas-brand-secondary/10 mx-auto rounded-full w-24 h-24 flex items-center justify-center mb-6 border border-saas-brand-primary/20 shadow-lg">
          <UserCircle2 className="h-14 w-14 text-saas-brand-primary" />
        </div>
        <h3 className="text-section text-saas-text-primary font-montserrat mb-3">Let's get to know you</h3>
        <p className="text-body text-saas-text-secondary">We'll use this to personalize your experience</p>
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={itemVariants}
        custom={1}
      >
        <div className="space-y-3">
          <Label htmlFor="first_name" className="text-label text-saas-text-primary">First Name</Label>
          <div className="relative">
            <User className="absolute left-4 top-4 h-5 w-5 text-saas-text-muted" />
            <Input
              id="first_name"
              type="text"
              value={firstName}
              onChange={(e) => onUpdateForm("first_name", e.target.value)}
              placeholder="Enter your first name"
              className="pl-12 bg-white border-saas-border focus-visible:ring-saas-brand-primary font-opensans rounded-xl h-14 text-lg"
            />
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-3"
        variants={itemVariants}
        custom={2}
      >
        <Label htmlFor="last_name" className="text-label text-saas-text-primary">Last Name</Label>
        <div className="relative">
          <User className="absolute left-4 top-4 h-5 w-5 text-saas-text-muted" />
          <Input
            id="last_name"
            type="text"
            value={lastName}
            onChange={(e) => onUpdateForm("last_name", e.target.value)}
            placeholder="Enter your last name"
            className="pl-12 bg-white border-saas-border focus-visible:ring-saas-brand-primary font-opensans rounded-xl h-14 text-lg"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
