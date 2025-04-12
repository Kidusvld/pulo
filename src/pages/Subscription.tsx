
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Subscription = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    };
    checkSession();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5C2D91] via-[#6D3CAA] to-[#502680]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5C2D91] via-[#6D3CAA] to-[#502680] text-white">
      <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5C2D91] to-[#8E44AD] bg-clip-text text-transparent font-montserrat mb-6">
          Subscription
        </h1>
        
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Free Access</h2>
            <Badge variant="purple" className="py-1 flex items-center gap-1 font-inter">
              All Features Unlocked
            </Badge>
          </div>
          <p className="text-gray-100/80 mb-4">
            All premium features are currently free to use. We're still working on our subscription plans.
          </p>
          <ul className="list-disc list-inside text-gray-100/80 mb-4">
            <li>Unlimited workout tracking</li>
            <li>Advanced workout plans</li>
            <li>Priority support</li>
          </ul>
          <Button onClick={() => navigate("/dashboard")} className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white font-inter">
            Return to Dashboard
          </Button>
        </div>

        <div className="bg-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Features Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-100/80">Workout Tracking</span>
              <CheckCircle2 className="text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-100/80">Advanced Workout Plans</span>
              <CheckCircle2 className="text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-100/80">Priority Support</span>
              <CheckCircle2 className="text-green-500" />
            </div>
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-gray-100/80">
                We're currently developing our subscription model. For now, enjoy full access to all features at no cost!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
