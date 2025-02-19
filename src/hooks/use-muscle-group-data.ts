
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MuscleGroupData {
  muscle_group: string;
  total_volume: number;
}

export const useMuscleGroupData = (initialData: MuscleGroupData[]) => {
  const [data, setData] = useState<MuscleGroupData[]>(initialData);

  const fetchMuscleGroupData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: muscleGroups, error } = await supabase
        .from('muscle_group_tracking')
        .select(`
          muscle_group,
          total_weight,
          progress_tracking!inner (
            user_id
          )
        `)
        .eq('progress_tracking.user_id', session.user.id)
        .gt('total_weight', 0);

      if (error) throw error;

      const aggregatedData = muscleGroups.reduce((acc: { [key: string]: number }, curr) => {
        const group = curr.muscle_group;
        const weight = typeof curr.total_weight === 'number' ? curr.total_weight : 0;
        acc[group] = (acc[group] || 0) + weight;
        return acc;
      }, {});

      const formattedData: MuscleGroupData[] = Object.entries(aggregatedData).map(([muscle_group, total_volume]) => ({
        muscle_group,
        total_volume: Number(total_volume),
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error fetching muscle group data:', error);
      toast.error('Failed to update muscle group chart');
    }
  }, []);

  useEffect(() => {
    setData(initialData);

    const channel = supabase
      .channel('muscle-group-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'muscle_group_tracking'
        },
        fetchMuscleGroupData
      )
      .subscribe();

    // Initial fetch
    fetchMuscleGroupData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialData, fetchMuscleGroupData]);

  return { data, hasData: data.length > 0 };
};
