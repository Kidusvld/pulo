
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { z } from 'https://deno.land/x/zod@v3.16.1/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: number;
}

interface Workout {
  day: number;
  exercises: Exercise[];
}

const requestSchema = z.object({
  age: z.number().min(13).max(100),
  weight: z.number().min(30).max(500),
  fitnessGoal: z.enum(['build_muscle', 'lose_fat', 'increase_mobility']),
  workoutLocation: z.enum(['home', 'gym']),
  equipment: z.array(z.string()),
  intensityLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  numberOfDays: z.number().min(1).max(7)
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { age, weight, fitnessGoal, workoutLocation, equipment, intensityLevel, numberOfDays } = await req.json();

    // Validate the request data
    try {
      requestSchema.parse({
        age,
        weight,
        fitnessGoal,
        workoutLocation,
        equipment,
        intensityLevel,
        numberOfDays
      });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return new Response(
        JSON.stringify({
          error: 'Invalid input data',
          details: validationError.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message.replace('Number', 'Weight').replace('30', '30 lbs')
          }))
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate exercise templates based on fitness goal and intensity
    const exerciseTemplates = {
      build_muscle: {
        beginner: [
          { name: "Bodyweight Squats", sets: 3, reps: 12, rest: 60 },
          { name: "Push-Ups", sets: 3, reps: 10, rest: 60 },
          { name: "Dumbbell Rows", sets: 3, reps: 12, rest: 60 }
        ],
        intermediate: [
          { name: "Barbell Squats", sets: 4, reps: 10, rest: 90 },
          { name: "Bench Press", sets: 4, reps: 10, rest: 90 },
          { name: "Bent Over Rows", sets: 4, reps: 10, rest: 90 }
        ],
        advanced: [
          { name: "Romanian Deadlifts", sets: 5, reps: 8, rest: 120 },
          { name: "Overhead Press", sets: 5, reps: 8, rest: 120 },
          { name: "Pull-Ups", sets: 5, reps: 8, rest: 120 }
        ]
      },
      lose_fat: {
        beginner: [
          { name: "Mountain Climbers", sets: 3, reps: 15, rest: 45 },
          { name: "Jumping Jacks", sets: 3, reps: 20, rest: 45 },
          { name: "Bodyweight Lunges", sets: 3, reps: 12, rest: 45 }
        ],
        intermediate: [
          { name: "Burpees", sets: 4, reps: 12, rest: 60 },
          { name: "Jump Squats", sets: 4, reps: 15, rest: 60 },
          { name: "High Knees", sets: 4, reps: 20, rest: 60 }
        ],
        advanced: [
          { name: "Box Jumps", sets: 5, reps: 10, rest: 75 },
          { name: "Kettlebell Swings", sets: 5, reps: 15, rest: 75 },
          { name: "Sprint Intervals", sets: 5, reps: 30, rest: 75 }
        ]
      },
      increase_mobility: {
        beginner: [
          { name: "Cat-Cow Stretch", sets: 2, reps: 10, rest: 30 },
          { name: "Hip Circles", sets: 2, reps: 10, rest: 30 },
          { name: "Shoulder Rolls", sets: 2, reps: 10, rest: 30 }
        ],
        intermediate: [
          { name: "Dynamic Lunges", sets: 3, reps: 12, rest: 45 },
          { name: "Arm Circles", sets: 3, reps: 15, rest: 45 },
          { name: "World's Greatest Stretch", sets: 3, reps: 8, rest: 45 }
        ],
        advanced: [
          { name: "Spider-Man Stretch", sets: 4, reps: 10, rest: 60 },
          { name: "Inchworm Walk", sets: 4, reps: 8, rest: 60 },
          { name: "Dynamic Pigeon Pose", sets: 4, reps: 8, rest: 60 }
        ]
      }
    };

    // Generate workouts based on number of days
    const workouts: Workout[] = [];
    for (let day = 1; day <= numberOfDays; day++) {
      const exercises = exerciseTemplates[fitnessGoal][intensityLevel].map(exercise => ({
        ...exercise,
        // Adjust reps and sets based on the user's profile
        reps: Math.max(8, exercise.reps - (age > 50 ? 2 : 0)),
        sets: Math.min(5, exercise.sets + (age < 30 ? 1 : 0))
      }));

      workouts.push({
        day,
        exercises
      });
    }

    const response = {
      workouts
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
