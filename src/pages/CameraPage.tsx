
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CameraCapture from "@/components/CameraCapture";
import ImageUpload from "@/components/ImageUpload";
import EnhancedNutritionDisplay from "@/components/EnhancedNutritionDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recognizeFood, ExtendedPredictionResult } from "@/utils/enhancedModelService";
import { EnhancedFoodItem } from "@/data/enhancedNutritionData";
import { toast } from "@/hooks/use-toast";
import { MealEntry } from "@/components/MealLog";
import { addMealToLog } from "@/utils/storageService";

const CameraPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognizedFood, setRecognizedFood] = useState<{
    food: EnhancedFoodItem;
    confidence: number;
  } | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  
  const navigate = useNavigate();

  const handleImageSelected = async (imageElement: HTMLImageElement) => {
    setIsProcessing(true);
    setError(null);
    setRecognizedFood(null);
    
    try {
      // Classify the image using the enhanced model
      const predictions = await recognizeFood(imageElement);
      
      if (predictions && predictions.length > 0) {
        // Find the top prediction with a matched food
        const topMatch = predictions.find(p => p.matchedFood);
        
        if (topMatch?.matchedFood) {
          // Set the recognized food directly on this page
          setRecognizedFood({
            food: topMatch.matchedFood,
            confidence: topMatch.probability
          });
          
          toast({
            title: "Food recognized",
            description: `Detected: ${topMatch.matchedFood.name} with ${Math.round(topMatch.probability * 100)}% confidence`
          });
        } else {
          setError("No matching food found. Please try another image.");
        }
      } else {
        setError("No predictions returned. Please try again with a clearer image.");
      }
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToMealLog = () => {
    if (recognizedFood && recognizedFood.food) {
      const newMeal: Omit<MealEntry, 'id'> = {
        foodName: recognizedFood.food.name,
        calories: recognizedFood.food.nutritionPer100g.calories,
        protein: recognizedFood.food.nutritionPer100g.protein,
        carbs: recognizedFood.food.nutritionPer100g.carbs,
        fat: recognizedFood.food.nutritionPer100g.fat,
        servingSize: recognizedFood.food.nutritionPer100g.serving,
        mealType: selectedMealType,
        timestamp: new Date().toISOString()
      };
      
      addMealToLog(newMeal, new Date());
      toast({
        title: "Added to meal log",
        description: `${recognizedFood.food.name} added to your ${selectedMealType}`
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <Header />
      
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-purple-100 dark:hover:bg-gray-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Upload Photo</h2>
            <ImageUpload 
              onImageSelected={handleImageSelected}
              isProcessing={isProcessing}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Take Photo</h2>
            <CameraCapture 
              onCapture={handleImageSelected}
              isProcessing={isProcessing}
            />
          </CardContent>
        </Card>
      </div>
      
      {isProcessing && (
        <div className="flex justify-center items-center mt-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-primary font-medium">
            Analyzing image...
          </span>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {recognizedFood && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-4 text-primary">Results</h2>
          <div className="mb-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Add to meal log as:</h3>
              <div className="grid grid-cols-4 gap-2">
                {["breakfast", "lunch", "dinner", "snack"].map((mealType) => (
                  <Button 
                    key={mealType}
                    variant={selectedMealType === mealType ? "default" : "outline"}
                    onClick={() => setSelectedMealType(mealType as "breakfast" | "lunch" | "dinner" | "snack")}
                    className="capitalize"
                  >
                    {mealType}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
          <EnhancedNutritionDisplay 
            foodName={recognizedFood.food.name}
            confidence={recognizedFood.confidence}
            nutrition={recognizedFood.food.nutritionPer100g}
            onAddToMealLog={handleAddToMealLog}
          />
        </div>
      )}
    </div>
  );
};

export default CameraPage;
