
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface MealEntry {
  id: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
}

interface MealLogProps {
  meals: MealEntry[];
  onAddMeal?: (recognizedFood?: any) => void;
  onEditMeal?: (meal: MealEntry) => void;
  onDeleteMeal?: (id: string) => void;
}

const MealLog: React.FC<MealLogProps> = ({ meals, onAddMeal, onEditMeal, onDeleteMeal }) => {
  // Group meals by meal type
  const groupedMeals = meals.reduce((acc, meal) => {
    if (!acc[meal.mealType]) {
      acc[meal.mealType] = [];
    }
    acc[meal.mealType].push(meal);
    return acc;
  }, {} as Record<string, MealEntry[]>);

  const mealTypeOrder = ['breakfast', 'lunch', 'snack', 'dinner'];
  const mealTypeLabels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snack: 'Snack',
    dinner: 'Dinner'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Today's Meals</CardTitle>
        <Button variant="outline" size="sm" onClick={() => onAddMeal && onAddMeal()}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Meal
        </Button>
      </CardHeader>
      <CardContent>
        {mealTypeOrder
          .filter(mealType => groupedMeals[mealType]?.length > 0)
          .map(mealType => (
            <div key={mealType} className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium">{mealTypeLabels[mealType]}</h3>
                <Badge variant="outline" className="ml-2">
                  {groupedMeals[mealType].reduce((sum, meal) => sum + meal.calories, 0)} kcal
                </Badge>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Food</TableHead>
                    <TableHead className="w-[100px] text-right">Calories</TableHead>
                    <TableHead className="w-[100px] text-right">Protein</TableHead>
                    <TableHead className="w-[100px] text-right">Carbs</TableHead>
                    <TableHead className="w-[100px] text-right">Fat</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedMeals[mealType].map(meal => (
                    <TableRow key={meal.id}>
                      <TableCell className="font-medium">
                        {meal.foodName}
                        <div className="text-xs text-muted-foreground">{meal.servingSize}</div>
                      </TableCell>
                      <TableCell className="text-right">{meal.calories}</TableCell>
                      <TableCell className="text-right">{meal.protein}g</TableCell>
                      <TableCell className="text-right">{meal.carbs}g</TableCell>
                      <TableCell className="text-right">{meal.fat}g</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => onEditMeal && onEditMeal(meal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => onDeleteMeal && onDeleteMeal(meal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
          
        {Object.keys(groupedMeals).length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No meals logged today.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => onAddMeal && onAddMeal()}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add your first meal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealLog;
