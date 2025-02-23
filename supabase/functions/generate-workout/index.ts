
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

// Input validation schema
const WorkoutRequestSchema = z.object({
  age: z.number().min(13).max(100),
  weight: z.number().min(30).max(500),
  fitnessGoal: z.enum(['build_muscle', 'lose_fat', 'increase_mobility']),
  workoutLocation: z.enum(['home', 'gym']),
  equipment: z.array(z.string()),
  intensityLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  numberOfDays: z.number().min(1).max(7)
});

serve(async (req: Request) => {
  console.log("Received request to generate workout");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse and validate request body
    const body = await req.json();
    console.log("Request body:", body);
    const validatedData = WorkoutRequestSchema.parse(body);

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
    const exercisePool = validatedData.workoutLocation === 'home' ? homeExercises : gymExercises;

    // Generate workout plan
    const workouts = [];
    for (let day = 1; day <= validatedData.numberOfDays; day++) {
      // Number of exercises based on intensity
      const exercisesPerDay = {
        beginner: 4,
        intermediate: 6,
        advanced: 8
      }[validatedData.intensityLevel];

      // Select random exercises for the day
      const dayExercises = [];
      const shuffled = [...exercisePool].sort(() => 0.5 - Math.random());
      for (let i = 0; i < exercisesPerDay; i++) {
        const exercise = {
          name: shuffled[i],
          sets: validatedData.intensityLevel === 'beginner' ? 3 : validatedData.intensityLevel === 'intermediate' ? 4 : 5,
          reps: validatedData.fitnessGoal === 'build_muscle' ? 8 : validatedData.fitnessGoal === 'lose_fat' ? 15 : 12,
          rest: validatedData.fitnessGoal === 'build_muscle' ? 90 : validatedData.fitnessGoal === 'lose_fat' ? 30 : 60
        };
        dayExercises.push(exercise);
      }

      workouts.push({
        day,
        exercises: dayExercises
      });
    }

    console.log("Generated workouts successfully");

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
    console.error('Error:', error.message);
    
    // Return appropriate error response
    const status = error.message === 'Method not allowed' ? 405 :
                  error instanceof z.ZodError ? 400 : 500;
    
    return new Response(
      JSON.stringify({
        error: error instanceof z.ZodError ? 
          'Invalid request data' : 
          error.message
      }),
      {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
