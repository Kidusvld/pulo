
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Dumbbell, Clock, Target } from "lucide-react";

interface ProgressStatsProps {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  consistencyStreak: number;
}

export const ProgressStats = ({ totalWorkouts, totalVolume, averageDuration, consistencyStreak }: ProgressStatsProps) => {
  const stats = [
    {
      title: "Total Workouts",
      value: totalWorkouts,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Volume",
      value: `${totalVolume.toLocaleString()} lbs`,
      icon: Dumbbell,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg. Duration",
      value: `${averageDuration} min`,
      icon: Clock,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Streak",
      value: `${consistencyStreak} days`,
      icon: Target,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-white/90 backdrop-blur-sm border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
