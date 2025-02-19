
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
          muscle_group_tracking(muscle_group)
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
      const { error } = await supabase
        .from('progress_tracking')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Workout deleted successfully');
      fetchWorkouts();
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80")',
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Log Workout</h1>
            <Button 
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-purple-50 hover:text-purple-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="space-y-8">
            <WorkoutForm onSuccess={fetchWorkouts} />

            <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-purple-100 p-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-4">Workout History</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration (min)</TableHead>
                      <TableHead>Volume (lbs)</TableHead>
                      <TableHead>Muscle Group</TableHead>
                      <TableHead>Energy (1-5)</TableHead>
                      <TableHead>Mood</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workouts.map((workout) => (
                      <TableRow key={workout.id}>
                        <TableCell>
                          {format(new Date(workout.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>{workout.workout_duration}</TableCell>
                        <TableCell>{workout.total_volume}</TableCell>
                        <TableCell className="capitalize">{workout.muscle_group || '-'}</TableCell>
                        <TableCell>{workout.energy_level}</TableCell>
                        <TableCell>{workout.mood}</TableCell>
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
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this workout? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
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
    </div>
  );
};

export default LogWorkout;
