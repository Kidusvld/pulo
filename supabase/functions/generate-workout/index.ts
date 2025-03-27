
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
  age: z.number().min(18).max(80),
  weight: z.number().min(30).max(500),
  fitnessGoal: z.enum(['build_muscle', 'lose_fat', 'increase_mobility', 'stay_active']),
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

    // Define exercise pools based on location, intensity and goal
    const exercises = {
      home: {
        cardio: ['Jump Rope', 'Jumping Jacks', 'High Knees', 'Mountain Climbers', 'Burpees'],
        strength: ['Push-ups', 'Squats', 'Lunges', 'Plank', 'Glute Bridges', 'Wall Sits'],
        flexibility: ['Standing Forward Bend', 'Butterfly Stretch', 'Child\'s Pose', 'Cat-Cow Stretch', 'Pigeon Pose']
      },
      gym: {
        cardio: ['Treadmill', 'Elliptical', 'Stair Climber', 'Rowing Machine', 'Exercise Bike'],
        strength: ['Bench Press', 'Squats', 'Deadlifts', 'Lat Pulldowns', 'Leg Press', 'Shoulder Press'],
        flexibility: ['Foam Rolling', 'Stretching Machine', 'Yoga Mat Stretches', 'Cable Rotations', 'Dynamic Stretches']
      }
    };

    // Adjust exercise selection based on user characteristics
    const getExercisePool = () => {
      // Location-based exercises
      const locationExercises = exercises[validatedData.workoutLocation];
      
      // Goal-based exercises
      let primaryFocus = [];
      let secondaryFocus = [];
      
      switch(validatedData.fitnessGoal) {
        case 'build_muscle':
          primaryFocus = [...locationExercises.strength];
          secondaryFocus = [...locationExercises.cardio, ...locationExercises.flexibility];
          break;
        case 'lose_fat':
          primaryFocus = [...locationExercises.cardio];
          secondaryFocus = [...locationExercises.strength, ...locationExercises.flexibility];
          break;
        case 'increase_mobility':
          primaryFocus = [...locationExercises.flexibility];
          secondaryFocus = [...locationExercises.strength, ...locationExercises.cardio];
          break;
        case 'stay_active':
          primaryFocus = [...locationExercises.cardio, ...locationExercises.strength];
          secondaryFocus = [...locationExercises.flexibility];
          break;
      }
      
      // Age adjustments
      if (validatedData.age > 50) {
        // More flexibility and less high-impact for older users
        primaryFocus = primaryFocus.filter(ex => 
          !['Burpees', 'Jump Rope', 'High Knees', 'Mountain Climbers'].includes(ex));
        primaryFocus.push(...locationExercises.flexibility.slice(0, 2));
      }
      
      // Return mixed pool with primary focus first
      return [...primaryFocus, ...secondaryFocus];
    };
    
    const exercisePool = getExercisePool();

    // Generate workout plan
    const workouts = [];
    for (let day = 1; day <= validatedData.numberOfDays; day++) {
      // Number of exercises based on intensity
      const exercisesPerDay = {
        beginner: 4,
        intermediate: 6,
        advanced: 8
      }[validatedData.intensityLevel];

      // Select exercises for the day
      const dayExercises = [];
      const shuffled = [...exercisePool].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < exercisesPerDay; i++) {
        // Scale sets, reps, and rest based on user data
        const exercise = {
          name: shuffled[i],
          sets: validatedData.intensityLevel === 'beginner' ? 3 : 
                validatedData.intensityLevel === 'intermediate' ? 4 : 5,
          reps: (() => {
            // Set reps based on fitness goal
            if (validatedData.fitnessGoal === 'build_muscle') return 8;
            if (validatedData.fitnessGoal === 'lose_fat') return 15;
            if (validatedData.fitnessGoal === 'stay_active') return 12;
            return 10; // increase_mobility
          })(),
          rest: (() => {
            // Set rest periods based on goal and intensity
            if (validatedData.fitnessGoal === 'build_muscle') return 90;
            if (validatedData.fitnessGoal === 'lose_fat') return 30;
            if (validatedData.intensityLevel === 'beginner') return 60;
            if (validatedData.intensityLevel === 'advanced') return 45;
            return 60; // default
          })()
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
