
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Only redirect to auth page if we're not already there
        if (!location.pathname.includes("/auth")) {
          navigate("/auth");
        }
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Always redirect to auth page when user signs out
        navigate("/auth");
      } else if (!session && !location.pathname.includes("/auth")) {
        // If no session and not on auth page, redirect to auth
        navigate("/auth");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
};
