
import React from "react";
import Header from "@/components/Header";
import DietPlan from "@/components/DietPlan";
import { generateDietPlan } from "@/data/enhancedNutritionData";
import ProfileForm from "@/components/ProfileForm";
import { Card } from "@/components/ui/card";

const PlanPage = () => {
  const [profile, setProfile] = React.useState(null);
  const [dietPlan, setDietPlan] = React.useState(null);

  const handleSaveProfile = (profileData: any) => {
    setProfile(profileData);
    const newDietPlan = generateDietPlan(profileData, profileData.calorieGoal);
    setDietPlan(newDietPlan);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      {dietPlan ? (
        <DietPlan dietPlan={dietPlan} />
      ) : (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Set Up Your Diet Plan</h2>
          <ProfileForm 
            onSaveProfile={handleSaveProfile}
            initialData={{}}
          />
        </Card>
      )}
    </div>
  );
};

export default PlanPage;
