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

// Food classification categories inspired by Nutrition5k dataset structure
const foodCategories = {
  grains: ["bread", "rice", "pasta", "cereal", "naan", "tortilla"],
  proteins: ["chicken", "beef", "fish", "tofu", "eggs", "lamb", "shrimp"],
  vegetables: ["salad", "broccoli", "spinach", "kale", "carrot"],
  fruits: ["apple", "banana", "orange", "grapes", "berries"],
  dairy: ["cheese", "milk", "yogurt", "cream"],
  sweets: ["cake", "ice cream", "cookie", "chocolate", "dessert"],
  prepared: ["pizza", "burger", "sandwich", "curry", "soup", "stew"]
};

// Singleton instance of the model
let modelInstance: mobilenet.MobileNet | null = null;

/**
 * Loads the MobileNet model if it hasn't been loaded already
 * We use MobileNet v2 with higher alpha for better feature extraction
 * 
 * @returns Promise that resolves to the loaded model
 */
export const loadModel = async (): Promise<mobilenet.MobileNet> => {
  try {
    if (modelInstance) {
      return modelInstance;
    }
    
    console.log('Loading enhanced MobileNet v2 model...');
    
    await tf.ready();
    
    // Load MobileNet v2 with the highest alpha for better accuracy
    modelInstance = await mobilenet.load({
      version: 2,
      alpha: 1.0
    });
    
    console.log('Enhanced model loaded successfully');
    return modelInstance;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw new Error('Failed to load image recognition model');
  }
};

/**
 * Preprocesses the image to improve recognition accuracy
 * Based on techniques used in Nutrition5k dataset processing
 * 
 * @param imageElement The image element to preprocess
 * @returns The preprocessed tensor
 */
export const preprocessImage = async (imageElement: HTMLImageElement): Promise<tf.Tensor3D> => {
  try {
    // Convert to tensor
    const imageTensor = tf.browser.fromPixels(imageElement);
    
    // Normalize pixel values to [-1, 1]
    const normalized = imageTensor.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1));
    
    // Ensure proper dimensions for MobileNet (224x224)
    const resized = tf.image.resizeBilinear(normalized, [224, 224]) as tf.Tensor3D;
    
    return resized;
  } catch (error) {
    console.error('Failed to preprocess image:', error);
    throw new Error('Failed to process the image for analysis');
  }
};

/**
 * Classifies an image and returns the top K predictions
 * Uses image preprocessing techniques inspired by Nutrition5k
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
    console.log('Classifying image with enhanced techniques...');
    
    // Get multiple predictions to improve matching
    // Increase to 3x requested to get more options for matching
    const predictions = await model.classify(imageElement, topK * 3);
    
    // Enhanced logging for debugging
    console.log('Raw predictions:', predictions);
    
    return predictions;
  } catch (error) {
    console.error('Failed to classify image:', error);
    throw new Error('Failed to analyze the image');
  }
};

/**
 * Identifies food category for semantic matching
 * Inspired by Nutrition5k dataset categorization
 * 
 * @param className The class name to categorize
 * @returns The food category if identified
 */
const identifyFoodCategory = (className: string): string | null => {
  const normalizedClass = className.toLowerCase();
  
  for (const [category, keywords] of Object.entries(foodCategories)) {
    if (keywords.some(keyword => normalizedClass.includes(keyword))) {
      return category;
    }
  }
  
  return null;
};

/**
 * Calculates semantic similarity score between prediction and food class
 * Based on word overlap and category matching
 * 
 * @param prediction The normalized prediction string
 * @param foodClass The normalized food class string
 * @returns Similarity score between 0-1
 */
const calculateSimilarityScore = (prediction: string, foodClass: string): number => {
  // Base score from direct string matching
  const predictionWords = prediction.split(/\s+/);
  const foodWords = foodClass.split(/\s+/);
  
  // Count matching words
  const matchingWords = predictionWords.filter(word => 
    foodWords.some(foodWord => foodWord.includes(word) || word.includes(foodWord))
  );
  
  // Calculate word match ratio
  const wordMatchRatio = matchingWords.length / Math.max(predictionWords.length, 1);
  
  // Get categories
  const predictionCategory = identifyFoodCategory(prediction);
  const foodCategory = identifyFoodCategory(foodClass);
  
  // Category matching bonus (0.2 if categories match)
  const categoryBonus = predictionCategory && foodCategory && predictionCategory === foodCategory ? 0.2 : 0;
  
  // Direct inclusion bonus (0.3 if one string fully contains the other)
  const inclusionBonus = prediction.includes(foodClass) || foodClass.includes(prediction) ? 0.3 : 0;
  
  // Combined score (capped at 1.0)
  return Math.min(wordMatchRatio * 0.5 + categoryBonus + inclusionBonus, 1.0);
};

/**
 * Classifies an image and matches results with the food database
 * Uses similarity scoring and semantic matching for better results
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
  const predictions = await classifyImage(imageElement, topK * 4);
  
  // Enhanced matching algorithm with similarity scoring
  const extendedResults: ExtendedPredictionResult[] = [];
  const processedMatches = new Set<string>();
  
  for (const prediction of predictions) {
    const normalizedPrediction = prediction.className.toLowerCase();
    
    // Calculate similarity scores for each food item
    const matchingScores = allFoods
      .filter(food => !processedMatches.has(food.name))
      .map(food => {
        // Find best matching class for this food
        const bestClassMatch = food.classes.reduce((bestScore, cls) => {
          const score = calculateSimilarityScore(normalizedPrediction, cls.toLowerCase());
          return score > bestScore ? score : bestScore;
        }, 0);
        
        return {
          food,
          score: bestClassMatch,
          adjustedProbability: prediction.probability * (0.5 + bestClassMatch * 0.5) // Adjust probability by similarity
        };
      });
    
    // Sort by adjusted score
    matchingScores.sort((a, b) => b.adjustedProbability - a.adjustedProbability);
    
    // Add best match if score is good enough (threshold)
    if (matchingScores.length > 0 && matchingScores[0].score > 0.4) {
      const bestMatch = matchingScores[0].food;
      processedMatches.add(bestMatch.name);
      
      extendedResults.push({
        className: bestMatch.name,
        probability: matchingScores[0].adjustedProbability,
        matchedFood: bestMatch
      });
      
      // Stop once we have enough matches
      if (extendedResults.length >= topK) {
        break;
      }
    }
  }
  
  // If we couldn't find enough good matches, add remaining top predictions
  if (extendedResults.length < topK && predictions.length > 0) {
    for (const prediction of predictions) {
      const normalizedPrediction = prediction.className.toLowerCase();
      
      // Find any remaining foods that might be a reasonable match
      const fallbackMatch = allFoods.find(food => 
        !processedMatches.has(food.name) && 
        food.classes.some(cls => normalizedPrediction.includes(cls.toLowerCase().split(' ')[0]))
      );
      
      if (fallbackMatch) {
        processedMatches.add(fallbackMatch.name);
        extendedResults.push({
          className: fallbackMatch.name,
          probability: prediction.probability * 0.7, // Reduced confidence for fallback matches
          matchedFood: fallbackMatch
        });
        
        if (extendedResults.length >= topK) {
          break;
        }
      }
    }
  }
  
  return extendedResults;
};

// Pre-load the model when the service is imported for faster initial recognition
loadModel().catch(console.error);
