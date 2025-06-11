
import { ArrowRight, Calendar, DumbbellIcon, Weight, Bike, Activity, Heart, Clock, Loader, CalendarDays, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LoadingMascot } from "@/components/ui/loading-mascot";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

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
  targeted_body_parts?: string[];
}

interface WorkoutPlanCardProps {
  workoutPlan: WorkoutPlan | null;
  numberOfDays: number;
  generatingPlan: boolean;
  onDaysChange: (days: number) => void;
  onGeneratePlan: () => void;
  onSavePlan: () => void;
}

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
            {workoutPlan && !generatingPlan && (
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
              {generatingPlan ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-0">
        {generatingPlan ? (
          <div className="flex items-center justify-center py-20 px-6 bg-gradient-to-br from-purple-50/50 to-white/80">
            <LoadingMascot size="lg" showText={true} />
          </div>
        ) : workoutPlan?.plan_data?.workouts ? (
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {/* Show targeted body parts if they exist */}
            {workoutPlan.targeted_body_parts && workoutPlan.targeted_body_parts.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-[#8E44AD]" />
                  <span className="text-sm font-semibold text-[#5C2D91]">Targeted Focus Areas:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {workoutPlan.targeted_body_parts.map((part, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#8E44AD] text-white text-xs">
                      {part}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {workoutPlan.plan_data.workouts.map((workout, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex items-center mb-3">
                  <Badge variant="purple" className="px-3 py-1 mr-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    Day {workout.day}
                  </Badge>
                  <h3 className="font-semibold text-[#5C2D91]">Workout Plan</h3>
                </div>
                
                <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-purple-50">
                      <TableRow>
                        <TableHead className="text-[#5C2D91] font-semibold">Exercise</TableHead>
                        <TableHead className="text-[#5C2D91] font-semibold text-center">Sets</TableHead>
                        <TableHead className="text-[#5C2D91] font-semibold text-center">Reps/Duration</TableHead>
                        <TableHead className="text-[#5C2D91] font-semibold text-center">Rest</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <TableRow key={exerciseIndex}>
                          <TableCell className="font-medium flex items-center py-3">
                            {getExerciseIcon(exercise.name)}
                            {exercise.name}
                          </TableCell>
                          <TableCell className="text-center">{exercise.sets}</TableCell>
                          <TableCell className="text-center">
                            {exercise.duration ? `${exercise.duration} sec` : `${exercise.reps} reps`}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center bg-purple-50 px-2 py-1 rounded text-sm">
                              <Clock className="h-3 w-3 text-[#8E44AD] mr-1" />
                              {Math.floor(exercise.rest / 60)} min
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                <Target className="h-4 w-4 mr-2" />
                {generatingPlan ? "Generating..." : "Generate Workout Plan"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
