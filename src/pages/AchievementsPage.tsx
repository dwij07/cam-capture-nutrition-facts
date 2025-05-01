
import React from "react";
import Header from "@/components/Header";
import GamificationFeatures from "@/components/GamificationFeatures";
import { getAchievements, getStreakDays } from "@/utils/gamificationService";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AchievementsPage = () => {
  const streakDays = getStreakDays();
  const achievements = getAchievements();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/info")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
      <Header />
      <GamificationFeatures 
        streakDays={streakDays}
        achievements={achievements}
      />
    </div>
  );
};

export default AchievementsPage;
