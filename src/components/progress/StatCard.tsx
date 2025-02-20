
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor
}: StatCardProps) => {
  return (
    <Card className="bg-white/900 backdrop-blur-sm border-purple-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold tracking-wide text-gray-600/90 uppercase">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-gray-900">
          {value}
        </div>
      </CardContent>
    </Card>
  );
};
