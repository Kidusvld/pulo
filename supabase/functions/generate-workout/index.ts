
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      age, 
      weight, 
      fitnessGoal, 
      workoutLocation, 
      equipment, 
      intensityLevel 
    } = await req.json()

    const prompt = `Generate a detailed 3-day workout plan based on the following details:
      - Age: ${age} years
      - Weight: ${weight} kg
      - Goal: ${fitnessGoal}
      - Location: ${workoutLocation}
      - Equipment available: ${equipment.join(', ')}
      - Intensity: ${intensityLevel}
      
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
                "rest": number (in seconds)
              }
            ]
          }
        ]
      }
      
      Make sure each exercise is suitable for the person's goals and available equipment.
      Include proper rest periods between sets.
      Don't include exercises that require unavailable equipment.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional fitness trainer who creates personalized workout plans.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
      }),
    })

    const data = await response.json()
    const workoutPlan = JSON.parse(data.choices[0].message.content)

    return new Response(
      JSON.stringify(workoutPlan),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
