
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { NutritionInfo } from "@/data/nutritionData";

interface NutritionDisplayProps {
  foodName: string;
  confidence: number;
  nutrition: NutritionInfo;
}

/**
 * Component for displaying the nutrition information for a food item
 */
const NutritionDisplay: React.FC<NutritionDisplayProps> = ({
  foodName,
  confidence,
  nutrition,
}) => {
  // Format percentage
  const confidencePercent = Math.round(confidence * 100);

  return (
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{foodName}</CardTitle>
          <Badge variant={confidencePercent > 70 ? "default" : "secondary"}>
            {confidencePercent}% confidence
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{nutrition.serving}</p>
      </CardHeader>
      <CardContent>
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
              <span>{nutrition.protein}g</span>
            </div>
            <div className="bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="bg-nutrition-protein h-full rounded-full"
                style={{
                  width: `${(nutrition.protein / (nutrition.protein + nutrition.carbs + nutrition.fat)) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Carbohydrates</span>
              <span>{nutrition.carbs}g</span>
            </div>
            <div className="bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="bg-nutrition-carbs h-full rounded-full"
                style={{
                  width: `${(nutrition.carbs / (nutrition.protein + nutrition.carbs + nutrition.fat)) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Fat</span>
              <span>{nutrition.fat}g</span>
            </div>
            <div className="bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="bg-nutrition-fat h-full rounded-full"
                style={{
                  width: `${(nutrition.fat / (nutrition.protein + nutrition.carbs + nutrition.fat)) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Macronutrient breakdown */}
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
      </CardContent>
    </Card>
  );
};

export default NutritionDisplay;
