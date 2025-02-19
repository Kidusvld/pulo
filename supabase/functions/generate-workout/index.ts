
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { intensityLevel } = await req.json();

    // Adjust workout parameters based on intensity level
    const getSetsAndReps = () => {
      switch (intensityLevel) {
        case 'beginner':
          return { sets: 3, reps: 10, rest: 90 };
        case 'intermediate':
          return { sets: 4, reps: 12, rest: 60 };
        case 'advanced':
          return { sets: 5, reps: 15, rest: 45 };
        default:
          return { sets: 3, reps: 10, rest: 90 };
      }
    };

    const { sets, reps, rest } = getSetsAndReps();

    const workoutPlan = {
      workouts: [
        {
          day: 1,
          focus: "Upper Body Strength",
          exercises: [
            {
              name: "Push-ups",
              sets,
              reps,
              rest,
            },
            {
              name: "Dumbbell Rows",
              sets,
              reps,
              rest,
            },
            {
              name: "Shoulder Press",
              sets,
              reps,
              rest,
            }
          ]
        },
        {
          day: 2,
          focus: "Lower Body Power",
          exercises: [
            {
              name: "Squats",
              sets,
              reps,
              rest,
            },
            {
              name: "Lunges",
              sets,
              reps,
              rest,
            },
            {
              name: "Calf Raises",
              sets,
              reps,
              rest,
            }
          ]
        },
        {
          day: 3,
          focus: "Core and Conditioning",
          exercises: [
            {
              name: "Plank",
              sets: Math.max(2, sets - 1),
              duration: intensityLevel === 'advanced' ? 60 : 30,
              reps: 1,
              rest,
            },
            {
              name: "Mountain Climbers",
              sets,
              reps: reps * 2,
              rest,
            },
            {
              name: "Russian Twists",
              sets,
              reps: reps * 2,
              rest,
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
