
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
    <div>
      {/* Stats Cards in a horizontal grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Weekly Workouts */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-2">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.workoutsThisWeek}</p>
          <p className="text-xs text-slate-600 text-center font-medium">weekly workouts</p>
        </div>
        
        {/* Active Days */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-2">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.activeDays}</p>
          <p className="text-xs text-slate-600 text-center font-medium">active days</p>
        </div>
        
        {/* Total Workouts */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-2">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.totalWorkouts}</p>
          <p className="text-xs text-slate-600 text-center font-medium">all-time</p>
        </div>
      </div>
      
      {/* Weekly Activity Visualization */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-700 font-semibold">Weekly Activity</p>
          <Badge 
            variant="outline" 
            className={`text-xs font-medium ${
              consistencyStreak > 0 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400" 
                : "bg-slate-100 text-slate-600 border-slate-300"
            }`}
          >
            {consistencyStreak > 0 
              ? `${consistencyStreak} Day Streak` 
              : "No Current Streak"}
          </Badge>
        </div>
        <div className="flex justify-between gap-1 mt-3">
          {activeDaysData.map((isActive, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full aspect-square rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-200' 
                    : 'bg-slate-200 border border-slate-300 hover:bg-slate-300'
                }`}
              />
              <span className="text-xs text-slate-600 mt-1 font-medium">{dayLabels[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
