
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="absolute inset-0 bg-grid-slate-100/30"></div>
      
      {/* Header */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 font-montserrat">
              Subscription
            </h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl p-10 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-slate-900 font-montserrat">Free Access</h2>
            <Badge className="py-3 px-6 flex items-center gap-2 font-semibold text-lg bg-emerald-100 text-emerald-800 border-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
              All Features Unlocked
            </Badge>
          </div>
          <p className="text-slate-700 mb-8 text-xl leading-relaxed">
            All premium features are currently free to use. We're still working on our subscription plans.
          </p>
          <div className="bg-slate-50/80 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 font-montserrat">What's Included:</h3>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-center gap-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <span className="text-lg">Unlimited workout tracking</span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <span className="text-lg">Advanced AI-powered workout plans</span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <span className="text-lg">Progress analytics and insights</span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <span className="text-lg">Priority support</span>
              </li>
            </ul>
          </div>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
          >
            Return to Dashboard
          </Button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl p-10">
          <h3 className="text-2xl font-semibold mb-8 text-slate-900 font-montserrat">Features Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-slate-50/80 rounded-2xl">
              <span className="text-slate-800 font-medium text-lg">Workout Tracking</span>
              <CheckCircle2 className="text-emerald-600 h-6 w-6" />
            </div>
            <div className="flex items-center justify-between p-6 bg-slate-50/80 rounded-2xl">
              <span className="text-slate-800 font-medium text-lg">Advanced Workout Plans</span>
              <CheckCircle2 className="text-emerald-600 h-6 w-6" />
            </div>
            <div className="flex items-center justify-between p-6 bg-slate-50/80 rounded-2xl">
              <span className="text-slate-800 font-medium text-lg">Progress Analytics</span>
              <CheckCircle2 className="text-emerald-600 h-6 w-6" />
            </div>
            <div className="flex items-center justify-between p-6 bg-slate-50/80 rounded-2xl">
              <span className="text-slate-800 font-medium text-lg">Priority Support</span>
              <CheckCircle2 className="text-emerald-600 h-6 w-6" />
            </div>
            <div className="mt-8 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
              <p className="text-slate-700 leading-relaxed text-lg">
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
