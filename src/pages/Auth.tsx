
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

type AuthMode = "signin" | "signup" | "forgot";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMode = searchParams.get("mode") as AuthMode || "signin";

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
    }
  };

  const handleSwitchMode = (mode: AuthMode) => {
    setSearchParams({ mode }, { replace: true });
  };

  const getFormTitle = () => {
    switch (currentMode) {
      case "signup":
        return "Start Your Fitness Journey";
      case "forgot":
        return "Reset Password";
      default:
        return "Welcome Back";
    }
  };

  const getFormDescription = () => {
    switch (currentMode) {
      case "signup":
        return "Create an account to get your personalized workout plan";
      case "forgot":
        return "Enter your email to receive password reset instructions";
      default:
        return "Sign in to continue your fitness journey";
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-32 w-32 rounded-full bg-purple-100 blur-3xl top-20 left-20 opacity-50"></div>
      <div className="absolute h-32 w-32 rounded-full bg-blue-100 blur-3xl bottom-20 right-20 opacity-50"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Logo and Branding */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            FitTrack Pro
          </h1>
          <p className="text-gray-600 mt-2">Your personal fitness companion</p>
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

            {currentMode !== "forgot" && (
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
                  {currentMode === "signin" ? "Don't have an account? " : "Already have an account? "}
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
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Protected by industry standard encryption</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
