
import React from "react";
import Header from "@/components/Header";
import FoodSearch from "@/components/FoodSearch";
import MealLog from "@/components/MealLog";
import { MealEntry } from "@/components/MealLog";
import { addMealToLog, getMealLogForDate } from "@/utils/storageService";

const TrackerPage = () => {
  const [meals, setMeals] = React.useState<MealEntry[]>([]);

  React.useEffect(() => {
    const todaysMeals = getMealLogForDate(new Date());
    setMeals(todaysMeals);
  }, []);

  const handleAddFood = (food: Omit<MealEntry, 'id'>) => {
    addMealToLog(food, new Date());
    const updatedMeals = getMealLogForDate(new Date());
    setMeals(updatedMeals);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      <FoodSearch onAddFood={handleAddFood} />
      <MealLog 
        meals={meals}
        onDeleteMeal={() => {}}
        onAddMeal={() => {}}
      />
    </div>
  );
};

export default TrackerPage;
