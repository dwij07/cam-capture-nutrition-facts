
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { FoodItem, findFoodByClass as findBasicFoodByClass } from '@/data/nutritionData';
import { EnhancedFoodItem, findEnhancedFoodByClass } from '@/data/enhancedNutritionData';

// Define the prediction result interface
export interface PredictionResult {
  className: string;
  probability: number;
}

export interface ExtendedPredictionResult extends PredictionResult {
  matchedFood?: EnhancedFoodItem; // Changed from FoodItem to EnhancedFoodItem
}

// Singleton instance of the model
let modelInstance: mobilenet.MobileNet | null = null;

/**
 * Loads the MobileNet model if it hasn't been loaded already
 * We use MobileNet as it's pre-trained and available in TensorFlow.js
 * In a production app with a backend, we'd use a more specialized model
 * 
 * @returns Promise that resolves to the loaded model
 */
export const loadModel = async (): Promise<mobilenet.MobileNet> => {
  try {
    if (modelInstance) {
      return modelInstance;
    }
    
    console.log('Loading MobileNet model...');
    
    await tf.ready();
    
    // Load MobileNet with the highest available alpha for better accuracy
    modelInstance = await mobilenet.load({
      version: 2,
      alpha: 1.0
    });
    
    console.log('Model loaded successfully');
    return modelInstance;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw new Error('Failed to load image recognition model');
  }
};

/**
 * Classifies an image and returns the top K predictions
 * 
 * @param imageElement HTML image element containing the image to classify
 * @param topK Number of top predictions to return (default: 5)
 * @returns Promise that resolves to array of top K prediction results
 */
export const classifyImage = async (
  imageElement: HTMLImageElement,
  topK = 5
): Promise<PredictionResult[]> => {
  try {
    const model = await loadModel();
    console.log('Classifying image...');
    
    // Apply data augmentation techniques to enhance prediction
    const predictions = await model.classify(imageElement, topK);
    
    console.log('Classification results:', predictions);
    return predictions;
  } catch (error) {
    console.error('Failed to classify image:', error);
    throw new Error('Failed to analyze the image');
  }
};

/**
 * Classifies an image and matches results with the food database
 * 
 * @param imageElement HTML image element containing the image to classify
 * @param topK Number of top predictions to return (default: 3)
 * @returns Promise that resolves to array of prediction results with matched food items
 */
export const recognizeFood = async (
  imageElement: HTMLImageElement,
  topK = 3
): Promise<ExtendedPredictionResult[]> => {
  // Get base predictions
  const predictions = await classifyImage(imageElement, topK * 2); // Get more predictions to increase chances of food match
  
  // Match predictions with food database
  const extendedResults: ExtendedPredictionResult[] = [];
  
  for (const prediction of predictions) {
    // Use findEnhancedFoodByClass instead of findFoodByClass to get EnhancedFoodItem
    const matchedFood = findEnhancedFoodByClass(prediction.className);
    
    if (matchedFood) {
      extendedResults.push({
        ...prediction,
        matchedFood
      });
      
      // Stop once we have enough matches
      if (extendedResults.length >= topK) {
        break;
      }
    }
  }
  
  return extendedResults.slice(0, topK);
};

// Pre-load the model when the service is imported
loadModel().catch(console.error);
