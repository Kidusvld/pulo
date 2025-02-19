
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
    const { intensityLevel } = await req.json();

    const prompt = `Create a 3-day workout plan for a ${intensityLevel} level fitness enthusiast. The plan should:
    - Include different focus areas for each day (e.g., upper body, lower body, core)
    - Specify sets, reps, and rest periods appropriate for ${intensityLevel} level
    - Include 3 exercises per day
    - Return ONLY a JSON object with this exact structure:
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
            content: 'You are a professional fitness trainer that creates personalized workout plans. Always return valid JSON that matches the specified structure exactly.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    const data = await response.json();
    const workoutPlan = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify(workoutPlan),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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
