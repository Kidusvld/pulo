
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Check if this is a password reset flow
        const hash = window.location.hash;
        const isPasswordReset = hash.includes('type=recovery');
        
        // Check for error parameters in the URL hash
        const hashParams = new URLSearchParams(hash.replace('#', ''));
        const errorCode = hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');

        if (errorCode === 'otp_expired') {
          toast.error("The password reset link has expired. Please request a new one.");
          navigate("/auth?mode=forgot");
          return;
        }

        if (error) throw error;

        if (isPasswordReset) {
          // For password reset, redirect to the recovery page regardless of session
          navigate("/auth?mode=recovery");
        } else if (session) {
          // For other auth flows (like OAuth), check if user has completed onboarding
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name")
            .eq("id", session.user.id)
            .maybeSingle();
          
          if (profile?.first_name) {
            // User has completed onboarding, redirect to dashboard
            navigate("/dashboard");
          } else {
            // User needs to complete onboarding
            navigate("/onboarding");
          }
        } else {
          // If no session and not password reset, go to sign in
          navigate("/auth?mode=signin");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        toast.error("There was an error processing your request. Please try again.");
        navigate("/auth?mode=signin");
      }
    };

    handleAuthCallback();
  }, [navigate, next]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
    </div>
  );
};

export default AuthCallback;
