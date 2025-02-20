
export interface WorkoutData {
  created_at: string;
  workout_duration: number;
  total_volume: number;
}

export interface ProgressStats {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  consistencyStreak: number;
}

export interface ProgressStatsProps {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  consistencyStreak: number;
}
