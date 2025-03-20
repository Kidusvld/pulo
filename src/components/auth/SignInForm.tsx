
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignInFormProps {
  onSwitchMode: (mode: "signup" | "forgot") => void;
}

export const SignInForm = ({ onSwitchMode }: SignInFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting to sign in with:", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Auth error:', error);
        if (error.status === 400) {
          toast.error("Invalid email or password. Please try again.");
        } else if (error.status === 422) {
          toast.error("Email or password format is invalid.");
        } else if (error.status >= 500) {
          toast.error("Authentication service is currently unavailable. Please try again later.");
        } else {
          toast.error(error.message || "Failed to sign in. Please try again.");
        }
        return;
      }

      if (data.user) {
        console.log("Successfully signed in:", data.user.id);
        toast.success("Successfully signed in!");
        // Directly navigate to dashboard for returning users
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            Sign In
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        )}
      </Button>
      
      <button
        type="button"
        onClick={() => onSwitchMode("forgot")}
        className="w-full text-sm text-purple-600 hover:text-purple-700 hover:underline mt-2"
      >
        Forgot your password?
      </button>
    </form>
  );
};
