
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
        
        if (error) throw error;

        if (isPasswordReset) {
          // For password reset, redirect to the recovery page regardless of session
          navigate("/auth?mode=recovery");
        } else if (session) {
          // For other auth flows (like OAuth), redirect to the next page
          navigate(next);
        } else {
          // If no session and not password reset, go to sign in
          navigate("/auth?mode=signin");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
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
