
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { calculateDailyNutrition, calculateWeeklyNutrition, loadUserProfile } from "@/utils/storageService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const dailyNutrition = calculateDailyNutrition(new Date());
  const weeklyData = calculateWeeklyNutrition();

  useEffect(() => {
    // Load user profile
    const savedProfile = loadUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      
      {profile ? (
        <>
          <Dashboard 
            dailyNutrition={dailyNutrition}
            weeklyData={weeklyData}
            calorieGoal={profile.calorieGoal}
          />
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => navigate("/plan")}>
              Update Diet Plan
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Profile Not Set</h3>
          <p className="text-muted-foreground mb-6">
            Please set up your profile to see personalized dashboard and recommendations.
          </p>
          <Button onClick={() => navigate("/plan")}>
            Set Up Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
