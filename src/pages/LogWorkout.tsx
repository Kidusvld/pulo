
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { WorkoutForm } from "@/components/progress/WorkoutForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Workout {
  id: string;
  created_at: string;
  workout_duration: number;
  total_volume: number;
  energy_level: number;
  mood: string;
  muscle_group?: string;
}

const LogWorkout = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const fetchWorkouts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('progress_tracking')
        .select(`
          *,
          muscle_group_tracking!fk_progress_tracking(muscle_group)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(workout => ({
        ...workout,
        muscle_group: workout.muscle_group_tracking?.[0]?.muscle_group
      }));

      setWorkouts(formattedData);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load workout history');
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      // With ON DELETE CASCADE, we only need to delete the progress_tracking record
      const { error: progressError } = await supabase
        .from('progress_tracking')
        .delete()
        .eq('id', id);

      if (progressError) throw progressError;
      
      // Update local state to remove the deleted workout
      setWorkouts(workouts => workouts.filter(workout => workout.id !== id));
      toast.success('Workout deleted successfully');
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
    }
  };

  useEffect(() => {
    fetchWorkouts();

    // Set up real-time subscription
    const channel = supabase
      .channel('workout-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress_tracking'
        },
        () => {
          fetchWorkouts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="absolute inset-0 bg-grid-slate-100/20 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-96 w-96 rounded-full bg-purple-600/8 blur-3xl bottom-20 right-20 -z-10"></div>
        
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 font-montserrat">Log Workout</h1>
          <Button 
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="bg-white/80 hover:bg-white text-slate-800 border-slate-300 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-8">
          <WorkoutForm onSuccess={fetchWorkouts} />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 font-montserrat">Workout History</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="text-slate-800 font-semibold">Date</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Duration (min)</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Volume (lbs)</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Muscle Group</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Energy (1-5)</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Mood</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workouts.map((workout) => (
                    <TableRow key={workout.id} className="border-slate-200">
                      <TableCell className="text-slate-700">
                        {format(new Date(workout.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-slate-700">{workout.workout_duration}</TableCell>
                      <TableCell className="text-slate-700">{workout.total_volume}</TableCell>
                      <TableCell className="text-slate-700 capitalize">{workout.muscle_group || '-'}</TableCell>
                      <TableCell className="text-slate-700">{workout.energy_level}</TableCell>
                      <TableCell className="text-slate-700">{workout.mood}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white/95 backdrop-blur-lg border-slate-200 text-slate-900">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-900 font-montserrat">Delete Workout</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-700">
                                  Are you sure you want to delete this workout? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteWorkout(workout.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogWorkout;
