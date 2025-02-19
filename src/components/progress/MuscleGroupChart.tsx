
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Target, Dumbbell } from "lucide-react";

interface MuscleGroupChartProps {
  data: Array<{
    muscle_group: string;
    total_volume: number;
  }>;
}

export const MuscleGroupChart = ({ data }: MuscleGroupChartProps) => {
  const hasData = data && data.length > 0;

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
