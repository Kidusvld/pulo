
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

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
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="age" className="text-lg font-medium font-poppins">Your Age</Label>
          <span className="text-xl font-bold text-purple-700 font-poppins">{ageValue}</span>
        </div>
        <div className="px-1 py-4">
          <Slider
            id="age"
            defaultValue={[ageValue]}
            max={100}
            min={18}
            step={1}
            onValueChange={handleAgeChange}
            className="bg-purple-100"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500 font-inter">
            <span>18</span>
            <span>100</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="weight-input" className="text-lg font-medium font-poppins">Your Weight (lbs)</Label>
        <Input
          id="weight-input"
          type="number"
          value={weight.includes("_") ? "" : weight}
          onChange={(e) => onUpdateForm("weight", e.target.value)}
          placeholder="Enter your weight in lbs"
          className="bg-white text-center h-12 text-lg font-inter border-purple-200 focus:ring-purple-700"
        />
      </div>
    </div>
  );
};
