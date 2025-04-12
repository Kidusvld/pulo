
import { ArrowRight, Calendar, DumbbellIcon, Weight, Bike, Activity, Heart, Clock, Sparkles, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
}

// Helper function to determine the appropriate icon for an exercise
const getExerciseIcon = (exerciseName: string) => {
  const name = exerciseName.toLowerCase();
  
  if (name.includes("dumbbell") || name.includes("curl") || name.includes("press") || name.includes("fly")) {
    return <DumbbellIcon className="h-4 w-4 text-[#8E44AD] mr-2 flex-shrink-0" />;
  } else if (name.includes("barbell") || name.includes("deadlift") || name.includes("bench") || name.includes("squat")) {
    return <Weight className="h-4 w-4 text-[#8E44AD] mr-2 flex-shrink-0" />;
  } else if (name.includes("bike") || name.includes("cycling")) {
    return <Bike className="h-4 w-4 text-[#8E44AD] mr-2 flex-shrink-0" />;
  } else if (name.includes("run") || name.includes("sprint") || name.includes("jog")) {
    return <Activity className="h-4 w-4 text-[#8E44AD] mr-2 flex-shrink-0" />;
  } else if (name.includes("plank") || name.includes("hold") || name.includes("wall sit")) {
    return <Clock className="h-4 w-4 text-[#8E44AD] mr-2 flex-shrink-0" />;
  } else if (name.includes("stretch") || name.includes("yoga") || name.includes("mobility")) {
    return <Heart className="h-4 w-4 text-[#8E44AD] mr-2 flex-shrink-0" />;
  } else {
    // Default icon for other exercises
    return <DumbbellIcon className="h-4 w-4 text-[#8E44AD] mr-2 flex-shrink-0" />;
  }
};

export const WorkoutPlanCard = ({
  workoutPlan,
  numberOfDays,
  generatingPlan,
  onDaysChange,
  onGeneratePlan,
  onSavePlan,
}: WorkoutPlanCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-300/20 shadow-xl shadow-purple-900/10 overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-purple-100/20">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-[#5C2D91]">
          <DumbbellIcon className="h-5 w-5 text-[#8E44AD]" />
          Today's Workout
        </CardTitle>
      </CardHeader>
      
      {/* Training Days Selection - More Visible */}
      <div className="flex items-center justify-end px-6 pt-4 pb-3 border-b border-purple-100/20 bg-purple-50/30">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-purple-200 shadow-sm">
            <CalendarDays className="h-4 w-4 text-[#8E44AD]" />
            <label htmlFor="days" className="text-sm text-[#8E44AD] font-medium whitespace-nowrap">Training Days:</label>
            <Select value={numberOfDays.toString()} onValueChange={value => onDaysChange(parseInt(value))}>
              <SelectTrigger className="w-[90px] bg-white border-purple-200 text-[#5C2D91] font-semibold">
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
            {workoutPlan && (
              <Button 
                variant="outline" 
                onClick={onSavePlan} 
                className="bg-white hover:bg-purple-50 hover:text-[#8E44AD] border-purple-200 flex items-center gap-1"
              >
                <Heart className="h-4 w-4" />
                Save Plan
              </Button>
            )}
            <Button 
              onClick={onGeneratePlan} 
              disabled={generatingPlan} 
              className="bg-gradient-to-r from-[#5C2D91] to-[#8E44AD] hover:from-[#5C2D91]/90 hover:to-[#8E44AD]/90 text-white transition-all duration-200 flex items-center gap-2 px-4"
            >
              {generatingPlan ? "Generating..." : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-0">
        {workoutPlan?.plan_data?.workouts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-0 divide-x divide-y divide-purple-100/20 max-h-[500px] overflow-y-auto">
            {workoutPlan.plan_data.workouts.map((workout, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-white/90 to-white/70">
                <h3 className="font-semibold flex items-center gap-2 text-[#5C2D91] mb-3 pb-2 border-b border-purple-100/30">
                  <Badge variant="purple" className="px-3 py-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Day {workout.day}
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {workout.exercises.map((exercise, exerciseIndex) => (
                    <div 
                      key={exerciseIndex} 
                      className="bg-purple-50/70 p-2 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors duration-200"
                    >
                      <p className="font-medium text-[#5C2D91] flex items-center text-sm">
                        {getExerciseIcon(exercise.name)}
                        {exercise.name}
                      </p>
                      <div className="flex flex-col mt-1">
                        <div className="ml-6 flex items-center justify-between">
                          <p className="text-xs text-[#8E44AD]/80">
                            {exercise.sets} sets × {exercise.duration ? 
                              `${exercise.duration} sec` : 
                              `${exercise.reps} reps`}
                          </p>
                        </div>
                        
                        {/* Enhanced Rest Period Display */}
                        <div className="ml-6 mt-1.5 flex items-center bg-[#F1F0FB] rounded-md px-2 py-1 border border-purple-100">
                          <Clock className="h-3.5 w-3.5 text-[#8E44AD] mr-1.5" />
                          <span className="text-xs font-semibold text-[#5C2D91]">
                            Rest: {Math.floor(exercise.rest / 60)} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-6">
            <div className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/30 max-w-md mx-auto">
              <DumbbellIcon className="h-12 w-12 text-purple-200 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-[#5C2D91] mb-2">No Workout Plan Yet</h3>
              <p className="text-[#8E44AD]/70 mb-4">
                Generate your personalized workout plan based on your fitness goals and preferences.
              </p>
              <Button 
                onClick={onGeneratePlan} 
                disabled={generatingPlan}
                className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {generatingPlan ? "Generating..." : "Generate Workout Plan"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
