
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, // Changed from 204 to 200
      headers: corsHeaders 
    })
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('OpenAI API Key status:', openAIApiKey ? 'Present' : 'Missing')
    
    if (!openAIApiKey) {
      console.error('Missing OpenAI API key in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: OpenAI API key not found',
          status: 'error' 
        }),
        { 
          status: 200, // Changed from 500 to 200
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let requestBody
    try {
      requestBody = await req.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body',
          details: parseError.message,
          status: 'error'
        }),
        { 
          status: 200, // Changed from 400 to 200
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { 
      age, 
      weight, 
      fitnessGoal, 
      workoutLocation, 
      equipment, 
      intensityLevel 
    } = requestBody

    console.log('Full request parameters:', JSON.stringify({
      age,
      weight,
      fitnessGoal,
      workoutLocation,
      equipment,
      intensityLevel
    }, null, 2))

    if (!age || !weight || !fitnessGoal || !workoutLocation || !equipment || !intensityLevel) {
      const missingParams = []
      if (!age) missingParams.push('age')
      if (!weight) missingParams.push('weight')
      if (!fitnessGoal) missingParams.push('fitnessGoal')
      if (!workoutLocation) missingParams.push('workoutLocation')
      if (!equipment) missingParams.push('equipment')
      if (!intensityLevel) missingParams.push('intensityLevel')

      console.error('Missing required parameters:', missingParams)
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters',
          details: `Missing: ${missingParams.join(', ')}`,
          status: 'error'
        }),
        { 
          status: 200, // Changed from 400 to 200
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const prompt = `Generate a detailed 3-day workout plan based on the following details:
      - Age: ${age} years
      - Weight: ${weight} kg
      - Goal: ${fitnessGoal}
      - Location: ${workoutLocation}
      - Equipment available: ${Array.isArray(equipment) ? equipment.join(', ') : equipment}
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
      }`

    try {
      console.log('Initiating OpenAI API request...')
      
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
              content: 'You are a professional fitness trainer. Generate only valid JSON matching the specified structure.' 
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
        console.error('OpenAI API error details:', JSON.stringify(errorData, null, 2))
        return new Response(
          JSON.stringify({ 
            error: 'AI service error',
            details: errorData,
            status: 'error'
          }),
          { 
            status: 200, // Changed from 502 to 200
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        )
      }

      const data = await response.json()
      console.log('OpenAI API response received:', {
        status: 'success',
        hasChoices: Boolean(data.choices),
        firstChoice: Boolean(data.choices?.[0]),
        messageContent: Boolean(data.choices?.[0]?.message?.content)
      })

      if (!data.choices?.[0]?.message?.content) {
        console.error('Invalid AI response structure:', data)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid AI response format',
            details: 'AI response missing required data',
            status: 'error'
          }),
          { 
            status: 200, // Changed from 502 to 200
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      let workoutPlan
      try {
        workoutPlan = JSON.parse(data.choices[0].message.content)
      } catch (parseError) {
        console.error('Failed to parse AI response:', {
          error: parseError,
          content: data.choices[0].message.content
        })
        return new Response(
          JSON.stringify({ 
            error: 'Invalid workout plan format',
            details: parseError.message,
            status: 'error'
          }),
          { 
            status: 200, // Changed from 502 to 200
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      if (!workoutPlan.workouts || !Array.isArray(workoutPlan.workouts)) {
        console.error('Invalid workout plan structure:', workoutPlan)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid workout plan structure',
            details: 'Response missing workouts array',
            status: 'error'
          }),
          { 
            status: 200, // Changed from 502 to 200
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          ...workoutPlan,
          status: 'success' 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (aiError) {
      console.error('AI service error:', {
        error: aiError,
        stack: aiError.stack
      })
      return new Response(
        JSON.stringify({ 
          error: 'AI service unavailable',
          details: aiError.message,
          status: 'error'
        }),
        { 
          status: 200, // Changed from 502 to 200
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Unexpected server error:', {
      error: error,
      stack: error.stack
    })
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        status: 'error'
      }),
      { 
        status: 200, // Changed from 500 to 200
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
    )
  }
})
