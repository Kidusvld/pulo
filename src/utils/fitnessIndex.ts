
type FitnessCategory = {
  name: string;
  color: string;
  emoji: string;
  message: string;
};

export const fitnessCategoryMap: Record<string, FitnessCategory> = {
  "getting_started": {
    name: "Getting Started",
    color: "yellow",
    emoji: "🟡",
    message: "You're just beginning your fitness journey — we're here to help you build momentum with PULO!"
  },
  "in_the_zone": {
    name: "In the Zone",
    color: "green",
    emoji: "🟢",
    message: "Your PULO Fit metrics look good — let's keep moving forward together 💪"
  },
  "leveling_up": {
    name: "Leveling Up",
    color: "orange",
    emoji: "🟠",
    message: "You're making progress on your PULO fitness journey — keep pushing yourself!"
  },
  "time_to_lock_in": {
    name: "Time to Lock In",
    color: "red",
    emoji: "🔴",
    message: "Now's the perfect time to commit to your PULO fitness goals — you've got this!"
  }
};

export const calculatePuloFitIndex = (age: number, weight: number): keyof typeof fitnessCategoryMap => {
  // Ages 18-25
  if (age >= 18 && age <= 25) {
    if (weight < 120) return "getting_started";
    if (weight >= 120 && weight <= 180) return "in_the_zone";
    if (weight > 180 && weight <= 220) return "leveling_up";
    return "time_to_lock_in";
  }
  
  // Ages 26-40
  if (age >= 26 && age <= 40) {
    if (weight < 130) return "getting_started";
    if (weight >= 130 && weight <= 190) return "in_the_zone";
    if (weight > 190 && weight <= 230) return "leveling_up";
    return "time_to_lock_in";
  }
  
  // Ages 41-60
  if (age >= 41 && age <= 60) {
    if (weight < 140) return "getting_started";
    if (weight >= 140 && weight <= 200) return "in_the_zone";
    if (weight > 200 && weight <= 240) return "leveling_up";
    return "time_to_lock_in";
  }
  
  // Ages 61-100
  if (age >= 61 && age <= 100) {
    if (weight < 130) return "getting_started";
    if (weight >= 130 && weight <= 180) return "in_the_zone";
    if (weight > 180 && weight <= 220) return "leveling_up";
    return "time_to_lock_in";
  }
  
  // Default case (should never reach here if age validation is done properly)
  return "in_the_zone";
};
