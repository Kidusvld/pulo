
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
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-full opacity-3 pointer-events-none flex items-center justify-center">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="h-64 opacity-10"
        />
      </div>
      
      <div className="absolute inset-0 bg-grid-slate-100/30 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-96 w-96 rounded-full bg-indigo-500/8 blur-[100px] top-20 left-20 opacity-50"></div>
      <div className="absolute h-96 w-96 rounded-full bg-purple-500/8 blur-[100px] bottom-20 right-20 opacity-50"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <div 
              onClick={() => navigate("/")}
              className="flex items-center justify-center px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <img 
                src="/lovable-uploads/e23dd508-2106-4335-9918-2f12a6af334b.png" 
                alt="PULO Hand" 
                className="h-14 w-14 mr-3"
              />
              <span className="text-3xl font-bold tracking-tight font-montserrat">PULO</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-montserrat">
            Your AI Fitness Partner
          </h1>
          <p className="text-slate-700 mt-3 text-lg font-opensans">Personalized training that adapts to you</p>
        </div>

        <Card className="w-full max-w-[420px] bg-white/95 backdrop-blur-lg shadow-2xl border-slate-200/60 rounded-3xl">
          {currentMode !== "forgot" && currentMode !== "recovery" && (
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => handleSwitchMode("signin")}
                className={`flex-1 py-5 text-center font-montserrat transition-all duration-200 ${
                  currentMode === "signin" 
                    ? "border-b-2 border-indigo-600 text-slate-900 font-bold bg-slate-50/50" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/30"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleSwitchMode("signup")}
                className={`flex-1 py-5 text-center font-montserrat transition-all duration-200 ${
                  currentMode === "signup" 
                    ? "border-b-2 border-indigo-600 text-slate-900 font-bold bg-slate-50/50" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/30"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
          
          <CardHeader className="space-y-3 pt-8">
            <CardTitle className="text-2xl font-bold text-center text-slate-900 font-montserrat">
              {getFormTitle()}
            </CardTitle>
            <p className="text-center text-slate-700 font-opensans text-lg">
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
                  className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium font-opensans transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Link 
          to="/" 
          className="mt-8 text-slate-700 hover:text-slate-900 flex items-center justify-center font-opensans transition-colors duration-200 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="mt-6 text-center text-slate-600 font-opensans">
          <p>Protected by industry standard encryption</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
