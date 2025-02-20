
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkoutRequest {
  age: number;
  weight: number;
  fitnessGoal: 'build_muscle' | 'lose_fat' | 'increase_mobility';
  workoutLocation: 'home' | 'gym';
  equipment: string[];
  intensityLevel: 'beginner' | 'intermediate' | 'advanced';
  numberOfDays: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { age, weight, fitnessGoal, workoutLocation, equipment, intensityLevel, numberOfDays } = await req.json() as WorkoutRequest;

    // Define exercise pools based on location and equipment
    const homeExercises = [
      'Push-ups', 'Squats', 'Lunges', 'Plank', 'Mountain Climbers',
      'Burpees', 'Jump Rope', 'Dumbbell Rows', 'Bicycle Crunches',
      'Glute Bridges', 'Wall Sits', 'Diamond Push-ups'
    ];

    const gymExercises = [
      'Bench Press', 'Squats', 'Deadlifts', 'Lat Pulldowns', 'Leg Press',
      'Shoulder Press', 'Cable Rows', 'Leg Extensions', 'Bicep Curls',
      'Tricep Pushdowns', 'Chest Flyes', 'Romanian Deadlifts'
    ];

    // Select exercise pool based on location
    const exercisePool = workoutLocation === 'home' ? homeExercises : gymExercises;

    // Generate workout plan
    const workouts = [];
    for (let day = 1; day <= numberOfDays; day++) {
      // Number of exercises based on intensity
      const exercisesPerDay = {
        beginner: 4,
        intermediate: 6,
        advanced: 8
      }[intensityLevel];

      // Select random exercises for the day
      const dayExercises = [];
      const shuffled = [...exercisePool].sort(() => 0.5 - Math.random());
      for (let i = 0; i < exercisesPerDay; i++) {
        const exercise = {
          name: shuffled[i],
          sets: intensityLevel === 'beginner' ? 3 : intensityLevel === 'intermediate' ? 4 : 5,
          reps: fitnessGoal === 'build_muscle' ? 8 : fitnessGoal === 'lose_fat' ? 15 : 12,
          rest: fitnessGoal === 'build_muscle' ? 90 : fitnessGoal === 'lose_fat' ? 30 : 60
        };
        dayExercises.push(exercise);
      }

      workouts.push({
        day,
        exercises: dayExercises
      });
    }

    return new Response(
      JSON.stringify({ workouts }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate-workout function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
