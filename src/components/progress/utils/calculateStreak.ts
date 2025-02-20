
import { WorkoutData } from "../types";

/**
 * Calculates the user's workout streak based on consecutive days with workouts
 * @param workouts Array of workout data with timestamps
 * @returns Number of consecutive days with workouts, counting backwards from the most recent
 */
export const calculateStreak = (workouts: WorkoutData[]): number => {
  if (!workouts?.length) return 0;

  try {
    // Get today's date at midnight in user's local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sort workouts by date, most recent first
    const sortedWorkouts = [...workouts].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      
      // Validate dates
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        console.error('Invalid date found in workout data');
        return 0;
      }

      // Ignore future dates
      if (dateA > today || dateB > today) {
        return 0;
      }

      return dateB.getTime() - dateA.getTime();
    });

    // Convert workout dates to local midnight timestamps
    const workoutDays = new Set(
      sortedWorkouts
        .map(workout => {
          const date = new Date(workout.created_at);
          if (isNaN(date.getTime())) {
            console.error('Invalid date:', workout.created_at);
            return null;
          }
          if (date > today) {
            console.warn('Future date detected:', workout.created_at);
            return null;
          }
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        })
        .filter((timestamp): timestamp is number => timestamp !== null)
    );

    let streak = 0;
    const DAYS_TO_CHECK = 30;  // Check last 30 days

    for (let i = 0; i < DAYS_TO_CHECK; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      
      if (workoutDays.has(checkDate.getTime())) {
        streak++;
      } else if (streak > 0) {
        // Break streak on first missed day
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
};
