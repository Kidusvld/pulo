import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, DumbbellIcon, Trophy, Calendar, LogOut, BarChart } from "lucide-react";
import { WorkoutForm } from "@/components/progress/WorkoutForm";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { MuscleGroupChart } from "@/components/progress/MuscleGroupChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkoutRequest {
  age: number;
  weight: number;
  fitnessGoal: 'lose_fat' | 'build_muscle' | 'increase_mobility';
  workoutLocation: 'home' | 'gym';
  equipment: string[];
  intensityLevel: 'beginner' | 'intermediate' | 'advanced';
  numberOfDays: number;
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
  fitness_goal: "lose_fat" | "build_muscle" | "increase_mobility";
  workout_location: "home" | "gym";
  intensity_level: "beginner" | "intermediate" | "advanced";
  equipment: string[];
}

interface Profile {
  first_name: string;
  age: number;
  weight: number;
  fitness_goal: "lose_fat" | "build_muscle" | "increase_mobility";
  workout_location: "home" | "gym";
  intensity_level: "beginner" | "intermediate" | "advanced";
  equipment: string[];
}

interface SaveWorkoutPlan {
  user_id: string;
  plan_data: {
    workouts: Array<{
      day: number;
      exercises: Array<{
        name: string;
        sets: number;
        reps: number;
        rest: number;
      }>;
    }>;
  };
  name: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState<string>("");
  const [editedIntensity, setEditedIntensity] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [editedFitnessGoal, setEditedFitnessGoal] = useState<"build_muscle" | "lose_fat" | "increase_mobility">("build_muscle");
  const [editedWorkoutLocation, setEditedWorkoutLocation] = useState<"home" | "gym">("home");
  const [numberOfDays, setNumberOfDays] = useState<number>(3);
  const [progressStats, setProgressStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    averageDuration: 0,
    consistencyStreak: 0,
  });
  const [muscleGroupData, setMuscleGroupData] = useState<Array<{
    muscle_group: string;
    total_volume: number;
  }>>([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      checkAuth();
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, age, weight")
        .eq("id", session.user.id)
        .single();

      if (profileError || !profileData?.age || !profileData?.weight || !profileData?.first_name) {
        navigate("/onboarding");
        return;
      }

      const { data: planData, error: planError } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .maybeSingle();

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
      const { data: progressData, error: progressError } = await supabase
        .from("progress_tracking")
        .select("total_volume, workout_duration")
        .order("created_at", { ascending: false });

      if (progressError) throw progressError;

      const { data: muscleData, error: muscleError } = await supabase
        .from("muscle_group_tracking")
        .select("muscle_group, total_weight");

      if (muscleError) throw muscleError;

      const totalWorkouts = progressData?.length || 0;
      const totalVolume = progressData?.reduce((sum, record) => sum + (record.total_volume || 0), 0) || 0;
      const averageDuration = Math.round(
        progressData?.reduce((sum, record) => sum + (record.workout_duration || 0), 0) / (totalWorkouts || 1)
      );

      const muscleGroupStats = muscleData?.reduce((acc: any, curr) => {
        const group = curr.muscle_group;
        if (!acc[group]) {
          acc[group] = { muscle_group: group, total_volume: 0 };
        }
        acc[group].total_volume += curr.total_weight || 0;
        return acc;
      }, {});

      setProgressStats({
        totalWorkouts,
        totalVolume,
        averageDuration,
        consistencyStreak: calculateStreak(progressData || []),
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

  const handleUpdateProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
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
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ weight })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      const { error: planError } = await supabase
        .from("workout_plans")
        .update({ 
          intensity_level: editedIntensity,
          fitness_goal: editedFitnessGoal,
          workout_location: editedWorkoutLocation,
          is_active: true
        })
        .eq("user_id", session.user.id)
        .eq("is_active", true);

      if (planError) throw planError;

      setProfile({
        ...profile,
        weight,
        intensity_level: editedIntensity,
        fitness_goal: editedFitnessGoal,
        workout_location: editedWorkoutLocation
      });

      if (workoutPlan) {
        setWorkoutPlan({
          ...workoutPlan,
          intensity_level: editedIntensity,
          fitness_goal: editedFitnessGoal,
          workout_location: editedWorkoutLocation
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
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }

    try {
      const { data: aiResponse, error: aiError } = await supabase.functions
        .invoke('generate-workout', {
          body: {
            age: profile.age,
            weight: profile.weight,
            fitnessGoal: profile.fitness_goal,
            workoutLocation: profile.workout_location,
            equipment: profile.equipment,
            intensityLevel: profile.intensity_level,
            numberOfDays: numberOfDays
          },
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
        fitnessGoal: profile.fitness_goal,
        workoutLocation: profile.workout_location,
        intensityLevel: profile.intensity_level,
        equipment: profile.equipment,
        planData: aiResponse
      });

      const { error: deactivateError } = await supabase
        .from("workout_plans")
        .update({ is_active: false })
        .eq("user_id", session.user.id);

      if (deactivateError) {
        throw new Error('Failed to deactivate existing workout plans');
      }

      const { data: plan, error: createError } = await supabase
        .from("workout_plans")
        .insert([
          {
            user_id: session.user.id,
            fitness_goal: profile.fitness_goal,
            workout_location: profile.workout_location,
            intensity_level: profile.intensity_level,
            equipment: profile.equipment,
            plan_data: aiResponse,
            is_active: true,
            workout_frequency: numberOfDays
          }
        ])
        .select()
        .single();

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

    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session) {
      toast.error("Please sign in to save workouts");
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("saved_workout_plans")
        .insert({
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-purple-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-100/50 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-blue-100/50 blur-3xl bottom-20 right-20 -z-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Track your fitness journey and achieve your goals</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/log-workout")}
              className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200"
            >
              <DumbbellIcon className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/saved-workouts")}
              className="bg-white/80 hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200"
            >
              Saved Plans
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="bg-white/80 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="workout" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="workout" className="flex items-center gap-2">
              <DumbbellIcon className="h-4 w-4" />
              Workout Plan
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl shadow-purple-100/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-purple-900">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  Your Profile
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (isEditing) {
                      handleUpdateProfile();
                    } else {
                      setEditedWeight(profile?.weight?.toString() || "");
                      setEditedIntensity(profile?.intensity_level || "beginner");
                      setEditedFitnessGoal(profile?.fitness_goal || "build_muscle");
                      setEditedWorkoutLocation(profile?.workout_location || "home");
                      setIsEditing(true);
                    }
                  }}
                  className="bg-white hover:bg-purple-50 hover:text-purple-600 border-purple-100 transition-all duration-200"
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                  {!isEditing && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-purple-600 font-medium">Age</p>
                    <p className="text-lg font-semibold text-purple-900">{profile?.age} years</p>
                  </div>
                  <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-purple-600 font-medium">Weight</p>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedWeight}
                        onChange={(e) => setEditedWeight(e.target.value)}
                        placeholder="Enter weight in lbs"
                        className="mt-1 bg-white border-purple-100"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-purple-900">{profile?.weight} lbs</p>
                    )}
                  </div>
                  <div className="col-span-2 bg-purple-50/50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-purple-600 font-medium">Fitness Goal</p>
                    {isEditing ? (
                      <Select
                        value={editedFitnessGoal}
                        onValueChange={(value: "build_muscle" | "lose_fat" | "increase_mobility") => 
                          setEditedFitnessGoal(value)
                        }
                      >
                        <SelectTrigger className="mt-1 bg-white border-purple-100">
                          <SelectValue placeholder="Select fitness goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="build_muscle">Build Muscle</SelectItem>
                          <SelectItem value="lose_fat">Lose Fat</SelectItem>
                          <SelectItem value="increase_mobility">Increase Mobility</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg font-semibold text-purple-900 capitalize">
                        {profile?.fitness_goal?.replace(/_/g, ' ')}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 bg-purple-50/50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-purple-600 font-medium">Workout Intensity</p>
                    {isEditing ? (
                      <Select
                        value={editedIntensity}
                        onValueChange={(value: "beginner" | "intermediate" | "advanced") => 
                          setEditedIntensity(value)
                        }
                      >
                        <SelectTrigger className="mt-1 bg-white border-purple-100">
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg font-semibold text-purple-900 capitalize">
                        {profile?.intensity_level}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 bg-purple-50/50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-purple-600 font-medium">Workout Location</p>
                    {isEditing ? (
                      <Select
                        value={editedWorkoutLocation}
                        onValueChange={(value: "home" | "gym") => 
                          setEditedWorkoutLocation(value)
                        }
                      >
                        <SelectTrigger className="mt-1 bg-white border-purple-100">
                          <SelectValue placeholder="Select workout location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="gym">Gym</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg font-semibold text-purple-900 capitalize">
                        {profile?.workout_location}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl shadow-purple-100/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-purple-900">
                  <DumbbellIcon className="h-5 w-5 text-purple-600" />
                  Your Workout Plan
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="days" className="text-sm text-purple-600 font-medium">Days:</label>
                    <Select
                      value={numberOfDays.toString()}
                      onValueChange={(value) => setNumberOfDays(parseInt(value))}
                    >
                      <SelectTrigger className="w-[100px] bg-white border-purple-100">
                        <SelectValue placeholder="Days" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'day' : 'days'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    {workoutPlan && (
                      <Button
                        variant="outline"
                        onClick={handleSaveWorkout}
                        className="bg-white hover:bg-purple-50 hover:text-purple-600 border-purple-100"
                      >
                        Save Plan
                      </Button>
                    )}
                    <Button
                      onClick={generateNewPlan}
                      disabled={generatingPlan}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200"
                    >
                      {generatingPlan ? "Generating..." : "Generate New Plan"}
                      {!generatingPlan && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {workoutPlan?.plan_data?.workouts ? (
                  <div className="space-y-6">
                    {workoutPlan.plan_data.workouts.map((workout, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-purple-900">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          Day {workout.day}
                        </h3>
                        <div className="grid gap-4">
                          {workout.exercises.map((exercise, exerciseIndex) => (
                            <div
                              key={exerciseIndex}
                              className="bg-purple-50/50 p-4 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors duration-200"
                            >
                              <p className="font-medium text-purple-900">{exercise.name}</p>
                              <p className="text-sm text-purple-600 mt-1">
                                {exercise.sets} sets × {exercise.reps} reps
                                (Rest: {Math.floor(exercise.rest / 60)} min)
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DumbbellIcon className="h-16 w-16 text-purple-200 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No workout plan generated yet. Click the button above to create one!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
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
