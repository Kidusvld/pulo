
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, fitnessGoal, workoutLocation, intensityLevel } = await req.json();

    // Create a basic workout plan based on user preferences
    const workoutPlan = {
      workouts: [
        {
          day: 1,
          focus: "Upper Body",
          exercises: [
            {
              name: workoutLocation === 'home' ? "Push-ups" : "Bench Press",
              sets: intensityLevel === 'beginner' ? 3 : 4,
              reps: 12,
              rest: 60,
            },
            {
              name: workoutLocation === 'home' ? "Diamond Push-ups" : "Incline Dumbbell Press",
              sets: intensityLevel === 'beginner' ? 3 : 4,
              reps: 12,
              rest: 60,
            }
          ]
        },
        {
          day: 2,
          focus: "Lower Body",
          exercises: [
            {
              name: "Bodyweight Squats",
              sets: intensityLevel === 'beginner' ? 3 : 4,
              reps: 15,
              rest: 60,
            },
            {
              name: workoutLocation === 'home' ? "Lunges" : "Leg Press",
              sets: intensityLevel === 'beginner' ? 3 : 4,
              reps: 12,
              rest: 60,
            }
          ]
        },
        {
          day: 3,
          focus: "Full Body",
          exercises: [
            {
              name: workoutLocation === 'home' ? "Mountain Climbers" : "Cable Rows",
              sets: intensityLevel === 'beginner' ? 3 : 4,
              reps: 15,
              rest: 45,
            },
            {
              name: "Plank",
              sets: intensityLevel === 'beginner' ? 2 : 3,
              reps: 1,
              duration: 30,
              rest: 45,
            }
          ]
        }
      ]
    };

    return new Response(
      JSON.stringify(workoutPlan),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    );
  }
});
