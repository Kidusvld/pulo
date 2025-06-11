
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type FeedbackType = "suggestion" | "issue" | "praise" | null;

export const FeedbackForm = ({ onClose }: { onClose: () => void }) => {
  const [message, setMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please enter a feedback message");
      return;
    }
    
    if (!feedbackType) {
      toast.error("Please select a feedback type");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get current page URL
      const pageUrl = window.location.href;
      
      // Submit feedback to Supabase
      const { error } = await supabase
        .from("feedback")
        .insert({
          message,
          feedback_type: feedbackType,
          user_id: user?.id || null,
          email: email.trim() || (user?.email || null),
          page_url: pageUrl
        });
        
      if (error) throw error;
      
      toast.success("Thank you for your feedback!");
      setMessage("");
      setFeedbackType(null);
      setEmail("");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const feedbackTypeOptions = [
    { type: "suggestion" as const, label: "Suggestion", icon: MessageSquare },
    { type: "praise" as const, label: "Praise", icon: ThumbsUp },
    { type: "issue" as const, label: "Issue", icon: ThumbsDown },
  ];

  return (
    <Card className="p-6 w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-slate-200/60 shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-center text-slate-800">Share Your Feedback</h2>
      <p className="text-slate-600 text-sm mb-6 text-center">
        Help us improve our app by sharing your thoughts, suggestions, or issues.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {feedbackTypeOptions.map((option) => (
            <Button
              key={option.type}
              type="button"
              variant={feedbackType === option.type ? "default" : "outline"}
              className={`flex items-center gap-2 transition-all duration-200 ${
                feedbackType === option.type 
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" 
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setFeedbackType(option.type)}
            >
              <option.icon className="h-4 w-4" />
              {option.label}
            </Button>
          ))}
        </div>
        
        <Textarea
          placeholder="Tell us what you think..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="h-32 border-slate-300 focus:border-indigo-400 focus:ring-indigo-400/20 bg-white/50"
        />
        
        <div className="relative">
          <input
            type="email"
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 focus:outline-none text-sm bg-white/50"
          />
          <p className="text-xs text-slate-500 mt-1">
            Leave your email if you'd like us to follow up with you
          </p>
        </div>
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Feedback
              </div>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
