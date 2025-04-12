
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Target } from "lucide-react";
import { useMuscleGroupData } from "@/hooks/use-muscle-group-data";
import { EmptyMuscleGroupChart } from "./EmptyMuscleGroupChart";

interface MuscleGroupChartProps {
  data: Array<{
    muscle_group: string;
    total_volume: number;
  }>;
}

export const MuscleGroupChart = ({ data: initialData }: MuscleGroupChartProps) => {
  const { data, hasData } = useMuscleGroupData(initialData);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100/30 shadow-xl shadow-purple-900/10 overflow-hidden h-full">
      <CardHeader className="border-b border-purple-100/20 pb-3">
        <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Muscle Group Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="muscle_group" tick={{ fill: '#5C2D91', fontSize: 12 }} />
              <PolarRadiusAxis stroke="#cbd5e1" />
              <Radar
                name="Volume"
                dataKey="total_volume"
                stroke="#8E44AD"
                fill="#8E44AD"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyMuscleGroupChart />
        )}
      </CardContent>
    </Card>
  );
};
