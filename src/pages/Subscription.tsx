import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Subscription = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<"free" | "pro">("free");
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
      fetchSubscriptionStatus();
    };
    checkSession();
  }, [navigate]);

  const fetchSubscriptionStatus = async () => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      const {
        data,
        error
      } = await supabase.from("subscriptions").select("status").eq("user_id", session.user.id).single();
      if (error) {
        throw error;
      }
      if (data && data.status === "active") {
        setSubscription("pro");
      } else {
        setSubscription("free");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      toast.error("Failed to load subscription status");
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      const {
        data,
        error
      } = await supabase.functions.invoke('create-stripe-checkout-session', {
        body: {
          priceId: process.env.NODE_ENV === 'development' ? "price_1Oq9jJSB59cpKxKpEqKjG19F" : "price_1OrkzhSB59cpKxKpEqWw9lJV",
          userId: session.user.id,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/subscription`
        }
      });
      if (error) {
        throw error;
      }
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to initiate upgrade process");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      const {
        error
      } = await supabase.functions.invoke('cancel-stripe-subscription', {
        body: {
          userId: session.user.id
        }
      });
      if (error) {
        throw error;
      }
      setSubscription("free");
      toast.success("Subscription cancelled successfully");
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

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
        {subscription === "free" ? (
          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Free Plan</h2>
            <p className="text-gray-100/80 mb-4">
              You are currently on the free plan. Upgrade to Pro for unlimited access and exclusive features.
            </p>
            <ul className="list-disc list-inside text-gray-100/80 mb-4">
              <li>Limited workout tracking</li>
              <li>Basic workout plans</li>
              <li>Community support</li>
            </ul>
            <Button onClick={handleUpgrade} className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white font-inter">
              Upgrade to Pro
            </Button>
          </div>
        ) : (
          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Pro Plan</h2>
            <p className="text-gray-100/80 mb-4">
              You are currently on the Pro plan. Enjoy unlimited access and exclusive features.
            </p>
            <ul className="list-disc list-inside text-gray-100/80 mb-4">
              <li>Unlimited workout tracking</li>
              <li>Advanced workout plans</li>
              <li>Priority support</li>
            </ul>
            <Button onClick={handleCancelSubscription} className="bg-red-500 hover:bg-red-700 text-white font-inter">
              Cancel Subscription
            </Button>
          </div>
        )}
        <div className="bg-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Plan Details</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-100/80">Workout Tracking</span>
            {subscription === "pro" ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-100/80">Advanced Workout Plans</span>
            {subscription === "pro" ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-100/80">Priority Support</span>
            {subscription === "pro" ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
