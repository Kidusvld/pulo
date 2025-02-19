
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { intensityLevel, fitnessGoal, workoutLocation, equipment, numberOfDays = 3 } = await req.json();

    console.log('Generating workout plan with params:', {
      intensityLevel,
      fitnessGoal,
      workoutLocation,
      equipment,
      numberOfDays
    });

    // Optimize the prompt for faster processing
    const prompt = `Create a concise ${numberOfDays}-day workout plan for ${intensityLevel} level. Format:
    {
      "workouts": [
        {
          "day": (number),
          "focus": (primary muscle group),
          "exercises": [
            {
              "name": (exercise name),
              "sets": (number),
              "reps": (number),
              "rest": (seconds),
              "duration": (optional, seconds)
            }
          ]
        }
      ]
    }
    Rules:
    - ${intensityLevel} appropriate exercises only
    - Location: ${workoutLocation}
    - Equipment: ${equipment ? equipment.join(', ') : 'bodyweight only'}
    - Keep exercise names clear and standard
    - Include exactly ${numberOfDays} days
    - JSON only, no explanations`;

    console.log('Sending prompt to OpenAI');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a fitness expert. Respond with valid JSON only. No markdown or explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate workout plan');
    }

    const data = await response.json();
    console.log('Received response from OpenAI');

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    try {
      const workoutPlan = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed workout plan');
      return new Response(
        JSON.stringify(workoutPlan),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Invalid JSON in workout plan response');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
