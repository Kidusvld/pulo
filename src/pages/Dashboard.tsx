
import { useState } from "react";
import { BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuloFitIndex } from "@/components/dashboard/PuloFitIndex";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { QuickStatsCard } from "@/components/dashboard/QuickStatsCard";
import { MotivationalBanner } from "@/components/dashboard/MotivationalBanner";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProfileActions } from "@/hooks/useProfileActions";
import { format } from "date-fns";

const Dashboard = () => {
  const {
    loading,
    profile,
    workoutPlan,
    progressStats,
    refreshData
  } = useDashboardData();

  const [activeTab, setActiveTab] = useState("home");

  const {
    isEditing,
    editedWeight,
    editedIntensity,
    editedFitnessGoal,
    editedWorkoutLocation,
    generatingPlan,
    numberOfDays,
    setEditedWeight,
    setEditedIntensity,
    setEditedFitnessGoal,
    setEditedWorkoutLocation,
    setNumberOfDays,
    handleEditToggle,
    handleUpdateProfile,
    generateNewPlan,
    handleSignOut
  } = useProfileActions(profile, workoutPlan, refreshData);

  // Calculate stats for quick stats card
  const getLastWorkoutDate = () => {
    if (progressStats.totalWorkouts === 0) return null;
    
    const now = new Date();
    const daysAgo = progressStats.consistencyStreak > 0 ? 0 : 
                   (progressStats.totalWorkouts > 0 ? Math.floor(Math.random() * 10) + 3 : null);
    
    if (daysAgo === null) return null;
    
    const lastWorkoutDate = new Date();
    lastWorkoutDate.setDate(now.getDate() - daysAgo);
    
    return format(lastWorkoutDate, "MMM d");
  };
  
  // Placeholder stats - in a real app, these would come from the database
  const weeklyWorkouts = progressStats.consistencyStreak > 0 ? 
                        Math.min(progressStats.consistencyStreak, 7) : 
                        Math.min(Math.floor(progressStats.totalWorkouts / 4), 7);
  
  const caloriesBurned = progressStats.totalWorkouts * 250;
  const minutesActive = progressStats.totalWorkouts * progressStats.averageDuration;

  const handleGenerateWorkout = async () => {
    await generateNewPlan();
    setActiveTab("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-deep-purple-800 via-deep-purple-900 to-deep-purple-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-300"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-purple-900 via-deep-purple-800 to-deep-purple-900">
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-500/10 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-64 w-64 rounded-full bg-purple-600/10 blur-3xl bottom-20 right-20 -z-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader 
          firstName={profile?.first_name}
          onSignOut={handleSignOut}
          streak={progressStats.consistencyStreak}
          lastWorkoutDate={getLastWorkoutDate()}
        />

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-[400px] mb-6 bg-white/10 backdrop-blur-sm border border-purple-500/20">
            <TabsTrigger value="home" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white">
              Home
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white">
              <BarChart className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <MotivationalBanner />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TodayWorkoutCard 
                workoutPlan={workoutPlan} 
                onGeneratePlan={handleGenerateWorkout}
              />
              
              <div className="space-y-6">
                <QuickStatsCard 
                  weeklyWorkouts={weeklyWorkouts}
                  caloriesBurned={caloriesBurned}
                  minutesActive={minutesActive}
                />
                
                {profile && (
                  <PuloFitIndex 
                    age={profile.age} 
                    weight={profile.weight}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileCard 
              profile={profile}
              isEditing={isEditing}
              editedWeight={editedWeight}
              editedIntensity={editedIntensity}
              editedFitnessGoal={editedFitnessGoal}
              editedWorkoutLocation={editedWorkoutLocation}
              onEditToggle={handleEditToggle}
              onEditWeight={setEditedWeight}
              onEditIntensity={setEditedIntensity}
              onEditFitnessGoal={setEditedFitnessGoal}
              onEditWorkoutLocation={setEditedWorkoutLocation}
              onUpdateProfile={handleUpdateProfile}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
