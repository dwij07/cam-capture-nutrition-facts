
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedNutritionInfo } from "@/data/enhancedNutritionData";

interface EnhancedNutritionDisplayProps {
  foodName: string;
  confidence: number;
  nutrition: EnhancedNutritionInfo;
  onAddToMealLog?: () => void;
  alternativeOptions?: {
    foodName: string;
    confidence: number;
    onSelect: () => void;
  }[];
}

/**
 * Enhanced component for displaying the nutrition information for a food item
 * Includes more detailed nutrition facts and the option to add to meal log
 */
const EnhancedNutritionDisplay: React.FC<EnhancedNutritionDisplayProps> = ({
  foodName,
  confidence,
  nutrition,
  onAddToMealLog,
  alternativeOptions = [],
}) => {
  // Format percentage
  const confidencePercent = Math.round(confidence * 100);
  
  // Calculate total calories from macros
  const proteinCalories = nutrition.protein * 4;
  const carbsCalories = nutrition.carbs * 4;
  const fatCalories = nutrition.fat * 9;
  const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;
  
  // Calculate percentage of calories from each macro
  const proteinPercent = Math.round((proteinCalories / totalMacroCalories) * 100) || 0;
  const carbsPercent = Math.round((carbsCalories / totalMacroCalories) * 100) || 0;
  const fatPercent = Math.round((fatCalories / totalMacroCalories) * 100) || 0;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">{foodName}</CardTitle>
            <p className="text-sm text-muted-foreground">{nutrition.serving}</p>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant={confidencePercent > 70 ? "default" : "secondary"}>
              {confidencePercent}% confidence
            </Badge>
            {onAddToMealLog && (
              <Button 
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={onAddToMealLog}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add to Meal Log
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
            {alternativeOptions.length > 0 && (
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="summary">
            {/* Calories */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Calories</span>
                <span className="font-bold text-lg">{nutrition.calories}</span>
              </div>
              <Progress value={100} className="h-2 bg-muted" />
            </div>

            {/* Macronutrients */}
            <div className="space-y-4">
              {/* Protein */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Protein</span>
                  <div className="text-right">
                    <span>{nutrition.protein}g</span>
                    <span className="text-xs text-muted-foreground ml-1">({proteinPercent}%)</span>
                  </div>
                </div>
                <div className="bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-nutrition-protein h-full rounded-full"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Carbohydrates</span>
                  <div className="text-right">
                    <span>{nutrition.carbs}g</span>
                    <span className="text-xs text-muted-foreground ml-1">({carbsPercent}%)</span>
                  </div>
                </div>
                <div className="bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-nutrition-carbs h-full rounded-full"
                    style={{ width: `${carbsPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Fiber: {nutrition.fiber}g</span>
                  <span>Sugar: {nutrition.sugar}g</span>
                </div>
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Fat</span>
                  <div className="text-right">
                    <span>{nutrition.fat}g</span>
                    <span className="text-xs text-muted-foreground ml-1">({fatPercent}%)</span>
                  </div>
                </div>
                <div className="bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-nutrition-fat h-full rounded-full"
                    style={{ width: `${fatPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Saturated: {nutrition.saturatedFat}g</span>
                  <span>Trans: {nutrition.transFat}g</span>
                </div>
              </div>
            </div>

            {/* Macronutrient legend */}
            <div className="flex justify-between mt-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-nutrition-protein mr-2"></div>
                <span>Protein</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-nutrition-carbs mr-2"></div>
                <span>Carbs</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-nutrition-fat mr-2"></div>
                <span>Fat</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold mb-2">Macronutrients</h3>
                <div className="flex justify-between">
                  <span>Calories</span>
                  <span>{nutrition.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein</span>
                  <span>{nutrition.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Carbohydrates</span>
                  <span>{nutrition.carbs}g</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span className="text-sm">Fiber</span>
                  <span className="text-sm">{nutrition.fiber}g</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span className="text-sm">Sugar</span>
                  <span className="text-sm">{nutrition.sugar}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fat</span>
                  <span>{nutrition.fat}g</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span className="text-sm">Saturated</span>
                  <span className="text-sm">{nutrition.saturatedFat}g</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span className="text-sm">Trans</span>
                  <span className="text-sm">{nutrition.transFat}g</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold mb-2">Minerals & Vitamins</h3>
                <div className="flex justify-between">
                  <span>Sodium</span>
                  <span>{nutrition.sodium}mg</span>
                </div>
                <div className="flex justify-between">
                  <span>Potassium</span>
                  <span>{nutrition.potassium}mg</span>
                </div>
                <div className="flex justify-between">
                  <span>Cholesterol</span>
                  <span>{nutrition.cholesterol}mg</span>
                </div>
                <div className="flex justify-between">
                  <span>Vitamin A</span>
                  <span>{nutrition.vitaminA}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Vitamin C</span>
                  <span>{nutrition.vitaminC}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Calcium</span>
                  <span>{nutrition.calcium}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Iron</span>
                  <span>{nutrition.iron}%</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {alternativeOptions.length > 0 && (
            <TabsContent value="alternatives">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Not what you're looking for? We also detected these foods in your image:
                </p>
                {alternativeOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 border rounded-md hover:bg-accent cursor-pointer"
                    onClick={option.onSelect}
                  >
                    <div>
                      <div className="font-medium">{option.foodName}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(option.confidence * 100)}% confidence
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Select</Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedNutritionDisplay;
