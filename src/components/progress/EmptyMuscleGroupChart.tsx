
import { Dumbbell } from "lucide-react";

export const EmptyMuscleGroupChart = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500">
      <Dumbbell className="h-12 w-12 text-purple-200 mb-3" />
      <p className="text-lg font-medium">No data yet</p>
      <p className="text-sm text-gray-400 mt-1">Log your workouts to see muscle group focus</p>
    </div>
  );
};
