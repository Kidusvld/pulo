
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/getting_started/javascript_typescript

// Edge Function for sending workout plans via SMS using Twilio
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, workoutText, workoutName } = await req.json();

    // Validate input
    if (!phone || !workoutText) {
      return new Response(
        JSON.stringify({ error: "Phone number and workout text are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get Twilio credentials from environment variables
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error("Missing Twilio environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Format phone number (remove spaces, ensure it has + prefix)
    const formattedPhone = formatPhoneNumber(phone);

    // Make request to Twilio API
    const twilioEndpoint = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    
    const twilioResponse = await fetch(twilioEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`
      },
      body: new URLSearchParams({
        To: formattedPhone,
        From: twilioPhoneNumber,
        Body: workoutText
      })
    });

    const twilioData = await twilioResponse.json();
    
    // Log for debugging
    console.log("Twilio API Response:", twilioData);

    if (!twilioResponse.ok) {
      throw new Error(`Twilio API error: ${JSON.stringify(twilioData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Workout SMS sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Error sending SMS:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to send SMS", details: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Helper function to format phone number
function formatPhoneNumber(phone: string): string {
  // Remove spaces, dashes, and parentheses
  let formattedPhone = phone.replace(/[\s\-()]/g, '');
  
  // Ensure it has the + prefix for international format
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+' + formattedPhone;
  }
  
  return formattedPhone;
}
