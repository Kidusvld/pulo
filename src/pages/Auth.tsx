
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

type AuthMode = "signin" | "signup" | "forgot" | "recovery";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMode = searchParams.get("mode") as AuthMode || "signin";

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", session.user.id)
          .single();
        
        if (profile?.first_name) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }
    };

    checkSession();
  }, [navigate]);

  const handleSwitchMode = (mode: AuthMode) => {
    setSearchParams({ mode }, { replace: true });
  };

  const getFormTitle = () => {
    switch (currentMode) {
      case "signup":
        return "Join PULO Today";
      case "forgot":
        return "Reset Password";
      case "recovery":
        return "Set New Password";
      default:
        return "Welcome Back to PULO";
    }
  };

  const getFormDescription = () => {
    switch (currentMode) {
      case "signup":
        return "Start your AI-powered fitness journey with PULO";
      case "forgot":
        return "Enter your email to receive password reset instructions";
      case "recovery":
        return "Enter your new password below";
      default:
        return "Sign in to continue your personalized fitness experience";
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-deep-purple-900 via-deep-purple-800 to-deep-purple-900">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-32 w-32 rounded-full bg-purple-500/10 blur-3xl top-20 left-20 opacity-50"></div>
      <div className="absolute h-32 w-32 rounded-full bg-purple-500/10 blur-3xl bottom-20 right-20 opacity-50"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Logo and Branding */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div 
              onClick={() => navigate("/")}
              className="flex items-center justify-center px-3 py-2 rounded-xl bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition-colors duration-200"
            >
              <Brain className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold tracking-tight">PULO</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Your AI Fitness Partner
          </h1>
          <p className="text-purple-200 mt-2">Personalized training that adapts to you</p>
        </div>

        <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl border-purple-100">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900">
              {getFormTitle()}
            </CardTitle>
            <p className="text-center text-gray-600">
              {getFormDescription()}
            </p>
          </CardHeader>
          <CardContent>
            {currentMode === "signin" && (
              <SignInForm onSwitchMode={handleSwitchMode} />
            )}
            {currentMode === "signup" && (
              <SignUpForm onSwitchMode={handleSwitchMode} />
            )}
            {currentMode === "forgot" && (
              <ForgotPasswordForm onSwitchMode={handleSwitchMode} />
            )}
            {currentMode === "recovery" && (
              <ResetPasswordForm />
            )}

            {currentMode !== "forgot" && currentMode !== "recovery" && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600">
                  {currentMode === "signin" ? "New to PULO? " : "Already have a PULO account? "}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode(currentMode === "signin" ? "signup" : "signin")}
                    className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                  >
                    {currentMode === "signin" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-purple-200">
          <p>Protected by industry standard encryption</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
