
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Timer, Dumbbell, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { WorkoutPlan } from "@/hooks/useDashboardData";

interface TodayWorkoutCardProps {
  workoutPlan: WorkoutPlan | null;
  onGeneratePlan?: () => void;
}

export const TodayWorkoutCard = ({
  workoutPlan,
  onGeneratePlan
}: TodayWorkoutCardProps) => {
  const navigate = useNavigate();
  
  // Get today's day of the week (0-6, where 0 is Sunday)
  const dayOfWeek = new Date().getDay();
  // Convert to workout day index (1-7)
  const workoutDayIndex = dayOfWeek === 0 ? 7 : dayOfWeek;
  
  // Find today's workout
  const todayWorkout = workoutPlan?.plan_data?.workouts?.find(
    workout => workout.day === workoutDayIndex
  );
  
  // Calculate workout duration in minutes (assuming each exercise takes time + rest)
  const calculateDuration = () => {
    if (!todayWorkout) return 30; // Default duration
    
    return todayWorkout.exercises.reduce((total, exercise) => {
      const exerciseTime = exercise.duration || (exercise.reps ? exercise.reps * 3 : 30);
      return total + exerciseTime + (exercise.rest / 60);
    }, 0);
  };
  
  const workoutDuration = Math.round(calculateDuration());
  const exerciseCount = todayWorkout?.exercises.length || 0;
  
  // Determine workout intensity
  const getIntensityLabel = () => {
    if (!workoutPlan) return "Moderate";
    
    switch(workoutPlan.intensity_level) {
      case "beginner":
      case "easy":
        return "Easy";
      case "moderate":
      case "intermediate":
        return "Moderate";
      case "hard":
      case "advanced":
      case "intense":
        return "Intense";
      default:
        return "Moderate";
    }
  };
  
  // Update to use only valid Badge variants
  const getIntensityColor = () => {
    if (!workoutPlan) return "purple";
    
    switch(workoutPlan.intensity_level) {
      case "beginner":
      case "easy":
        return "success";
      case "moderate":
      case "intermediate":
        return "purple";
      case "hard":
      case "advanced":
      case "intense":
        return "secondary";
      default:
        return "purple";
    }
  };
  
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl shadow-purple-100/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-purple-900">
          <CalendarClock className="h-5 w-5 text-purple-600" />
          Today's Workout
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todayWorkout ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-purple-800">
                  {workoutPlan?.fitness_goal === "build_muscle" ? "Strength Training" : 
                   workoutPlan?.fitness_goal === "lose_fat" ? "Fat Burning" :
                   workoutPlan?.fitness_goal === "increase_mobility" ? "Flexibility" : 
                   "Full Body Workout"}
                </h3>
                <div className="flex gap-4 mt-1.5">
                  <div className="flex items-center text-sm text-gray-600">
                    <Timer className="w-4 h-4 mr-1 text-purple-500" />
                    {workoutDuration} min
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Dumbbell className="w-4 h-4 mr-1 text-purple-500" />
                    {exerciseCount} exercises
                  </div>
                </div>
              </div>
              <Badge variant={getIntensityColor() as "purple" | "success" | "secondary"}>
                {getIntensityLabel()}
              </Badge>
            </div>
            
            <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-medium text-purple-800 mb-2">Exercises:</h4>
              <ul className="space-y-1">
                {todayWorkout.exercises.slice(0, 3).map((exercise, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2 inline-block"></span>
                    {exercise.name} ({exercise.sets} sets)
                  </li>
                ))}
                {todayWorkout.exercises.length > 3 && (
                  <li className="text-xs text-purple-600 italic mt-1">
                    + {todayWorkout.exercises.length - 3} more exercises
                  </li>
                )}
              </ul>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={() => navigate("/log-workout")}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Workout
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Dumbbell className="h-12 w-12 text-purple-200 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No workout planned for today</p>
            <Button
              onClick={onGeneratePlan}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200"
            >
              Generate Workout Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

