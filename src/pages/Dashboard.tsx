import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, DumbbellIcon } from "lucide-react";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { MuscleGroupChart } from "@/components/progress/MuscleGroupChart";
import { WorkoutForm } from "@/components/progress/WorkoutForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { WorkoutPlanCard } from "@/components/dashboard/WorkoutPlanCard";

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
  const [editedIntensity, setEditedIntensity] = useState<string>("moderate");
  const [editedFitnessGoal, setEditedFitnessGoal] = useState<string>("build_muscle");
  const [editedWorkoutLocation, setEditedWorkoutLocation] = useState<string>("home");
  const [numberOfDays, setNumberOfDays] = useState<number>(3);
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
      } = await supabase.from("progress_tracking").select("total_volume, workout_duration").order("created_at", {
        ascending: false
      });
      if (progressError) throw progressError;
      const {
        data: muscleData,
        error: muscleError
      } = await supabase.from("muscle_group_tracking").select("muscle_group, total_weight");
      if (muscleError) throw muscleError;
      const totalWorkouts = progressData?.length || 0;
      const totalVolume = progressData?.reduce((sum, record) => sum + (record.total_volume || 0), 0) || 0;
      const averageDuration = Math.round(progressData?.reduce((sum, record) => sum + (record.workout_duration || 0), 0) / (totalWorkouts || 1));
      const muscleGroupStats = muscleData?.reduce((acc: any, curr) => {
        const group = curr.muscle_group;
        if (!acc[group]) {
          acc[group] = {
            muscle_group: group,
            total_volume: 0
          };
        }
        acc[group].total_volume += curr.total_weight || 0;
        return acc;
      }, {});
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
      // If it's already a legacy value, return it as is
      case "beginner": return "beginner";
      case "intermediate": return "intermediate";
      case "advanced": return "advanced";
      default: return "intermediate";
    }
  };

  const mapToLegacyFitnessGoal = (goal: string): "build_muscle" | "lose_fat" | "increase_mobility" => {
    // stay_active is not supported in the database, map it to a supported value
    if (goal === "stay_active") return "build_muscle";
    
    // If it's already a valid database value, return it
    if (goal === "build_muscle" || goal === "lose_fat" || goal === "increase_mobility") {
      return goal as "build_muscle" | "lose_fat" | "increase_mobility";
    }
    
    // Default fallback
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
    try {
      const {
        error: profileError
      } = await supabase.from("profiles").update({
        weight
      }).eq("id", session.user.id);
      if (profileError) throw profileError;
      
      // Convert intensity level to database format
      const intensityToSave = mapToLegacyIntensity(editedIntensity);
      // Convert fitness goal to database format
      const fitnessGoalToSave = mapToLegacyFitnessGoal(editedFitnessGoal);
      
      const {
        error: planError
      } = await supabase.from("workout_plans").update({
        intensity_level: intensityToSave,
        fitness_goal: fitnessGoalToSave,
        workout_location: editedWorkoutLocation,
        is_active: true
      }).eq("user_id", session.user.id).eq("is_active", true);
      if (planError) throw planError;
      
      setProfile({
        ...profile,
        weight,
        intensity_level: editedIntensity,
        fitness_goal: editedFitnessGoal as any,
        workout_location: editedWorkoutLocation as any
      });
      
      if (workoutPlan) {
        setWorkoutPlan({
          ...workoutPlan,
          intensity_level: intensityToSave as any,
          fitness_goal: fitnessGoalToSave as any,
          workout_location: editedWorkoutLocation as any
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
      // Use mapToLegacyIntensity to ensure we're using the correct enum value
      const intensityToUse = mapToLegacyIntensity(profile.intensity_level || "intermediate");
      // Use mapToLegacyFitnessGoal to ensure we're using the correct enum value
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-purple-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-100/50 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-100/50 blur-3xl bottom-20 right-20 -z-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader 
          firstName={profile?.first_name} 
          onSignOut={handleSignOut}
        />

        <Tabs defaultValue="workout" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-[400px] mb-6 bg-white/80 border border-purple-100">
            <TabsTrigger value="workout" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <DumbbellIcon className="h-4 w-4" />
              Workout Plan
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-6">
            <ProfileCard 
              profile={profile}
              isEditing={isEditing}
              editedWeight={editedWeight}
              editedIntensity={editedIntensity}
              editedFitnessGoal={editedFitnessGoal}
              editedWorkoutLocation={editedWorkoutLocation}
              onEditToggle={() => {
                // Map legacy intensity values to new format for editing
                let initialIntensity = profile?.intensity_level || "moderate";
                if (["beginner", "intermediate", "advanced"].includes(initialIntensity)) {
                  switch(initialIntensity) {
                    case "beginner": initialIntensity = "easy"; break;
                    case "intermediate": initialIntensity = "moderate"; break;
                    case "advanced": initialIntensity = "hard"; break;
                  }
                }
                
                setEditedWeight(profile?.weight?.toString() || "");
                setEditedIntensity(initialIntensity);
                setEditedFitnessGoal(profile?.fitness_goal || "build_muscle");
                setEditedWorkoutLocation(profile?.workout_location || "home");
                setIsEditing(true);
              }}
              onEditWeight={setEditedWeight}
              onEditIntensity={setEditedIntensity}
              onEditFitnessGoal={setEditedFitnessGoal}
              onEditWorkoutLocation={setEditedWorkoutLocation}
              onUpdateProfile={handleUpdateProfile}
            />

            <WorkoutPlanCard 
              workoutPlan={workoutPlan}
              numberOfDays={numberOfDays}
              generatingPlan={generatingPlan}
              onDaysChange={setNumberOfDays}
              onGeneratePlan={generateNewPlan}
              onSavePlan={handleSaveWorkout}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressStats {...progressStats} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WorkoutForm />
              <MuscleGroupChart data={muscleGroupData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
