
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import NutritionInfo from "./pages/NutritionInfo";
import CameraPage from "./pages/CameraPage";
import TrackerPage from "./pages/TrackerPage";
import DashboardPage from "./pages/DashboardPage";
import PlanPage from "./pages/PlanPage";
import AchievementsPage from "./pages/AchievementsPage";
import AboutPage from "./pages/AboutPage";
import SeasonalFoodsPage from "./pages/SeasonalFoodsPage";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

// Protected route component to handle authentication
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // While checking auth state, return loading
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/info" element={
            <ProtectedRoute>
              <NutritionInfo />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/camera" element={
            <ProtectedRoute>
              <CameraPage />
            </ProtectedRoute>
          } />
          <Route path="/tracker" element={
            <ProtectedRoute>
              <TrackerPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/plan" element={
            <ProtectedRoute>
              <PlanPage />
            </ProtectedRoute>
          } />
          <Route path="/achievements" element={
            <ProtectedRoute>
              <AchievementsPage />
            </ProtectedRoute>
          } />
          <Route path="/seasonal-foods" element={<SeasonalFoodsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
