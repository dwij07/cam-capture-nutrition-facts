import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { EnhancedFoodItem } from '@/data/enhancedNutritionData';
import { indianFoods, chineseFoods, americanFoods } from '@/data/cuisineData';

// Define the prediction result interface
export interface PredictionResult {
  className: string;
  probability: number;
}

export interface ExtendedPredictionResult extends PredictionResult {
  matchedFood?: EnhancedFoodItem;
}

// Combine all food data
const allFoods: EnhancedFoodItem[] = [
  ...indianFoods,
  ...chineseFoods,
  ...americanFoods
];

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
    
    // Get multiple predictions to improve matching
    const predictions = await model.classify(imageElement, topK * 2);
    
    // Enhanced logging for debugging
    console.log('Raw predictions:', predictions);
    
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
  // Get more base predictions to increase matching accuracy
  const predictions = await classifyImage(imageElement, topK * 3);
  
  // Enhanced matching algorithm
  const extendedResults: ExtendedPredictionResult[] = [];
  const processedMatches = new Set<string>();
  
  for (const prediction of predictions) {
    const normalizedPrediction = prediction.className.toLowerCase();
    
    // Find matching foods using more sophisticated matching
    const matchingFoods = allFoods.filter(food => {
      if (processedMatches.has(food.name)) return false;
      
      return food.classes.some(cls => {
        const normalizedClass = cls.toLowerCase();
        return normalizedClass.includes(normalizedPrediction) ||
               normalizedPrediction.includes(normalizedClass);
      });
    });
    
    // Sort matches by relevance
    matchingFoods.sort((a, b) => {
      const aMatch = a.classes.find(cls => 
        cls.toLowerCase().includes(normalizedPrediction)
      ) || '';
      const bMatch = b.classes.find(cls => 
        cls.toLowerCase().includes(normalizedPrediction)
      ) || '';
      
      return bMatch.length - aMatch.length;
    });
    
    // Add best match if found
    if (matchingFoods.length > 0) {
      const bestMatch = matchingFoods[0];
      processedMatches.add(bestMatch.name);
      
      extendedResults.push({
        className: bestMatch.name,
        probability: prediction.probability,
        matchedFood: bestMatch
      });
      
      // Stop once we have enough matches
      if (extendedResults.length >= topK) {
        break;
      }
    }
  }
  
  return extendedResults;
};

// Pre-load the model when the service is imported
loadModel().catch(console.error);
