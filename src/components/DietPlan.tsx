
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface MealPlan {
  breakfast: {
    name: string;
    foods: {
      name: string;
      portion: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }[];
    totalCalories: number;
  };
  lunch: {
    name: string;
    foods: {
      name: string;
      portion: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }[];
    totalCalories: number;
  };
  dinner: {
    name: string;
    foods: {
      name: string;
      portion: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }[];
    totalCalories: number;
  };
  snacks: {
    name: string;
    foods: {
      name: string;
      portion: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }[];
    totalCalories: number;
  };
}

export interface DietPlanInfo {
  id: string;
  name: string;
  description: string;
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  days: MealPlan[];
}

interface DietPlanProps {
  dietPlan: DietPlanInfo;
}

const DietPlan: React.FC<DietPlanProps> = ({ dietPlan }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dietPlan.name}</CardTitle>
        <p className="text-muted-foreground">{dietPlan.description}</p>
        <div className="flex items-center gap-4 mt-2">
          <div>
            <span className="text-lg font-bold">{dietPlan.totalCalories}</span>
            <span className="text-sm text-muted-foreground"> kcal/day</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{dietPlan.macros.protein}g</span>
            <span className="text-muted-foreground"> protein</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{dietPlan.macros.carbs}g</span>
            <span className="text-muted-foreground"> carbs</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{dietPlan.macros.fat}g</span>
            <span className="text-muted-foreground"> fat</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="day-1">
          <TabsList className="mb-4">
            {dietPlan.days.map((_, index) => (
              <TabsTrigger key={index} value={`day-${index + 1}`}>
                Day {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {dietPlan.days.map((day, index) => (
            <TabsContent key={index} value={`day-${index + 1}`}>
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
                const meal = day[mealType as keyof MealPlan];
                return (
                  <div key={mealType} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium capitalize">{mealType}</h3>
                      <span className="text-sm text-muted-foreground">{meal.totalCalories} kcal</span>
                    </div>
                    
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="border-b py-2 last:border-b-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{food.name}</div>
                            <div className="text-sm text-muted-foreground">{food.portion}</div>
                          </div>
                          <div className="text-right">
                            <div>{food.calories} kcal</div>
                            <div className="text-xs text-muted-foreground">
                              P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DietPlan;
