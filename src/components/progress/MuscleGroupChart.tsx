
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface MuscleGroupChartProps {
  data: Array<{
    muscle_group: string;
    total_volume: number;
  }>;
}

export const MuscleGroupChart = ({ data }: MuscleGroupChartProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl shadow-purple-100/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-purple-900">Muscle Group Focus</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
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
      </CardContent>
    </Card>
  );
};
