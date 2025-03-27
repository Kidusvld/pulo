
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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
            max={70}
            min={18}
            step={1}
            onValueChange={handleAgeChange}
            className="bg-purple-100"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500 font-inter">
            <span>18</span>
            <span>65+</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="weight" className="text-lg font-medium font-poppins">Your Weight Range</Label>
        <Select
          value={weight}
          onValueChange={(value) => onUpdateForm("weight", value)}
        >
          <SelectTrigger id="weight" className="bg-white text-center h-12 text-lg font-inter">
            <SelectValue placeholder="Select your weight range" />
          </SelectTrigger>
          <SelectContent className="font-inter">
            <SelectItem value="under_120">Under 120 lbs</SelectItem>
            <SelectItem value="120_160">120–160 lbs</SelectItem>
            <SelectItem value="160_200">160–200 lbs</SelectItem>
            <SelectItem value="200_240">200–240 lbs</SelectItem>
            <SelectItem value="over_240">240+ lbs</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
