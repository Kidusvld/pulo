
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.16.1/mod.ts';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
            message: err.message
          }))
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create prompt for OpenAI
    const systemPrompt = `You are a professional fitness trainer. Create a workout plan that matches these criteria:
- Age: ${age} years
- Weight: ${weight} lbs
- Fitness Goal: ${fitnessGoal}
- Location: ${workoutLocation}
- Available Equipment: ${equipment.join(', ')}
- Intensity Level: ${intensityLevel}
- Number of Days: ${numberOfDays}

For each day, provide 3-5 exercises. Each exercise should include:
1. Exercise name
2. Number of sets (2-5)
3. Number of reps (8-20)
4. Rest time in seconds (30-120)

Format the response as a JSON object with this structure:
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

    // Call OpenAI API
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
          { role: 'user', content: 'Generate the workout plan following the specified format.' }
        ],
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', await openAIResponse.text());
      throw new Error('Failed to generate workout plan');
    }

    const aiData = await openAIResponse.json();
    console.log('OpenAI response received');

    // Parse the AI response
    try {
      const workoutPlan = JSON.parse(aiData.choices[0].message.content);
      return new Response(JSON.stringify(workoutPlan), {
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
