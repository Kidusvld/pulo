
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, DumbbellIcon } from "lucide-react";
import { ProgressStats } from "@/components/progress/ProgressStats";
import { MuscleGroupChart } from "@/components/progress/MuscleGroupChart";
import { WorkoutForm } from "@/components/progress/WorkoutForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { WorkoutPlanCard } from "@/components/dashboard/WorkoutPlanCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProfileActions } from "@/hooks/useProfileActions";
import { PuloFitIndex } from "@/components/dashboard/PuloFitIndex";

const Dashboard = () => {
  const {
    loading,
    profile,
    workoutPlan,
    progressStats,
    muscleGroupData
  } = useDashboardData();

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
    handleSaveWorkout,
    handleSignOut
  } = useProfileActions(profile, workoutPlan);

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
          subscriptionStatus={profile?.subscription_status}
        />

        <Tabs defaultValue="workout" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-[400px] mb-6 bg-white/10 backdrop-blur-sm border border-purple-500/20">
            <TabsTrigger value="workout" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white">
              <DumbbellIcon className="h-4 w-4" />
              Workout Plan
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white">
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
              onEditToggle={handleEditToggle}
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
              subscriptionStatus={profile?.subscription_status}
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
