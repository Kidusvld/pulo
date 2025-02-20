import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { age, weight, fitnessGoal, workoutLocation, equipment, intensityLevel, numberOfDays } = await req.json();

    // Define exercise lists based on fitness goal, workout location, equipment, and intensity level
    const buildMuscleExercises = [
      'Bench Press', 'Squats', 'Deadlifts', 'Overhead Press', 'Barbell Rows',
      'Pull-ups', 'Dips', 'Bicep Curls', 'Tricep Extensions', 'Lunges',
      'Calf Raises', 'Plank', 'Russian Twists', 'Leg Press', 'Lat Pulldowns'
    ];

    const loseFatExercises = [
      'Running', 'Cycling', 'Swimming', 'HIIT Workouts', 'Jumping Jacks',
      'Burpees', 'Mountain Climbers', 'Battle Ropes', 'Kettlebell Swings',
      'Elliptical Training', 'Stair Climbing', 'Rowing', 'Jump Rope', 'Dancing'
    ];

    const increaseMobilityExercises = [
      'Yoga', 'Pilates', 'Foam Rolling', 'Dynamic Stretching', 'Static Stretching',
      'Tai Chi', 'Bodyweight Exercises', 'Balance Training', 'Flexibility Drills'
    ];

    const homeEquipmentExercises = [
      'Push-ups', 'Squats', 'Lunges', 'Plank', 'Crunches', 'Dumbbell Rows',
      'Dumbbell Bench Press', 'Dumbbell Shoulder Press', 'Bicep Curls',
      'Tricep Extensions', 'Calf Raises', 'Glute Bridges', 'Bird Dog Exercise'
    ];

    const gymEquipmentExercises = [
      'Bench Press', 'Squats', 'Deadlifts', 'Leg Press', 'Lat Pulldowns',
      'Cable Rows', 'Overhead Press', 'Bicep Curls', 'Tricep Pushdowns',
      'Leg Extensions', 'Hamstring Curls', 'Calf Raises', 'Pull-ups', 'Dips'
    ];

    const beginnerExercises = [
      'Walking', 'Light Jogging', 'Bodyweight Squats', 'Push-ups (on knees)',
      'Plank (modified)', 'Dumbbell Rows (light weight)', 'Bicep Curls (light weight)',
      'Overhead Press (light weight)', 'Calf Raises', 'Crunches'
    ];

    const intermediateExercises = [
      'Running', 'Cycling', 'Bodyweight Squats', 'Push-ups', 'Plank',
      'Dumbbell Rows', 'Bicep Curls', 'Overhead Press', 'Lunges', 'Deadlifts (light weight)'
    ];

    const advancedExercises = [
      'Sprinting', 'Hill Sprints', 'Barbell Squats', 'Push-ups (variations)',
      'Plank (variations)', 'Pull-ups', 'Dips', 'Deadlifts', 'Olympic Lifts', 'Muscle Ups'
    ];

    const mobilityExercises = [
      'Cat-Cow Stretch',
      'World\'s Greatest Stretch',
      'Hip Opener Series',
      'Joint Mobility'
    ];

    // Filter exercises based on criteria
    let selectedExercises = [];

    if (fitnessGoal === 'build_muscle') {
      selectedExercises = buildMuscleExercises;
    } else if (fitnessGoal === 'lose_fat') {
      selectedExercises = loseFatExercises;
    } else if (fitnessGoal === 'increase_mobility') {
      selectedExercises = increaseMobilityExercises;
    }

    if (workoutLocation === 'home') {
      selectedExercises = selectedExercises.filter(exercise => homeEquipmentExercises.includes(exercise));
    } else if (workoutLocation === 'gym') {
      selectedExercises = selectedExercises.filter(exercise => gymEquipmentExercises.includes(exercise));
    }

    if (intensityLevel === 'beginner') {
      selectedExercises = selectedExercises.filter(exercise => beginnerExercises.includes(exercise));
    } else if (intensityLevel === 'intermediate') {
      selectedExercises = selectedExercises.filter(exercise => intermediateExercises.includes(exercise));
    } else if (intensityLevel === 'advanced') {
      selectedExercises = selectedExercises.filter(exercise => advancedExercises.includes(exercise));
    }

    // Generate workout plan
    const workoutPlan = [];
    for (let i = 1; i <= numberOfDays; i++) {
      const dayExercises = [];
      const numberOfExercises = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5

      for (let j = 0; j < numberOfExercises; j++) {
        const exerciseIndex = Math.floor(Math.random() * selectedExercises.length);
        const exerciseName = selectedExercises[exerciseIndex];
        dayExercises.push({
          name: exerciseName,
          sets: Math.floor(Math.random() * 2) + 3, // Random number between 3 and 4
          reps: Math.floor(Math.random() * 8) + 8, // Random number between 8 and 15
          rest: Math.floor(Math.random() * 60) + 60 // Random number between 60 and 120 seconds
        });
      }

      workoutPlan.push({
        day: i,
        exercises: dayExercises
      });
    }

    // Return workout plan
    return new Response(
      JSON.stringify({ workouts: workoutPlan }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
