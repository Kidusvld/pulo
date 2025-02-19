
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhysicalInfoStepProps {
  age: string;
  weight: string;
  onUpdate: (field: string, value: string) => void;
}

export const PhysicalInfoStep = ({ age, weight, onUpdate }: PhysicalInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => onUpdate("age", e.target.value)}
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
          onChange={(e) => onUpdate("weight", e.target.value)}
          placeholder="Enter your weight"
          className="bg-white"
        />
      </div>
    </div>
  );
};
