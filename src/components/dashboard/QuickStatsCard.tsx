
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Dumbbell, Clock, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface QuickStatsCardProps {
  weeklyWorkouts: number;
  caloriesBurned: number;
  minutesActive: number;
}

export const QuickStatsCard = ({ 
  weeklyWorkouts, 
  caloriesBurned, 
  minutesActive 
}: QuickStatsCardProps) => {
  // Calculate weekly target progress (assuming 3-5 workouts per week is target)
  const weeklyWorkoutProgress = Math.min(100, (weeklyWorkouts / 3) * 100);
  
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-lg shadow-purple-100/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-purple-900">
          <Activity className="h-5 w-5 text-purple-600" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="bg-purple-50/50 rounded-lg p-3 border border-purple-100 flex flex-col items-center">
            <div className="mb-2 flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">Weekly</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-900">{weeklyWorkouts}</p>
              <p className="text-xs text-purple-500 mt-1">Workouts</p>
            </div>
            <div className="w-full mt-2">
              <Progress value={weeklyWorkoutProgress} className="h-1.5 bg-purple-100" />
            </div>
          </div>
          
          <div className="bg-purple-50/50 rounded-lg p-3 border border-purple-100 flex flex-col items-center">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-purple-600 font-medium">Burned</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-900">{caloriesBurned}</p>
              <p className="text-xs text-purple-500 mt-1">Calories</p>
            </div>
            <Badge variant="success" className="mt-2 text-xs">
              +{Math.round(caloriesBurned/7)} daily
            </Badge>
          </div>
          
          <div className="bg-purple-50/50 rounded-lg p-3 border border-purple-100 flex flex-col items-center">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="text-sm text-purple-600 font-medium">Active</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-900">{minutesActive}</p>
              <p className="text-xs text-purple-500 mt-1">Minutes</p>
            </div>
            <Badge variant="purple" className="mt-2 text-xs">
              {Math.round(minutesActive/60)} hours
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
