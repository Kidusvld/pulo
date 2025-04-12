import { ArrowRight, Calendar, DumbbellIcon, Weight, Bike, Activity, Heart, Clock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Exercise {
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  rest: number;
}

interface Workout {
  day: number;
  exercises: Exercise[];
}

interface WorkoutPlan {
  plan_data?: {
    workouts?: Workout[];
  };
}

interface WorkoutPlanCardProps {
  workoutPlan: WorkoutPlan | null;
  numberOfDays: number;
  generatingPlan: boolean;
  onDaysChange: (days: number) => void;
  onGeneratePlan: () => void;
  onSavePlan: () => void;
  isProUser?: boolean;
}

const getExerciseIcon = (exerciseName: string) => {
  const name = exerciseName.toLowerCase();
  
  if (name.includes("dumbbell") || name.includes("curl") || name.includes("press") || name.includes("fly")) {
    return <DumbbellIcon className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else if (name.includes("barbell") || name.includes("deadlift") || name.includes("bench") || name.includes("squat")) {
    return <Weight className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else if (name.includes("bike") || name.includes("cycling")) {
    return <Bike className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else if (name.includes("run") || name.includes("sprint") || name.includes("jog")) {
    return <Activity className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else if (name.includes("plank") || name.includes("hold") || name.includes("wall sit")) {
    return <Clock className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else if (name.includes("stretch") || name.includes("yoga") || name.includes("mobility")) {
    return <Heart className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  } else {
    return <DumbbellIcon className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />;
  }
};

export const WorkoutPlanCard = ({
  workoutPlan,
  numberOfDays,
  generatingPlan,
  onDaysChange,
  onGeneratePlan,
  onSavePlan,
  isProUser = true,
}: WorkoutPlanCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl shadow-purple-100/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-purple-900">
          <DumbbellIcon className="h-5 w-5 text-purple-600" />
          Your Workout Plan
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="days" className="text-sm text-purple-600 font-medium">Days:</label>
            <Select value={numberOfDays.toString()} onValueChange={value => onDaysChange(parseInt(value))}>
              <SelectTrigger className="w-[100px] bg-white border-purple-100">
                <SelectValue placeholder="Days" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'day' : 'days'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            {workoutPlan && isProUser && (
              <Button 
                variant="outline" 
                onClick={onSavePlan} 
                className="bg-white hover:bg-purple-50 hover:text-purple-600 border-purple-100"
              >
                Save Plan
              </Button>
            )}
            <Button 
              onClick={onGeneratePlan} 
              disabled={generatingPlan || !isProUser} 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200"
            >
              {!isProUser ? (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Pro Feature
                </>
              ) : generatingPlan ? (
                "Generating..."
              ) : (
                <>
                  Generate New Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isProUser ? (
          <div className="bg-purple-50/80 rounded-lg p-8 text-center border border-purple-100">
            <Crown className="h-12 w-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-purple-800 mb-2">Pro Feature</h3>
            <p className="text-purple-600 mb-4 max-w-md mx-auto">
              Upgrade to Pro to generate personalized workout plans tailored to your fitness goals.
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              onClick={() => window.location.href = "/subscription"}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        ) : workoutPlan?.plan_data?.workouts ? (
          <div className="space-y-6">
            {workoutPlan.plan_data.workouts.map((workout, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-purple-900">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Day {workout.day}
                </h3>
                <div className="grid gap-4">
                  {workout.exercises.map((exercise, exerciseIndex) => (
                    <div 
                      key={exerciseIndex} 
                      className="bg-purple-50/50 p-4 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors duration-200"
                    >
                      <p className="font-medium text-purple-900 flex items-center">
                        {getExerciseIcon(exercise.name)}
                        {exercise.name}
                      </p>
                      <p className="text-sm text-purple-600 mt-1 ml-6">
                        {exercise.sets} sets × {exercise.duration ? 
                          `${exercise.duration} seconds` : 
                          `${exercise.reps} reps`}
                        (Rest: {Math.floor(exercise.rest / 60)} min)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DumbbellIcon className="h-16 w-16 text-purple-200 mx-auto mb-4" />
            <p className="text-gray-500">
              No workout plan generated yet. Click the button above to create one!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
