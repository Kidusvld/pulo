
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

    const prompt = `Create a ${numberOfDays}-day workout plan for a ${intensityLevel} level fitness enthusiast with a goal of ${fitnessGoal}, working out at ${workoutLocation}.
    ${equipment ? `Available equipment: ${equipment.join(', ')}` : 'No specific equipment requirements.'}

    Return a JSON object with this exact structure (no markdown, no explanations, just the JSON):
    {
      "workouts": [
        {
          "day": number,
          "focus": string,
          "exercises": [
            {
              "name": string,
              "sets": number,
              "reps": number,
              "rest": number,
              "duration": number (optional, only for time-based exercises)
            }
          ]
        }
      ]
    }`;

    console.log('Sending prompt to OpenAI:', prompt);

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
            content: `You are a fitness expert that creates personalized workout plans. You always respond with valid JSON only, no explanations or markdown formatting. Always create exactly ${numberOfDays} days of workouts.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate workout plan');
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    try {
      const workoutPlan = JSON.parse(data.choices[0].message.content);
      return new Response(
        JSON.stringify(workoutPlan),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
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
