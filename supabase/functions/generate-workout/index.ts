
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.16.1/mod.ts';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { age, weight, fitnessGoal, workoutLocation, equipment, intensityLevel, numberOfDays } = await req.json();

    try {
      requestSchema.parse({
        age, weight, fitnessGoal, workoutLocation, equipment, intensityLevel, numberOfDays
      });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return new Response(
        JSON.stringify({
          error: 'Invalid input data',
          details: validationError.errors
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a dynamic system prompt based on user profile
    const systemPrompt = `As an expert fitness trainer, create a personalized ${numberOfDays}-day workout plan for someone with these characteristics:

PROFILE:
- Weight: ${weight} lbs (adjust exercise intensity and modifications accordingly)
- Age: ${age} years
- Fitness Goal: ${fitnessGoal.replace(/_/g, ' ')}
- Experience Level: ${intensityLevel}
- Workout Location: ${workoutLocation}
- Available Equipment: ${equipment.length ? equipment.join(', ') : 'bodyweight exercises only'}

REQUIREMENTS:
1. For each day, provide 3-5 exercises that:
   - Match the fitness goal
   - Are appropriate for their weight and fitness level
   - Can be performed with available equipment
   - Include progressive overload principles
2. Each exercise must include:
   - Descriptive name
   - Sets (${intensityLevel === 'beginner' ? '2-3' : intensityLevel === 'intermediate' ? '3-4' : '4-5'} based on level)
   - Reps (8-15 range, adjusted for goal)
   - Rest periods (in seconds)
3. Add variety to prevent repetitive workouts
4. Include a mix of:
   ${fitnessGoal === 'build_muscle' ? '- Compound movements for muscle growth\n- Progressive overload exercises\n- Both push and pull movements' :
      fitnessGoal === 'lose_fat' ? '- High-intensity exercises\n- Compound movements for calorie burn\n- Cardio-strength hybrid exercises' :
      '- Dynamic stretching exercises\n- Range of motion movements\n- Stability-focused exercises'}

Format the response as a JSON object matching this structure exactly:
{
  "workouts": [
    {
      "day": number,
      "exercises": [
        {
          "name": string,
          "sets": number,
          "reps": number,
          "rest": number
        }
      ]
    }
  ]
}`;

    console.log('Calling OpenAI API with prompt...');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: 'Generate a unique and personalized workout plan following the specified format.' 
          }
        ],
        temperature: 0.8, // Increased for more variety in responses
      }),
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', await openAIResponse.text());
      throw new Error('Failed to generate workout plan');
    }

    const aiData = await openAIResponse.json();
    console.log('OpenAI response received');

    try {
      const workoutPlan = JSON.parse(aiData.choices[0].message.content);
      
      // Validate the workout plan structure
      const workouts = workoutPlan.workouts.map(workout => ({
        day: workout.day,
        exercises: workout.exercises.map(exercise => ({
          name: exercise.name,
          sets: Math.min(Math.max(exercise.sets, 2), 5), // Ensure sets are between 2-5
          reps: Math.min(Math.max(exercise.reps, 8), 15), // Ensure reps are between 8-15
          rest: Math.min(Math.max(exercise.rest, 30), 120) // Ensure rest is between 30-120 seconds
        }))
      }));

      return new Response(JSON.stringify({ workouts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return new Response(JSON.stringify({ error: 'Failed to parse workout plan' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
