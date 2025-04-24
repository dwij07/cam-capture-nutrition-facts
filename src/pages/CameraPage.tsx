
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CameraCapture from "@/components/CameraCapture";
import ImageUpload from "@/components/ImageUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { recognizeFood, ExtendedPredictionResult } from "@/utils/enhancedModelService";
import { EnhancedFoodItem } from "@/data/enhancedNutritionData";
import { toast } from "@/hooks/use-toast";

const CameraPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageSelected = async (imageElement: HTMLImageElement) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Classify the image using the enhanced model
      const predictions = await recognizeFood(imageElement);
      
      if (predictions && predictions.length > 0) {
        // Find the top prediction with a matched food
        const topMatch = predictions.find(p => p.matchedFood);
        
        if (topMatch?.matchedFood) {
          // Get alternatives excluding the top match
          const alternatives = predictions
            .filter(p => p.matchedFood && p.matchedFood.name !== topMatch.matchedFood.name);
          
          // Store the recognized food in sessionStorage to access it on the info page
          sessionStorage.setItem('recognizedFood', JSON.stringify({
            food: topMatch.matchedFood,
            confidence: topMatch.probability,
            alternatives
          }));
          
          // Navigate to nutrition info page
          navigate('/info');
          
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      
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
    </div>
  );
};

export default CameraPage;
