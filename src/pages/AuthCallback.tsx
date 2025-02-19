
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
        // Get the session after OAuth or email link sign-in
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          navigate(next);
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
