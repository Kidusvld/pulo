
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import SavedWorkouts from "@/pages/SavedWorkouts";
import WorkoutLogs from "@/pages/WorkoutLogs";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/saved-workouts" element={<SavedWorkouts />} />
        <Route path="/workout-logs" element={<WorkoutLogs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
