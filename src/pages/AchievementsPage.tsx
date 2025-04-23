
import React from "react";
import Header from "@/components/Header";
import GamificationFeatures from "@/components/GamificationFeatures";
import { getAchievements, getStreakDays } from "@/utils/gamificationService";

const AchievementsPage = () => {
  const streakDays = getStreakDays();
  const achievements = getAchievements();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      <GamificationFeatures 
        streakDays={streakDays}
        achievements={achievements}
      />
    </div>
  );
};

export default AchievementsPage;
