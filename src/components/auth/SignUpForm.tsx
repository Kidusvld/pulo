
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignUpFormProps {
  onSwitchMode: (mode: "signin") => void;
}

export const SignUpForm = ({ onSwitchMode }: SignUpFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Sign up the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if a profile already exists to avoid duplicate inserts
        const { count, error: countError } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("id", data.user.id);

        // If profile doesn't exist yet, create one
        if (countError || count === 0) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([{ id: data.user.id, email: data.user.email }]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Continue anyway since the user was created successfully
          }
        }

        toast.success("Account created successfully! Redirecting to onboarding...");
        
        // Get the session to ensure the user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          // If we have a valid session, redirect to onboarding
          navigate("/onboarding");
        } else {
          // If there's no session yet, redirect to signin
          toast.info("Please sign in with your new account");
          onSwitchMode("signin");
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
    <form onSubmit={handleSubmit} className="space-y-5 font-opensans">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({...errors, email: undefined});
            }}
            placeholder="Enter your email"
            className={`pl-10 bg-white/80 border-purple-100 focus-visible:ring-[#8E44AD] focus-visible:ring-offset-0 focus-visible:border-[#8E44AD] ${
              errors.email ? "border-red-400" : ""
            }`}
          />
          {errors.email && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({...errors, password: undefined});
            }}
            placeholder="Enter your password"
            className={`pl-10 bg-white/80 border-purple-100 focus-visible:ring-[#8E44AD] focus-visible:ring-offset-0 focus-visible:border-[#8E44AD] ${
              errors.password ? "border-red-400" : ""
            }`}
          />
          {errors.password && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-[#8E44AD] hover:bg-[#9B59B6] text-white h-11 shadow-lg shadow-purple-200/40 transition-all duration-200 rounded-lg font-medium"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating Account...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        )}
      </Button>
    </form>
  );
};
