import { fitnessCategoryMap, calculatePuloFitIndex } from "@/utils/fitnessIndex";

interface PuloFitIndexProps {
  age: number;
  weight: number;
  minimal?: boolean;
}

export const PuloFitIndex = ({ age, weight, minimal = false }: PuloFitIndexProps) => {
  const categoryKey = calculatePuloFitIndex(age, weight);
  const category = fitnessCategoryMap[categoryKey];
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case "yellow":
        return {
          bg: "bg-yellow-50/70",
          border: "border-yellow-200",
          text: "text-yellow-700",
        };
      case "green":
        return {
          bg: "bg-green-50/70",
          border: "border-green-200",
          text: "text-green-700",
        };
      case "orange":
        return {
          bg: "bg-orange-50/70",
          border: "border-orange-200",
          text: "text-orange-700",
        };
      case "red":
        return {
          bg: "bg-red-50/70",
          border: "border-red-200",
          text: "text-red-700",
        };
      default:
        return {
          bg: "bg-purple-50/70",
          border: "border-purple-100",
          text: "text-purple-700",
        };
    }
  };
  
  const colorClasses = getColorClasses(category.color);
  
  if (minimal) {
    return (
      <div className="inline-flex items-center gap-1 ml-2">
        <div className={`rounded-full px-2 py-0.5 ${colorClasses.bg} ${colorClasses.border}`}>
          <div className="flex items-center gap-1">
            <span className="text-sm">{category.emoji}</span>
            <span className={`text-xs font-semibold ${colorClasses.text}`}>{category.name}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-lg border p-4 bg-white/90 backdrop-blur-sm border-purple-100 shadow-lg shadow-purple-100/20">
      <div className="mb-2">
        <span className="text-sm text-purple-600 font-medium">PULO Fit Index</span>
      </div>
      
      <div className={`rounded-lg p-4 ${colorClasses.bg} ${colorClasses.border} mb-2`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{category.emoji}</span>
          <h3 className={`text-lg font-bold ${colorClasses.text}`}>{category.name}</h3>
        </div>
        <p className="text-sm text-purple-700">{category.message}</p>
      </div>
      
      <p className="text-xs text-purple-500/70 italic">
        Based on your age and weight profile
      </p>
    </div>
  );
};
