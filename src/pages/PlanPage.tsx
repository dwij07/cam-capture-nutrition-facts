
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import DietPlan from "@/components/DietPlan";
import { generateDietPlan, calculateTDEE } from "@/data/enhancedNutritionData";
import ProfileForm from "@/components/ProfileForm";
import { Card } from "@/components/ui/card";
import { loadUserProfile, saveUserProfile } from "@/utils/storageService";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PlanPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user profile on component mount
    const savedProfile = loadUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      
      // Generate diet plan based on profile
      const newDietPlan = generateDietPlan(savedProfile, savedProfile.calorieGoal);
      setDietPlan(newDietPlan);
    }
  }, []);

  const handleSaveProfile = (profileData: any) => {
    // Calculate TDEE based on profile data
    const calorieGoal = calculateTDEE(profileData);
    
    const newProfile = {
      ...profileData,
      calorieGoal
    };
    
    setProfile(newProfile);
    saveUserProfile(newProfile);
    
    // Generate diet plan based on profile
    const newDietPlan = generateDietPlan(profileData, calorieGoal);
    setDietPlan(newDietPlan);
    
    toast({
      title: "Profile Saved",
      description: `Your daily calorie goal is set to ${calorieGoal} calories.`
    });
  };

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
      {dietPlan ? (
        <>
          <DietPlan dietPlan={dietPlan} />
          <div className="mt-8 flex justify-center">
            <Card className="w-full max-w-3xl p-6">
              <h2 className="text-2xl font-semibold mb-6">Update Your Profile</h2>
              <ProfileForm 
                onSaveProfile={handleSaveProfile}
                initialData={profile || {}}
              />
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Set Up Your Diet Plan</h2>
          <ProfileForm 
            onSaveProfile={handleSaveProfile}
            initialData={profile || {}}
          />
        </Card>
      )}
    </div>
  );
};

export default PlanPage;
