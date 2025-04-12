
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  onSwitchMode: (mode: "signin") => void;
}

export const ForgotPasswordForm = ({ onSwitchMode }: ForgotPasswordFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{email?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth?mode=recovery`
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions have been sent to your email!");
      onSwitchMode("signin");
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
      <Button 
        type="submit" 
        className="w-full bg-[#8E44AD] hover:bg-[#9B59B6] text-white h-11 shadow-lg shadow-purple-200/40 transition-all duration-200 rounded-lg font-medium"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            Send Reset Instructions
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        )}
      </Button>
    </form>
  );
};
