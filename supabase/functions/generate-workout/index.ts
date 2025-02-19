
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

interface WorkoutRequest {
  age: number;
  weight: number;
  fitnessGoal: 'lose_fat' | 'build_muscle' | 'increase_mobility';
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
        strength: ['Bench Press', 'Lat Pulldown', 'Leg Press', 'Cable Rows', 'Shoulder Press Machine'],
        compound: ['Barbell Squats', 'Deadlifts', 'Military Press', 'Bent Over Rows'],
        cardio: ['Treadmill Run', 'Rowing Machine', 'Stationary Bike', 'Elliptical', 'Stair Climber'],
        mobility: ['Dynamic Stretching', 'Yoga Flow', 'Foam Rolling', 'Joint Mobility', 'Static Stretching']
      },
      home: {
        strength: ['Push-ups', 'Diamond Push-ups', 'Bodyweight Squats', 'Lunges', 'Tricep Dips'],
        compound: ['Pull-ups', 'Pike Push-ups', 'Bulgarian Split Squats', 'Step-ups'],
        cardio: ['High Knees', 'Mountain Climbers', 'Jumping Jacks', 'Burpees', 'Jump Rope'],
        mobility: ['Sun Salutation', 'Cat-Cow Stretch', 'World's Greatest Stretch', 'Hip Opener Series', 'Joint Mobility']
      }
    };

    const getExercisesByGoal = (location: 'home' | 'gym', goal: string) => {
      const locationExercises = exercises[location];
      switch (goal) {
        case 'build_muscle':
          return [...locationExercises.compound, ...locationExercises.strength];
        case 'lose_fat':
          return [...locationExercises.cardio, ...locationExercises.compound];
        case 'increase_mobility':
          return [...locationExercises.mobility, ...locationExercises.compound];
        default:
          return [...Object.values(locationExercises)].flat();
      }
    };

    const getExerciseParameters = (goal: string, exerciseType: string) => {
      switch (goal) {
        case 'build_muscle':
          return {
            sets: Math.floor(Math.random() * 2) + 2, // 2-3 sets
            reps: Math.floor(Math.random() * 3) + 8, // 8-10 reps
            rest: (Math.floor(Math.random() * 2) + 2) * 60 // 2-3 minutes
          };
        case 'lose_fat':
          return {
            sets: Math.floor(Math.random() * 2) + 2, // 2-3 sets
            reps: Math.floor(Math.random() * 5) + 6, // 6-10 reps
            rest: (Math.floor(Math.random() * 2) + 1) * 60 // 1-2 minutes
          };
        case 'increase_mobility':
          return {
            sets: 2, // Consistent 2 sets for mobility
            reps: exerciseType.includes('Stretch') ? 30 : Math.floor(Math.random() * 5) + 6, // 30 seconds for stretches, 6-10 reps for others
            rest: 60 // 1 minute rest for mobility
          };
        default:
          return {
            sets: Math.floor(Math.random() * 2) + 2,
            reps: Math.floor(Math.random() * 5) + 6,
            rest: (Math.floor(Math.random() * 2) + 2) * 60
          };
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
      const exercisePool = getExercisesByGoal(poolType, fitnessGoal);
      const shuffledExercises = shuffleArray([...exercisePool]);
      const selectedExercises = shuffledExercises.slice(0, exercisesCount);
      
      const dayExercises = selectedExercises.map(name => {
        const params = getExerciseParameters(fitnessGoal, name);
        return {
          name,
          ...params
        };
      });

      return {
        day: i + 1,
        exercises: dayExercises
      };
    });

    console.log('Generated workout plan with goal-specific exercises:', { 
      fitnessGoal,
      workouts 
    });

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
