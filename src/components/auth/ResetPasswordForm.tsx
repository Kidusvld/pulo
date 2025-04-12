
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{password?: string, confirmPassword?: string}>({});

  const validateForm = () => {
    const newErrors: {password?: string, confirmPassword?: string} = {};
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      navigate("/auth?mode=signin");
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-opensans">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 font-medium">New Password</Label>
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
            placeholder="Enter new password"
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
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined});
            }}
            placeholder="Confirm new password"
            className={`pl-10 bg-white/80 border-purple-100 focus-visible:ring-[#8E44AD] focus-visible:ring-offset-0 focus-visible:border-[#8E44AD] ${
              errors.confirmPassword ? "border-red-400" : ""
            }`}
          />
          {errors.confirmPassword && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>{errors.confirmPassword}</span>
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
            Update Password
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        )}
      </Button>
    </form>
  );
};
