
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkoutRequest {
  age: number;
  weight: number;
  fitnessGoal: 'lose_weight' | 'build_muscle' | 'stay_fit';
  workoutLocation: 'home' | 'gym';
  equipment: string[];
  intensityLevel: 'beginner' | 'intermediate' | 'advanced';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { age, weight, fitnessGoal, workoutLocation, equipment, intensityLevel } = await req.json() as WorkoutRequest;

    // Adjust workout parameters based on intensity level
    const getIntensityMultipliers = (level: string) => {
      switch (level) {
        case 'beginner':
          return {
            sets: { min: 2, max: 3 },
            reps: { min: 8, max: 12 },
            rest: { min: 60, max: 90 },
            exercisesPerDay: { min: 4, max: 6 }
          };
        case 'intermediate':
          return {
            sets: { min: 3, max: 4 },
            reps: { min: 10, max: 15 },
            rest: { min: 45, max: 75 },
            exercisesPerDay: { min: 6, max: 8 }
          };
        case 'advanced':
          return {
            sets: { min: 4, max: 5 },
            reps: { min: 12, max: 20 },
            rest: { min: 30, max: 60 },
            exercisesPerDay: { min: 8, max: 10 }
          };
        default:
          return {
            sets: { min: 2, max: 3 },
            reps: { min: 8, max: 12 },
            rest: { min: 60, max: 90 },
            exercisesPerDay: { min: 4, max: 6 }
          };
      }
    };

    // Exercise pools based on location and equipment
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

    const intensityParams = getIntensityMultipliers(intensityLevel);

    // Shuffle array function
    const shuffleArray = <T>(array: T[]): T[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Generate a 3-day workout plan
    const workouts = Array.from({ length: 3 }, (_, i) => {
      const exercisesCount = Math.floor(
        Math.random() * 
        (intensityParams.exercisesPerDay.max - intensityParams.exercisesPerDay.min + 1) + 
        intensityParams.exercisesPerDay.min
      );

      const poolType = workoutLocation as 'home' | 'gym';
      const exercisePool = [
        ...exercises[poolType].cardio,
        ...exercises[poolType].strength,
        ...exercises[poolType].compound
      ];

      // Shuffle the pool and take unique exercises
      const shuffledExercises = shuffleArray([...exercisePool]);
      const selectedExercises = shuffledExercises.slice(0, exercisesCount);
      
      const dayExercises = selectedExercises.map(name => {
        const sets = Math.floor(
          Math.random() * (intensityParams.sets.max - intensityParams.sets.min + 1) + 
          intensityParams.sets.min
        );
        const reps = Math.floor(
          Math.random() * (intensityParams.reps.max - intensityParams.reps.min + 1) + 
          intensityParams.reps.min
        );
        const rest = Math.floor(
          Math.random() * (intensityParams.rest.max - intensityParams.rest.min + 1) + 
          intensityParams.rest.min
        );

        return { name, sets, reps, rest };
      });

      // Add more challenging variations for advanced levels
      if (intensityLevel === 'advanced') {
        dayExercises.forEach(exercise => {
          if (Math.random() > 0.5) {
            exercise.name = `${exercise.name} (with progressive overload)`;
          }
        });
      }

      return {
        day: i + 1,
        exercises: dayExercises
      };
    });

    console.log('Generated workout plan:', { workouts });

    return new Response(
      JSON.stringify({ workouts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
