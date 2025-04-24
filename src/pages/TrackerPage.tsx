
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FoodSearch from "@/components/FoodSearch";
import MealLog from "@/components/MealLog";
import { MealEntry } from "@/components/MealLog";
import { Camera } from "lucide-react";
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
      description: `${food.foodName} added to your meal log.`
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
    navigate("/camera");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      <FoodSearch onAddFood={handleAddFood} />
      
      <MealLog 
        meals={meals} 
        onDeleteMeal={handleDeleteMeal}
        onAddMeal={goToCamera}
      />
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={goToCamera}>
          <Camera className="h-4 w-4 mr-2" />
          Add Food with Camera
        </Button>
      </div>
    </div>
  );
};

export default TrackerPage;
