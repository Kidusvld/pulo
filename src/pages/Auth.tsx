
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
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
      if (isSignUp) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80")',
          }}
        />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">
                {isSignUp ? "Start Your Fitness Journey" : "Welcome Back"}
              </CardTitle>
              <p className="text-center text-gray-600">
                {isSignUp 
                  ? "Create an account to get your personalized workout plan" 
                  : "Sign in to continue your fitness journey"}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-white"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11"
                  disabled={loading}
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-center text-sm text-gray-600">
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      navigate(`/auth?mode=${isSignUp ? "signin" : "signup"}`, { replace: true });
                    }}
                    className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
