
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
    if (!openAIApiKey) {
      console.error('OpenAI API key is not set');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const requestData = await req.json();
    console.log('Received request data:', JSON.stringify(requestData));

    try {
      requestSchema.parse(requestData);
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

    const { age, weight, fitnessGoal, workoutLocation, equipment, intensityLevel, numberOfDays } = requestData;

    const systemPrompt = `As an expert fitness trainer, create a personalized ${numberOfDays}-day workout plan for someone with these characteristics:

PROFILE:
- Weight: ${weight} lbs
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
2. Each exercise must include:
   - Descriptive name
   - Sets (2-5)
   - Reps (8-15)
   - Rest periods (30-120 seconds)

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

    console.log('Calling OpenAI API...');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate a workout plan following the specified format.' }
        ],
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate workout plan', details: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const aiData = await openAIResponse.json();
    console.log('OpenAI response received:', JSON.stringify(aiData));

    if (!aiData.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', aiData);
      return new Response(
        JSON.stringify({ error: 'Invalid response from OpenAI' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      const workoutPlan = JSON.parse(aiData.choices[0].message.content);
      
      // Validate the workout plan structure
      if (!workoutPlan.workouts || !Array.isArray(workoutPlan.workouts)) {
        throw new Error('Invalid workout plan structure');
      }

      const workouts = workoutPlan.workouts.map(workout => ({
        day: workout.day,
        exercises: workout.exercises.map(exercise => ({
          name: exercise.name,
          sets: Math.min(Math.max(exercise.sets, 2), 5),
          reps: Math.min(Math.max(exercise.reps, 8), 15),
          rest: Math.min(Math.max(exercise.rest, 30), 120)
        }))
      }));

      return new Response(
        JSON.stringify({ workouts }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse workout plan',
          details: parseError.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
