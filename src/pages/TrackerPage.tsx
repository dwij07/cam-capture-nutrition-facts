
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FoodSearch from "@/components/FoodSearch";
import MealLog from "@/components/MealLog";
import { MealEntry } from "@/components/MealLog";
import { Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  addMealToLog, 
  getMealLogForDate, 
  deleteMealFromLog
} from "@/utils/storageService";
import { updateStreak } from "@/utils/gamificationService";
import { toast } from "@/hooks/use-toast";

const TrackerPage = () => {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    refreshMeals();
  }, [selectedDate]);

  const refreshMeals = () => {
    const todaysMeals = getMealLogForDate(selectedDate);
    setMeals(todaysMeals);
  };

  const handleAddFood = (food: Omit<MealEntry, 'id'>) => {
    addMealToLog(food, selectedDate);
    // Update streak when a meal is added
    const currentStreak = updateStreak();
    refreshMeals();
    
    toast({
      title: "Meal Added",
      description: `${food.foodName} added to your ${food.mealType}.`
    });
  };

  const handleDeleteMeal = (id: string) => {
    deleteMealFromLog(id, selectedDate);
    refreshMeals();
    toast({
      title: "Meal Deleted",
      description: "The meal has been removed from your log."
    });
  };

  const goToCamera = () => {
    navigate('/camera');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <Header />
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="hover:bg-purple-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <FoodSearch onAddFood={handleAddFood} />
        
        <MealLog 
          meals={meals} 
          onDeleteMeal={handleDeleteMeal}
          onAddMeal={goToCamera}
        />
        
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            onClick={goToCamera}
            className="bg-white hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            Add Food with Camera
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackerPage;
