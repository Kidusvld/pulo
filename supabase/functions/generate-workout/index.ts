
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

// Input validation schema
const WorkoutRequestSchema = z.object({
  age: z.number().min(18).max(80),
  weight: z.number().min(30).max(500),
  fitnessGoal: z.enum(['build_muscle', 'lose_fat', 'increase_mobility', 'stay_active']),
  workoutLocation: z.enum(['home', 'gym']),
  equipment: z.array(z.string()),
  intensityLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  numberOfDays: z.number().min(1).max(7)
});

serve(async (req: Request) => {
  console.log("Received request to generate workout");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse and validate request body
    const body = await req.json();
    console.log("Request body:", body);
    const validatedData = WorkoutRequestSchema.parse(body);

    // Get OpenAI API key from environment variable
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create updated system prompt based on user profile
    const systemPrompt = `You are a professional fitness trainer tasked with creating a personalized workout plan.
    Design a detailed workout plan with the following specifications:
    
    1. The plan is for a person who is ${validatedData.age} years old and weighs ${validatedData.weight} lbs.
    2. Their primary fitness goal is to ${validatedData.fitnessGoal.replace('_', ' ')}.
    3. They will workout at ${validatedData.workoutLocation === 'home' ? 'home with limited equipment' : 'a fully equipped gym'}.
    4. Their fitness level is ${validatedData.intensityLevel}.
    5. Create workouts for ${validatedData.numberOfDays} days per week.
    
    For each day, include the following:
    - 4 to 8 exercises (based on fitness level)
    - Number of sets for each exercise
    - Either the number of reps or a duration in seconds, depending on the type of movement
    - For example: use reps for strength movements, and duration for exercises like planks, wall sits, or sprints
    - Rest time between sets in seconds
    
    Format your response as a valid JSON object with this structure:
    {
      "workouts": [
        {
          "day": 1,
          "exercises": [
            {
              "name": "Exercise Name",
              "sets": 3,
              "reps": 10,
              "rest": 60
            },
            {
              "name": "Plank",
              "sets": 3,
              "duration": 30,
              "rest": 60
            }
          ]
        }
      ]
    }
    
    Use only one of "reps" or "duration" per exercise (never both).
    The response must be valid JSON that matches this exact format. Do not include any explanations or extra text outside the JSON.`;

    console.log("Sending request to OpenAI");

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openaiData = await openaiResponse.json();
    console.log("Received response from OpenAI");

    // Parse the response content as JSON
    try {
      const workoutData = JSON.parse(openaiData.choices[0].message.content);
      
      // Validate the structure
      if (!workoutData.workouts || !Array.isArray(workoutData.workouts)) {
        throw new Error('Invalid workout plan structure received from OpenAI');
      }

      console.log("Generated workouts successfully");

      return new Response(
        JSON.stringify(workoutData),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.error("Raw response:", openaiData.choices[0].message.content);
      throw new Error('Failed to parse workout plan from OpenAI');
    }

  } catch (error) {
    console.error('Error:', error.message);
    
    // Return appropriate error response
    const status = error.message === 'Method not allowed' ? 405 :
                  error instanceof z.ZodError ? 400 : 500;
    
    return new Response(
      JSON.stringify({
        error: error instanceof z.ZodError ? 
          'Invalid request data' : 
          error.message
      }),
      {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
