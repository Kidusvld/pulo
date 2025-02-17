
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    const { 
      age, 
      weight, 
      fitnessGoal, 
      workoutLocation, 
      equipment, 
      intensityLevel 
    } = await req.json()

    console.log('Received request with params:', {
      age,
      weight,
      fitnessGoal,
      workoutLocation,
      equipment,
      intensityLevel
    })

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
      Don't include exercises that require unavailable equipment.
      Response must be a valid JSON string that matches the exact structure above.`

    console.log('Sending request to OpenAI with prompt:', prompt)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional fitness trainer who creates personalized workout plans. Respond only with valid JSON that matches the requested structure.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log('OpenAI response:', data)

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI response structure:', data)
      throw new Error('Invalid response from AI service')
    }

    let workoutPlan
    try {
      workoutPlan = JSON.parse(data.choices[0].message.content)
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', data.choices[0].message.content)
      throw new Error('AI generated an invalid workout plan format')
    }

    // Validate the workout plan structure
    if (!workoutPlan.workouts || !Array.isArray(workoutPlan.workouts)) {
      console.error('Invalid workout plan structure:', workoutPlan)
      throw new Error('AI generated an invalid workout plan structure')
    }

    return new Response(
      JSON.stringify(workoutPlan),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-workout function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
