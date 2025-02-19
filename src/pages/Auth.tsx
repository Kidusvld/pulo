
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lock, Mail, Dumbbell } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`,
        });
        
        if (error) throw error;
        
        toast.success("Password reset instructions have been sent to your email!");
        setIsForgotPassword(false);
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([{ id: data.user.id, email: data.user.email }]);

          if (profileError) throw profileError;

          toast.success("Account created successfully!");
          navigate("/onboarding");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("age, weight, first_name")
          .eq("id", (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profileError) throw profileError;

        if (!profile?.age || !profile?.weight || !profile?.first_name) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    if (isForgotPassword) return "Reset Password";
    return isSignUp ? "Start Your Fitness Journey" : "Welcome Back";
  };

  const getFormDescription = () => {
    if (isForgotPassword) return "Enter your email to receive password reset instructions";
    return isSignUp 
      ? "Create an account to get your personalized workout plan" 
      : "Sign in to continue your fitness journey";
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
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="pl-10 bg-white/80 border-purple-100 focus:border-purple-300 focus:ring-purple-200"
                  />
                </div>
              </div>
              {!isForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="pl-10 bg-white/80 border-purple-100 focus:border-purple-300 focus:ring-purple-200"
                    />
                  </div>
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-11 shadow-lg shadow-purple-200 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {isForgotPassword ? "Send Reset Instructions" : (isSignUp ? "Create Account" : "Sign In")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
              
              {!isSignUp && !isForgotPassword && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="w-full text-sm text-purple-600 hover:text-purple-700 hover:underline mt-2"
                >
                  Forgot your password?
                </button>
              )}

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600">
                {isForgotPassword ? (
                  <>
                    Remember your password?{" "}
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setIsForgotPassword(false);
                        navigate(`/auth?mode=${isSignUp ? "signin" : "signup"}`, { replace: true });
                      }}
                      className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                    >
                      {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                  </>
                )}
              </p>
            </form>
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
