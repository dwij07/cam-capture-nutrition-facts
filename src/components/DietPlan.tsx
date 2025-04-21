
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
                        No {dietType} options available for this meal.
                      </div>
                    )}
                    
                    {/* Suggested alternatives section */}
                    {filteredFoods.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Alternative suggestions:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {mealType === "breakfast" && dietType === "all" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Greek yogurt with honey and granola</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Quinoa breakfast bowl with fruits</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Protein pancakes with berries</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Avocado toast with poached eggs</div>
                            </>
                          )}
                          {mealType === "breakfast" && dietType === "vegetarian" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Oatmeal with almond milk and berries</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Vegetable omelet with spinach and tomatoes</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Peanut butter banana smoothie bowl</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Chia seed pudding with mango</div>
                            </>
                          )}
                          {mealType === "breakfast" && dietType === "non-vegetarian" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Bacon and eggs with toast</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Smoked salmon bagel with cream cheese</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Turkey and cheese breakfast burrito</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Ham and cheese omelet</div>
                            </>
                          )}
                          {mealType === "lunch" && dietType === "all" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Mediterranean salad with grilled chicken</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Tuna wrap with mixed greens</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Lentil soup with whole grain bread</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Quinoa bowl with roasted vegetables</div>
                            </>
                          )}
                          {mealType === "lunch" && dietType === "vegetarian" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Chickpea salad with tahini dressing</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Vegetable stir-fry with tofu</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Caprese sandwich with pesto</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Sweet potato and black bean bowl</div>
                            </>
                          )}
                          {mealType === "lunch" && dietType === "non-vegetarian" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Chicken Caesar salad wrap</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Tuna nicoise salad</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Turkey club sandwich</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Beef and vegetable stir-fry</div>
                            </>
                          )}
                          {mealType === "dinner" && dietType === "all" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Grilled salmon with asparagus</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Chicken stir-fry with brown rice</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Vegetable lasagna with side salad</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Stuffed bell peppers with quinoa</div>
                            </>
                          )}
                          {mealType === "dinner" && dietType === "vegetarian" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Eggplant parmesan with whole grain pasta</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Lentil and vegetable curry with rice</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Stuffed portobello mushrooms</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Vegetable and bean enchiladas</div>
                            </>
                          )}
                          {mealType === "dinner" && dietType === "non-vegetarian" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Grilled steak with roasted potatoes</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Baked chicken with sweet potato</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Shrimp scampi with zucchini noodles</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Pork chops with apple and cabbage</div>
                            </>
                          )}
                          {mealType === "snacks" && dietType === "all" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Apple with almond butter</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Greek yogurt with berries</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Hummus with vegetable sticks</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Trail mix with nuts and dried fruit</div>
                            </>
                          )}
                          {mealType === "snacks" && dietType === "vegetarian" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Edamame with sea salt</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Avocado toast bites</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Energy balls with dates and nuts</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Fruit and nut yogurt parfait</div>
                            </>
                          )}
                          {mealType === "snacks" && dietType === "non-vegetarian" && (
                            <>
                              <div className="text-xs p-2 bg-muted rounded-md">Turkey and cheese roll-ups</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Hard-boiled eggs with salt</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Beef jerky</div>
                              <div className="text-xs p-2 bg-muted rounded-md">Tuna on cucumber rounds</div>
                            </>
                          )}
                        </div>
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
