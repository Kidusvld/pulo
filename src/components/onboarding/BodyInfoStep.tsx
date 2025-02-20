
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BodyInfoStepProps {
  age: string;
  weight: string;
  onUpdateForm: (field: string, value: string) => void;
}

export const BodyInfoStep = ({ age, weight, onUpdateForm }: BodyInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => onUpdateForm("age", e.target.value)}
          placeholder="Enter your age"
          className="bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (in lbs)</Label>
        <Input
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => onUpdateForm("weight", e.target.value)}
          placeholder="Enter your weight"
          className="bg-white"
        />
      </div>
    </div>
  );
};
