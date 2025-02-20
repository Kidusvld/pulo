
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoStepProps {
  firstName: string;
  lastName: string;
  onUpdateForm: (field: string, value: string) => void;
}

export const PersonalInfoStep = ({ firstName, lastName, onUpdateForm }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          type="text"
          value={firstName}
          onChange={(e) => onUpdateForm("first_name", e.target.value)}
          placeholder="Enter your first name"
          className="bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          type="text"
          value={lastName}
          onChange={(e) => onUpdateForm("last_name", e.target.value)}
          placeholder="Enter your last name"
          className="bg-white"
        />
      </div>
    </div>
  );
};
