
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const { type } = await req.json()

    let prompt = ""
    let aspectRatio = "1:1"
    
    switch(type) {
      case "og":
        prompt = "A modern, minimalist tech-fitness image with a sleek purple gradient background (#9333EA). In the center, show a stylized AI brain icon merging with a fitness silhouette. Include bold white text 'PULO - Your AI-Powered Fitness Assistant'. Professional marketing style, clean composition."
        aspectRatio = "1.91:1" // For 1200x630
        break
      case "favicon":
        prompt = "A minimal, modern letter P icon in purple (#9333EA), clean geometric style with subtle AI circuit board patterns integrated. Perfect for small sizes, clear at 16x16 pixels."
        break
      case "placeholder":
        prompt = "A subtle, abstract pattern combining fitness and AI elements in light purple (#9333EA at 10% opacity). Geometric shapes suggesting movement and digital intelligence, minimal and modern style."
        break
      default:
        throw new Error("Invalid asset type")
    }

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt,
          aspect_ratio: aspectRatio,
          num_outputs: 1,
          guidance_scale: 7.5
        }
      }
    )

    return new Response(
      JSON.stringify({ output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
