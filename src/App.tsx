
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import Onboarding from "@/pages/Onboarding";
import SavedWorkouts from "@/pages/SavedWorkouts";
import WorkoutLogs from "@/pages/WorkoutLogs";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/saved-workouts" element={<SavedWorkouts />} />
        <Route path="/workout-logs" element={<WorkoutLogs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </Router>
  );
}

export default App;
