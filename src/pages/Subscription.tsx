
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
  <div className={`relative rounded-2xl bg-white shadow-lg border ${isPopular ? 'border-[#8E44AD] border-2' : 'border-gray-200'}`}>
    {isPopular && (
      <div className="absolute -top-5 left-0 right-0 flex justify-center">
        <div className="bg-[#8E44AD] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Crown className="w-4 h-4" />
          Most Popular
        </div>
      </div>
    )}
    <div className="p-8">
      <h3 className="text-2xl font-bold text-gray-900 font-montserrat">{title}</h3>
      <p className="mt-4 text-gray-500">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        {price !== "Free" && <span className="text-base font-medium">/month</span>}
      </p>
      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-[#8E44AD] mt-0.5" />
            <span className="ml-3 text-gray-600 font-opensans">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`mt-8 w-full ${isPopular ? 'bg-[#8E44AD] hover:bg-[#5C2D91]' : ''} font-inter`}
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

      setCurrentPlan(profile.subscription_status || "free");
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5C2D91] via-[#6D3CAA] to-[#502680]">
        <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none flex items-center justify-center">
          <img 
            src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
            alt="PULO Watermark"
            className="h-64 opacity-10"
          />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5C2D91] via-[#6D3CAA] to-[#502680]">
      <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
      <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="absolute bottom-8 left-8 h-48 w-48"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-[120px] py-8 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div 
                onClick={() => navigate("/")} 
                className="flex items-center justify-center px-3 py-2 rounded-xl bg-[#8E44AD] text-white cursor-pointer hover:bg-[#5C2D91] transition-colors duration-200"
              >
                <Brain className="h-5 w-5 mr-2" />
                <span className="text-xl font-bold tracking-tight font-montserrat">PULO</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white font-montserrat">
              Choose Your Plan
            </h1>
            <p className="mt-2 text-white/80 font-opensans">
              Select the perfect plan for your fitness journey
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")} 
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
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
