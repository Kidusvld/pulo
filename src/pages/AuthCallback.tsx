
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="absolute inset-0 bg-grid-slate-100/30"></div>
      <div className="absolute bottom-0 left-0 w-full h-full opacity-3 pointer-events-none flex items-center justify-center">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="h-64 opacity-10"
        />
      </div>
      <div className="z-10 flex flex-col items-center bg-white/95 backdrop-blur-sm p-10 rounded-3xl border border-slate-200/60 shadow-2xl">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-200 border-t-indigo-600 mb-6"></div>
        <p className="text-slate-800 font-semibold text-lg font-montserrat">Authenticating... Please wait</p>
        <p className="text-slate-600 text-base mt-3">Preparing your personalized experience</p>
      </div>
    </div>
  );
};

export default AuthCallback;
