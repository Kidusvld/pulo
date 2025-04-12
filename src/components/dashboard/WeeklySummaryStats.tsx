
import { useState, useEffect } from "react";
import { Trophy, Calendar, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WeekStats {
  workoutsThisWeek: number;
  activeDays: number;
  totalWorkouts: number;
}

interface WeeklySummaryStatsProps {
  stats: WeekStats;
  consistencyStreak: number;
}

export const WeeklySummaryStats = ({ stats, consistencyStreak }: WeeklySummaryStatsProps) => {
  // Generate day labels for the last 7 days
  const getDayLabels = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const todayIndex = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Reorder days to start with the day that was 6 days ago
    const orderedDays = [
      ...days.slice(todayIndex - 6 < 0 ? todayIndex + 1 : todayIndex - 6),
      ...days.slice(0, todayIndex + 1 > 6 ? todayIndex - 6 : todayIndex + 1)
    ];
    
    return days;
  };
  
  // Mock data for active days (in a real app, this would come from the database)
  const [activeDaysData, setActiveDaysData] = useState<boolean[]>([]);
  
  useEffect(() => {
    // Generate mock data based on streak count
    const mockData = Array(7).fill(false).map((_, idx) => {
      if (stats.activeDays > 0 && idx >= 7 - stats.activeDays) {
        return true;
      }
      return false;
    });
    setActiveDaysData(mockData);
  }, [stats.activeDays]);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* This Week's Workouts */}
        <div className="bg-purple-50/70 rounded-lg p-4 border border-purple-100 flex flex-col items-center">
          <Calendar className="h-8 w-8 text-[#8E44AD] mb-2" />
          <p className="text-sm text-[#5C2D91] text-center font-medium">This Week</p>
          <p className="text-2xl font-bold text-[#5C2D91]">{stats.workoutsThisWeek}</p>
          <p className="text-xs text-[#8E44AD]/70 text-center">workouts</p>
        </div>
        
        {/* Active Days */}
        <div className="bg-purple-50/70 rounded-lg p-4 border border-purple-100 flex flex-col items-center">
          <Activity className="h-8 w-8 text-[#8E44AD] mb-2" />
          <p className="text-sm text-[#5C2D91] text-center font-medium">Active Days</p>
          <p className="text-2xl font-bold text-[#5C2D91]">{stats.activeDays}</p>
          <p className="text-xs text-[#8E44AD]/70 text-center">this week</p>
        </div>
        
        {/* Total Workouts */}
        <div className="bg-purple-50/70 rounded-lg p-4 border border-purple-100 flex flex-col items-center">
          <Trophy className="h-8 w-8 text-[#8E44AD] mb-2" />
          <p className="text-sm text-[#5C2D91] text-center font-medium">All-Time</p>
          <p className="text-2xl font-bold text-[#5C2D91]">{stats.totalWorkouts}</p>
          <p className="text-xs text-[#8E44AD]/70 text-center">workouts</p>
        </div>
      </div>
      
      {/* Weekly Activity Visualization */}
      <div className="bg-purple-50/40 rounded-lg p-4 border border-purple-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-[#5C2D91] font-semibold">Weekly Activity</p>
          <Badge variant="purple" className="bg-[#8E44AD]/90">
            {consistencyStreak > 0 
              ? `${consistencyStreak} Day Streak` 
              : "No Current Streak"}
          </Badge>
        </div>
        <div className="flex justify-between gap-1 mt-2">
          {activeDaysData.map((isActive, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full aspect-square rounded-md ${
                  isActive 
                    ? 'bg-[#8E44AD] shadow-sm shadow-[#8E44AD]/30' 
                    : 'bg-gray-200/80 border border-gray-300/30'
                }`}
              />
              <span className="text-xs text-[#5C2D91]/80 mt-1">{dayLabels[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
