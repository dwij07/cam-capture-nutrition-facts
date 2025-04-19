
import React, { useState } from "react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import NutritionDisplay from "@/components/NutritionDisplay";
import { classifyImage, PredictionResult } from "@/utils/modelService";
import { findFoodByClass, FoodItem } from "@/data/nutritionData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Index = () => {
  // State for storing the recognized food and processing status
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognizedFood, setRecognizedFood] = useState<{
    food: FoodItem;
    confidence: number;
  } | null>(null);

  // Handle image selection from the ImageUpload component
  const handleImageSelected = async (imageElement: HTMLImageElement) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Classify the image using the model
      const predictions = await classifyImage(imageElement);
      
      if (predictions && predictions.length > 0) {
        // Find food match from our nutrition data
        for (const prediction of predictions) {
          const matchedFood = findFoodByClass(prediction.className);
          
          if (matchedFood) {
            setRecognizedFood({
              food: matchedFood,
              confidence: prediction.probability
            });
            setIsProcessing(false);
            return;
          }
        }
        
        // If we get here, no matching food was found
        setError("Food item not recognized. Please try another image.");
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Header />
      
      <div className="mt-10">
        <ImageUpload 
          onImageSelected={handleImageSelected}
          isProcessing={isProcessing}
        />
        
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
        
        {!isProcessing && !error && recognizedFood && (
          <NutritionDisplay 
            foodName={recognizedFood.food.name}
            confidence={recognizedFood.confidence}
            nutrition={recognizedFood.food.nutritionPer100g}
          />
        )}
        
        <div className="mt-10 text-sm text-center text-muted-foreground">
          <p>This application uses on-device machine learning with TensorFlow.js.</p>
          <p>No images are sent to any server - all processing happens directly in your browser.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
