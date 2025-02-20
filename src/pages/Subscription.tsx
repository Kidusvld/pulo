
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Brain, Check, Crown, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const PricingTier = ({ 
  title, 
  price, 
  features, 
  onSubscribe, 
  isPopular = false,
  disabled = false,
  current = false
}: { 
  title: string;
  price: string;
  features: string[];
  onSubscribe?: () => void;
  isPopular?: boolean;
  disabled?: boolean;
  current?: boolean;
}) => (
  <div className={`relative rounded-2xl bg-white shadow-lg border ${isPopular ? 'border-purple-400 border-2' : 'border-gray-200'}`}>
    {isPopular && (
      <div className="absolute -top-5 left-0 right-0 flex justify-center">
        <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Crown className="w-4 h-4" />
          Most Popular
        </div>
      </div>
    )}
    <div className="p-8">
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-4 text-gray-500">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        {price !== "Free" && <span className="text-base font-medium">/month</span>}
      </p>
      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-purple-500 mt-0.5" />
            <span className="ml-3 text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`mt-8 w-full ${isPopular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
        variant={isPopular ? "default" : "outline"}
        onClick={onSubscribe}
        disabled={disabled || current}
      >
        {current ? "Current Plan" : disabled ? "Coming Soon" : "Get Started"}
      </Button>
    </div>
  </div>
);

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      // Ensure we're using the correct type
      setCurrentPlan(profile.subscription_status === "pro" ? "pro" : "free");
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast.error("Failed to load subscription status");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: "free" | "pro") => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      if (plan === "free") {
        const { error } = await supabase
          .from("profiles")
          .update({ subscription_status: "free" })
          .eq("id", session.user.id);

        if (error) throw error;
        
        toast.success("Free plan activated!");
        navigate("/onboarding");
      } else {
        // For pro plan, create Stripe checkout session
        const { data: { url }, error } = await supabase.functions.invoke("create-checkout-session", {
          body: { 
            priceId: "your_stripe_price_id", // Replace with your actual Stripe price ID
            userId: session.user.id,
          }
        });

        if (error) throw error;
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error in subscription process:", error);
      toast.error("Failed to process subscription");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div 
                onClick={() => navigate("/")} 
                className="flex items-center justify-center px-3 py-2 rounded-xl bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition-colors duration-200"
              >
                <Brain className="h-5 w-5 mr-2" />
                <span className="text-xl font-bold tracking-tight">PULO</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="mt-2 text-gray-600">
              Select the perfect plan for your fitness journey
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")} 
            className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingTier
            title="Free"
            price="Free"
            features={[
              "AI-powered workout plan generation",
              "Basic workout customization",
              "Access to workout library",
              "Email support"
            ]}
            onSubscribe={() => handleSubscribe("free")}
            current={currentPlan === "free"}
          />
          <PricingTier
            title="Pro"
            price="$9.99"
            features={[
              "Everything in Free",
              "Progress tracking & analytics",
              "Workout logging",
              "Muscle group visualization",
              "Save unlimited workout plans",
              "Advanced AI customization",
              "Priority support"
            ]}
            isPopular
            onSubscribe={() => handleSubscribe("pro")}
            current={currentPlan === "pro"}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
