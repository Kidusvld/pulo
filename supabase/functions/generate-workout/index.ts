
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

interface WorkoutRequest {
  age: number;
  weight: number;
  fitnessGoal: 'lose_weight' | 'build_muscle' | 'stay_fit';
  workoutLocation: 'home' | 'gym';
  equipment: string[];
  intensityLevel: 'beginner' | 'intermediate' | 'advanced';
  numberOfDays: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { age, weight, fitnessGoal, workoutLocation, equipment, intensityLevel, numberOfDays } = await req.json() as WorkoutRequest;

    const exercises = {
      gym: {
        cardio: ['Treadmill Run', 'Rowing Machine', 'Stationary Bike', 'Elliptical', 'Stair Climber'],
        strength: ['Bench Press', 'Lat Pulldown', 'Leg Press', 'Cable Rows', 'Shoulder Press Machine'],
        compound: ['Barbell Squats', 'Deadlifts', 'Military Press', 'Bent Over Rows']
      },
      home: {
        cardio: ['High Knees', 'Mountain Climbers', 'Jumping Jacks', 'Burpees', 'Jump Rope'],
        strength: ['Push-ups', 'Diamond Push-ups', 'Bodyweight Squats', 'Lunges', 'Tricep Dips'],
        compound: ['Pull-ups', 'Pike Push-ups', 'Bulgarian Split Squats', 'Step-ups']
      }
    };

    const shuffleArray = <T>(array: T[]): T[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const getExercisesPerDay = () => {
      switch (intensityLevel) {
        case 'beginner':
          return { min: 4, max: 6 };
        case 'intermediate':
          return { min: 6, max: 8 };
        case 'advanced':
          return { min: 8, max: 10 };
        default:
          return { min: 4, max: 6 };
      }
    };

    const workouts = Array.from({ length: numberOfDays }, (_, i) => {
      const exercisesCount = Math.floor(
        Math.random() * 
        (getExercisesPerDay().max - getExercisesPerDay().min + 1) + 
        getExercisesPerDay().min
      );

      const poolType = workoutLocation as 'home' | 'gym';
      const exercisePool = [
        ...exercises[poolType].cardio,
        ...exercises[poolType].strength,
        ...exercises[poolType].compound
      ];

      const shuffledExercises = shuffleArray([...exercisePool]);
      const selectedExercises = shuffledExercises.slice(0, exercisesCount);
      
      const dayExercises = selectedExercises.map(name => {
        // Fixed range for sets (2-3)
        const sets = Math.floor(Math.random() * 2) + 2; // Generates 2 or 3
        
        // Fixed range for reps (6-10)
        const reps = Math.floor(Math.random() * 5) + 6; // Generates 6 to 10
        
        // Fixed range for rest (2-3 minutes)
        const restMinutes = Math.floor(Math.random() * 2) + 2; // Generates 2 or 3
        const rest = restMinutes * 60; // Convert to seconds for consistency with frontend

        return { name, sets, reps, rest };
      });

      return {
        day: i + 1,
        exercises: dayExercises
      };
    });

    console.log('Generated workout plan with adjusted sets, reps, and rest times:', { workouts });

    return new Response(
      JSON.stringify({ workouts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating workout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
