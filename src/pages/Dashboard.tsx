
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WorkoutPlanCard } from "@/components/dashboard/WorkoutPlanCard";
import { HomeView } from "@/components/dashboard/HomeView";
import { ProfileView } from "@/components/dashboard/ProfileView";
import { Button } from "@/components/ui/button";
import { Home, User } from "lucide-react";

interface Profile {
  first_name: string;
  age: number;
  weight: number;
  fitness_goal: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workout_location: "home" | "gym";
  intensity_level: "easy" | "moderate" | "hard" | "intense" | "beginner" | "intermediate" | "advanced";
  equipment: string[];
}

interface WorkoutPlan {
  id: string;
  plan_data: {
    workouts?: Array<{
      day: number;
      exercises: Array<{
        name: string;
        sets: number;
        reps: number;
        rest: number;
      }>;
    }>;
  };
  created_at: string;
  fitness_goal: "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active";
  workout_location: "home" | "gym";
  intensity_level: "easy" | "moderate" | "hard" | "intense" | "beginner" | "intermediate" | "advanced";
  equipment: string[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState<string>("");
  const [editedAge, setEditedAge] = useState<string>("");
  const [editedIntensity, setEditedIntensity] = useState<string>("moderate");
  const [editedFitnessGoal, setEditedFitnessGoal] = useState<string>("build_muscle");
  const [editedWorkoutLocation, setEditedWorkoutLocation] = useState<string>("home");
  const [numberOfDays, setNumberOfDays] = useState<number>(3);
  const [activeSection, setActiveSection] = useState<"home" | "profile">("home");
  const [progressStats, setProgressStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    averageDuration: 0,
    consistencyStreak: 0
  });
  const [muscleGroupData, setMuscleGroupData] = useState<Array<{
    muscle_group: string;
    total_volume: number;
  }>>([]);

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
      checkAuth();
    };
    checkSession();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkAuth = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    try {
      const {
        data: profileData,
        error: profileError
      } = await supabase.from("profiles").select("first_name, age, weight").eq("id", session.user.id).single();
      if (profileError || !profileData?.age || !profileData?.weight || !profileData?.first_name) {
        navigate("/onboarding");
        return;
      }
      const {
        data: planData,
        error: planError
      } = await supabase.from("workout_plans").select("*").eq("user_id", session.user.id).eq("is_active", true).maybeSingle();
      if (planError) {
        navigate("/onboarding");
        return;
      }
      setProfile({
        first_name: profileData.first_name,
        age: profileData.age,
        weight: profileData.weight,
        fitness_goal: planData?.fitness_goal || "build_muscle",
        workout_location: planData?.workout_location || "home",
        intensity_level: planData?.intensity_level || "beginner",
        equipment: planData?.equipment || []
      });
      if (planData) {
        setWorkoutPlan(planData as WorkoutPlan);
      }
      
      await fetchProgressStats();
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Failed to load profile data");
      navigate("/auth");
    }
  };

  const fetchProgressStats = async () => {
    try {
      const {
        data: progressData,
        error: progressError
      } = await supabase.from("progress_tracking").select("total_volume, workout_duration, created_at").order("created_at", {
        ascending: false
      });
      if (progressError) throw progressError;
      
      const {
        data: muscleData,
        error: muscleError
      } = await supabase.from("muscle_group_tracking").select("muscle_group, total_volume");
      
      if (muscleError) {
        console.error("Error fetching muscle group data:", muscleError);
      }
      
      const totalWorkouts = progressData?.length || 0;
      const totalVolume = progressData?.reduce((sum, record) => sum + (record.total_volume || 0), 0) || 0;
      const averageDuration = Math.round(progressData?.reduce((sum, record) => sum + (record.workout_duration || 0), 0) / (totalWorkouts || 1));
      
      const muscleGroupStats = muscleData ? muscleData.reduce((acc: any, curr) => {
        if (!curr) return acc;
        
        const group = curr.muscle_group;
        if (!group) return acc;
        
        if (!acc[group]) {
          acc[group] = {
            muscle_group: group,
            total_volume: 0
          };
        }
        acc[group].total_volume += curr.total_volume || 0;
        return acc;
      }, {}) : {};
      
      setProgressStats({
        totalWorkouts,
        totalVolume,
        averageDuration,
        consistencyStreak: calculateStreak(progressData || [])
      });
      
      setMuscleGroupData(Object.values(muscleGroupStats || {}));
    } catch (error) {
      console.error("Error fetching progress stats:", error);
      toast.error("Failed to load progress statistics");
    }
  };

  const calculateStreak = (progressData: any[]) => {
    let streak = 0;
    const today = new Date();
    const dailyWorkouts = progressData.reduce((acc: any, curr) => {
      const date = new Date(curr.created_at).toDateString();
      acc[date] = true;
      return acc;
    }, {});
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (dailyWorkouts[date.toDateString()]) {
        streak++;
      } else break;
    }
    return streak;
  };

  const mapToLegacyIntensity = (intensity: string): "beginner" | "intermediate" | "advanced" => {
    switch(intensity) {
      case "easy": return "beginner";
      case "moderate": return "intermediate";
      case "hard": 
      case "intense": return "advanced";
      case "beginner": return "beginner";
      case "intermediate": return "intermediate";
      case "advanced": return "advanced";
      default: return "intermediate";
    }
  };

  const mapToLegacyFitnessGoal = (goal: string): "build_muscle" | "lose_fat" | "increase_mobility" => {
    if (goal === "stay_active") return "build_muscle";
    
    if (goal === "build_muscle" || goal === "lose_fat" || goal === "increase_mobility") {
      return goal as "build_muscle" | "lose_fat" | "increase_mobility";
    }
    
    return "build_muscle";
  };

  const handleUpdateProfile = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session || !profile) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }
    
    const weight = parseFloat(editedWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }
    
    const age = parseInt(editedAge);
    if (isNaN(age) || age <= 0) {
      toast.error("Please enter a valid age");
      return;
    }
    
    try {
      const {
        error: profileError
      } = await supabase.from("profiles").update({
        weight,
        age
      }).eq("id", session.user.id);
      if (profileError) throw profileError;
      
      const intensityToSave = mapToLegacyIntensity(editedIntensity);
      const fitnessGoalToSave = mapToLegacyFitnessGoal(editedFitnessGoal);
      
      const {
        error: planError
      } = await supabase.from("workout_plans").update({
        intensity_level: intensityToSave,
        fitness_goal: fitnessGoalToSave,
        workout_location: editedWorkoutLocation as "home" | "gym",
        is_active: true
      }).eq("user_id", session.user.id).eq("is_active", true);
      if (planError) throw planError;
      
      setProfile({
        ...profile,
        weight,
        age,
        intensity_level: editedIntensity as "easy" | "moderate" | "hard" | "intense" | "beginner" | "intermediate" | "advanced",
        fitness_goal: editedFitnessGoal as "build_muscle" | "lose_fat" | "increase_mobility" | "stay_active",
        workout_location: editedWorkoutLocation as "home" | "gym"
      });
      
      if (workoutPlan) {
        setWorkoutPlan({
          ...workoutPlan,
          intensity_level: intensityToSave as "beginner" | "intermediate" | "advanced",
          fitness_goal: fitnessGoalToSave as "build_muscle" | "lose_fat" | "increase_mobility",
          workout_location: editedWorkoutLocation as "home" | "gym"
        });
      }
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const generateNewPlan = async () => {
    if (!profile) return;
    setGeneratingPlan(true);
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }
    
    try {
      const intensityToUse = mapToLegacyIntensity(profile.intensity_level || "intermediate");
      const fitnessGoalToUse = mapToLegacyFitnessGoal(profile.fitness_goal || "build_muscle");
      
      const {
        data: aiResponse,
        error: aiError
      } = await supabase.functions.invoke('generate-workout', {
        body: {
          age: profile.age,
          weight: profile.weight,
          fitnessGoal: fitnessGoalToUse,
          workoutLocation: profile.workout_location,
          equipment: profile.equipment,
          intensityLevel: intensityToUse,
          numberOfDays: numberOfDays
        }
      });
      if (aiError || !aiResponse) {
        throw new Error(aiError?.message || 'Failed to generate workout plan');
      }
      if (aiResponse.error) {
        throw new Error(aiResponse.error);
      }
      if (!aiResponse.workouts || !Array.isArray(aiResponse.workouts)) {
        throw new Error('Invalid workout plan structure received from AI');
      }
      console.log('Saving workout plan:', {
        userId: session.user.id,
        fitnessGoal: fitnessGoalToUse,
        workoutLocation: profile.workout_location,
        intensityLevel: intensityToUse,
        equipment: profile.equipment,
        planData: aiResponse
      });
      const {
        error: deactivateError
      } = await supabase.from("workout_plans").update({
        is_active: false
      }).eq("user_id", session.user.id);
      if (deactivateError) {
        throw new Error('Failed to deactivate existing workout plans');
      }
      const {
        data: plan,
        error: createError
      } = await supabase.from("workout_plans").insert([{
        user_id: session.user.id,
        fitness_goal: fitnessGoalToUse,
        workout_location: profile.workout_location,
        intensity_level: intensityToUse,
        equipment: profile.equipment,
        plan_data: aiResponse,
        is_active: true,
        workout_frequency: numberOfDays
      }]).select().single();
      if (createError) {
        throw new Error('Failed to save new workout plan');
      }
      if (!plan) {
        throw new Error('No workout plan returned after save');
      }
      setWorkoutPlan(plan as WorkoutPlan);
      toast.success("New workout plan generated!");
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate workout plan");
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!workoutPlan) {
      toast.error("No workout plan to save");
      return;
    }
    const {
      data: session
    } = await supabase.auth.getSession();
    if (!session?.session) {
      toast.error("Please sign in to save workouts");
      navigate("/auth");
      return;
    }
    try {
      const {
        error
      } = await supabase.from("saved_workout_plans").insert({
        user_id: session.session.user.id,
        plan_data: workoutPlan.plan_data,
        name: `Workout Plan - ${new Date().toLocaleDateString()}`
      });
      if (error) throw error;
      toast.success("Workout plan saved successfully!");
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout plan");
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out");
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
    <div className="min-h-screen bg-gradient-to-br from-[#5C2D91] via-[#6D3CAA] to-[#502680] text-white">
      <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
      <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <img 
          src="/lovable-uploads/ed14669a-6c42-46ae-83c8-aaced2305f3d.png"
          alt="PULO Watermark"
          className="absolute bottom-8 left-8 h-48 w-48"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-[120px] py-8">
        <DashboardHeader 
          firstName={profile?.first_name} 
          onSignOut={handleSignOut}
          subscriptionStatus="free"
        />

        <div className="flex flex-col space-y-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-2 rounded-lg flex w-[280px] mx-auto">
            <Button
              variant={activeSection === "home" ? "default" : "ghost"}
              className={`flex-1 ${activeSection === "home" 
                ? "bg-[#8E44AD] hover:bg-[#7D3C98]" 
                : "text-white hover:bg-white/10"}`}
              onClick={() => setActiveSection("home")}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              variant={activeSection === "profile" ? "default" : "ghost"}
              className={`flex-1 ${activeSection === "profile" 
                ? "bg-[#8E44AD] hover:bg-[#7D3C98]" 
                : "text-white hover:bg-white/10"}`}
              onClick={() => setActiveSection("profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>

          <div className="mt-2">
            {activeSection === "home" ? (
              <HomeView 
                profile={profile}
                workoutPlan={workoutPlan}
                numberOfDays={numberOfDays}
                generatingPlan={generatingPlan}
                progressStats={progressStats}
                onDaysChange={setNumberOfDays}
                onGeneratePlan={generateNewPlan}
                onSavePlan={handleSaveWorkout}
              />
            ) : (
              <ProfileView
                profile={profile}
                isEditing={isEditing}
                editedWeight={editedWeight}
                editedAge={editedAge}
                editedIntensity={editedIntensity}
                editedFitnessGoal={editedFitnessGoal}
                editedWorkoutLocation={editedWorkoutLocation}
                muscleGroupData={muscleGroupData}
                progressStats={progressStats}
                onEditToggle={() => {
                  let initialIntensity = profile?.intensity_level || "moderate";
                  if (["beginner", "intermediate", "advanced"].includes(initialIntensity)) {
                    switch(initialIntensity) {
                      case "beginner": initialIntensity = "easy"; break;
                      case "intermediate": initialIntensity = "moderate"; break;
                      case "advanced": initialIntensity = "hard"; break;
                    }
                  }
                  
                  setEditedWeight(profile?.weight?.toString() || "");
                  setEditedAge(profile?.age?.toString() || "");
                  setEditedIntensity(initialIntensity);
                  setEditedFitnessGoal(profile?.fitness_goal || "build_muscle");
                  setEditedWorkoutLocation(profile?.workout_location || "home");
                  setIsEditing(true);
                }}
                onEditWeight={setEditedWeight}
                onEditAge={setEditedAge}
                onEditIntensity={setEditedIntensity}
                onEditFitnessGoal={setEditedFitnessGoal}
                onEditWorkoutLocation={setEditedWorkoutLocation}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
