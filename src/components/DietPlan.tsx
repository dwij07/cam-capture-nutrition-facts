
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Beef } from "lucide-react";

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
      isVegetarian: boolean;
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
      isVegetarian: boolean;
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
      isVegetarian: boolean;
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
      isVegetarian: boolean;
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
  const [dietType, setDietType] = useState<"all" | "vegetarian" | "non-vegetarian">("all");

  // Filter foods based on diet type
  const filterFoods = (foods: any[]) => {
    if (dietType === "all") return foods;
    if (dietType === "vegetarian") return foods.filter(food => food.isVegetarian);
    return foods.filter(food => !food.isVegetarian);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>{dietPlan.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={dietType === "all" ? "default" : "outline"}
              onClick={() => setDietType("all")}
            >
              All
            </Button>
            <Button 
              size="sm" 
              variant={dietType === "vegetarian" ? "default" : "outline"}
              className="text-green-600"
              onClick={() => setDietType("vegetarian")}
            >
              <Leaf className="mr-1 h-4 w-4" /> Vegetarian
            </Button>
            <Button 
              size="sm" 
              variant={dietType === "non-vegetarian" ? "default" : "outline"}
              className="text-red-600"
              onClick={() => setDietType("non-vegetarian")}
            >
              <Beef className="mr-1 h-4 w-4" /> Non-Veg
            </Button>
          </div>
        </div>
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
          <TabsList className="mb-4 flex flex-wrap">
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
                const filteredFoods = filterFoods(meal.foods);
                
                return (
                  <div key={mealType} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium capitalize">{mealType}</h3>
                      <span className="text-sm text-muted-foreground">{meal.totalCalories} kcal</span>
                    </div>
                    
                    {filteredFoods.length > 0 ? (
                      filteredFoods.map((food, foodIndex) => (
                        <div key={foodIndex} className="border-b py-2 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{food.name}</span>
                                {food.isVegetarian && (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    <Leaf className="h-3 w-3 mr-1" /> Veg
                                  </Badge>
                                )}
                                {!food.isVegetarian && (
                                  <Badge variant="outline" className="text-red-600 border-red-600">
                                    <Beef className="h-3 w-3 mr-1" /> Non-Veg
                                  </Badge>
                                )}
                              </div>
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
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No {dietType} options available for this meal. Try selecting a different diet type.
                      </div>
                    )}
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
