
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

    const intensityGuidelines = {
      beginner: `
        - Keep exercises simple and focus on form
        - Use bodyweight exercises or light weights
        - Include longer rest periods (60-90 seconds)
        - Focus on basic compound movements
        - Sets should be 2-3 with 8-12 reps
        - Include detailed form cues
      `,
      intermediate: `
        - Mix of bodyweight and weighted exercises
        - Moderate rest periods (45-60 seconds)
        - Include some supersets
        - Sets should be 3-4 with 10-15 reps
        - Add some complex movements
        - Include some HIIT elements
      `,
      advanced: `
        - Complex exercise combinations
        - Shorter rest periods (30-45 seconds)
        - Include supersets and drop sets
        - Sets should be 4-5 with 12-15 reps
        - Advanced movement patterns
        - High-intensity circuits
        - Include compound exercises with progressive overload
      `
    };

    const prompt = `Create a 3-day workout plan for a ${intensityLevel} level fitness enthusiast. 

    Follow these ${intensityLevel} level guidelines:
    ${intensityGuidelines[intensityLevel as keyof typeof intensityGuidelines]}

    The plan should:
    - Include different focus areas for each day (e.g., upper body, lower body, core)
    - Create challenging but appropriate exercises for ${intensityLevel} level
    - Include 3 exercises per day
    - Consider proper exercise progression and form requirements
    - Ensure the intensity matches the user's ${intensityLevel} level exactly

    Return ONLY a JSON object with this exact structure:
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
            content: 'You are an expert fitness trainer with deep knowledge of exercise progression and proper form. You create personalized workout plans that perfectly match the user\'s fitness level. For beginners, you focus on form and fundamentals. For intermediate users, you add complexity and intensity. For advanced users, you create challenging, complex workouts with advanced techniques.'
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
