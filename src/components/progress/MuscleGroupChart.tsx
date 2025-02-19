
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Target, Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MuscleGroupData {
  muscle_group: string;
  total_volume: number;
}

interface MuscleGroupChartProps {
  data: MuscleGroupData[];
}

export const MuscleGroupChart = ({ data: initialData }: MuscleGroupChartProps) => {
  const [data, setData] = useState<MuscleGroupData[]>(initialData);
  const hasData = data && data.length > 0;

  const fetchMuscleGroupData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: muscleGroups, error } = await supabase
        .from('muscle_group_tracking')
        .select('muscle_group, total_weight')
        .eq('progress_tracking.user_id', session.user.id)
        .gt('total_weight', 0)
        .join('progress_tracking', { foreignKey: 'progress_tracking_id' });

      if (error) throw error;

      // Aggregate the data by muscle group
      const aggregatedData = muscleGroups.reduce((acc: { [key: string]: number }, curr) => {
        const group = curr.muscle_group;
        acc[group] = (acc[group] || 0) + (curr.total_weight || 0);
        return acc;
      }, {});

      // Format data for the chart
      const formattedData = Object.entries(aggregatedData).map(([muscle_group, total_volume]) => ({
        muscle_group,
        total_volume,
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error fetching muscle group data:', error);
      toast.error('Failed to update muscle group chart');
    }
  };

  useEffect(() => {
    // Set initial data
    setData(initialData);

    // Set up real-time subscription
    const channel = supabase
      .channel('muscle-group-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'muscle_group_tracking'
        },
        () => {
          fetchMuscleGroupData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialData]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl shadow-purple-100/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-purple-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Muscle Group Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid className="text-gray-400" />
              <PolarAngleAxis dataKey="muscle_group" className="text-sm text-gray-600" />
              <PolarRadiusAxis className="text-gray-400" />
              <Radar
                name="Volume"
                dataKey="total_volume"
                stroke="#9333ea"
                fill="#9333ea"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Dumbbell className="h-12 w-12 text-purple-200 mb-3" />
            <p className="text-lg font-medium">No data yet</p>
            <p className="text-sm text-gray-400 mt-1">Log your workouts to see muscle group focus</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
