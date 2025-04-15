import React, { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen relative bg-pulo-gradient bg-grid-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none flex items-center justify-center">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="h-64 opacity-10"
        />
      </div>
      
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-500/10 blur-[100px] top-20 left-20 opacity-50"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-500/10 blur-[100px] bottom-20 right-20 opacity-50"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div 
              onClick={() => navigate("/")}
              className="flex items-center justify-center px-3 py-2 rounded-xl bg-[#8E44AD] text-white cursor-pointer hover:bg-[#9B59B6] transition-colors duration-200"
            >
              <img 
                src="/lovable-uploads/e23dd508-2106-4335-9918-2f12a6af334b.png" 
                alt="PULO Hand" 
                className="h-12 w-12 mr-2"
              />
              <span className="text-2xl font-bold tracking-tight font-montserrat">PULO</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white font-montserrat">
            Your AI Fitness Partner
          </h1>
          <p className="text-purple-200 mt-2 font-opensans">Personalized training that adapts to you</p>
        </div>

        <Card className="w-full max-w-[400px] bg-white/90 backdrop-blur-lg shadow-xl border-purple-100 rounded-lg">
          {currentMode !== "forgot" && currentMode !== "recovery" && (
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => handleSwitchMode("signin")}
                className={`flex-1 py-3 text-center font-montserrat transition-colors ${
                  currentMode === "signin" 
                    ? "auth-tab-active text-[#5C2D91] font-bold" 
                    : "auth-tab-inactive text-[#5C2D91] text-opacity-70 hover:text-opacity-100"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleSwitchMode("signup")}
                className={`flex-1 py-3 text-center font-montserrat transition-colors ${
                  currentMode === "signup" 
                    ? "auth-tab-active text-[#5C2D91] font-bold" 
                    : "auth-tab-inactive text-[#5C2D91] text-opacity-70 hover:text-opacity-100"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
          
          <CardHeader className="space-y-2 pt-6">
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#5C2D91] to-[#8E44AD] font-montserrat">
              {getFormTitle()}
            </CardTitle>
            <p className="text-center text-gray-600 font-opensans">
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

            {currentMode === "forgot" && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => handleSwitchMode("signin")}
                  className="text-[#5C2D91] hover:text-[#8E44AD] hover:underline font-medium font-opensans text-sm"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Link 
          to="/" 
          className="mt-8 text-white hover:text-purple-200 flex items-center justify-center font-opensans"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="mt-4 text-center text-sm text-purple-200 font-opensans">
          <p>Protected by industry standard encryption</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
