
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="absolute inset-0 bg-grid-slate-100/50"></div>
      
      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-slate-800 font-montserrat">
              Subscription
            </h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-800 font-montserrat">Free Access</h2>
            <Badge className="py-2 px-4 flex items-center gap-2 font-medium bg-emerald-100 text-emerald-700 border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              All Features Unlocked
            </Badge>
          </div>
          <p className="text-slate-600 mb-6 text-lg leading-relaxed">
            All premium features are currently free to use. We're still working on our subscription plans.
          </p>
          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">What's Included:</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Unlimited workout tracking
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Advanced AI-powered workout plans
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Progress analytics and insights
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Priority support
              </li>
            </ul>
          </div>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Return to Dashboard
          </Button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl p-8">
          <h3 className="text-xl font-semibold mb-6 text-slate-800 font-montserrat">Features Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-700 font-medium">Workout Tracking</span>
              <CheckCircle2 className="text-emerald-500 h-5 w-5" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-700 font-medium">Advanced Workout Plans</span>
              <CheckCircle2 className="text-emerald-500 h-5 w-5" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-700 font-medium">Progress Analytics</span>
              <CheckCircle2 className="text-emerald-500 h-5 w-5" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-700 font-medium">Priority Support</span>
              <CheckCircle2 className="text-emerald-500 h-5 w-5" />
            </div>
            <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <p className="text-sm text-slate-600 leading-relaxed">
                We're currently developing our subscription model. For now, enjoy full access to all features at no cost! 
                Stay tuned for exciting updates and new features coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
