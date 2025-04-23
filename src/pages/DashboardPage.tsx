
import React from "react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import { calculateDailyNutrition, calculateWeeklyNutrition } from "@/utils/storageService";

const DashboardPage = () => {
  const dailyNutrition = calculateDailyNutrition(new Date());
  const weeklyData = calculateWeeklyNutrition();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      <Dashboard 
        dailyNutrition={dailyNutrition}
        weeklyData={weeklyData}
        calorieGoal={2000}
      />
    </div>
  );
};

export default DashboardPage;
