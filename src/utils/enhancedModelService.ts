
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { enhancedFoodDatabase } from '@/data/enhancedNutritionData';

/**
 * Enhanced service for food recognition with detailed nutrition data
 */

// Define the prediction result interface with matched food
export interface ExtendedPredictionResult {
  className: string;
  probability: number;
  matchedFood?: any; // Will contain the matched food item from our database
}

// Singleton instance of the model
let modelInstance: mobilenet.MobileNet | null = null;

/**
 * Loads the MobileNet model if it hasn't been loaded already
 */
export const loadEnhancedModel = async (): Promise<mobilenet.MobileNet> => {
  try {
    // If model is already loaded, return it
    if (modelInstance) {
      return modelInstance;
    }

    // Show loading status
    console.log('Loading enhanced food recognition model...');
    
    // Wait for TensorFlow.js to be ready
    await tf.ready();
    
    // Load the model
    modelInstance = await mobilenet.load({
      version: 1,
      alpha: 1.0
    });
    
    console.log('Enhanced model loaded successfully');
    return modelInstance;
  } catch (error) {
    console.error('Failed to load enhanced model:', error);
    throw new Error('Failed to load enhanced food recognition model');
  }
};

/**
 * Recognizes food in an image and matches it with our food database
 */
export const recognizeFood = async (
  imageElement: HTMLImageElement
): Promise<ExtendedPredictionResult[]> => {
  try {
    // Make sure the model is loaded
    const model = await loadEnhancedModel();
    
    // Run classification
    console.log('Analyzing food...');
    const rawPredictions = await model.classify(imageElement);
    
    // Map the raw predictions to extended predictions with matched foods
    const extendedPredictions: ExtendedPredictionResult[] = rawPredictions.map(prediction => {
      // Find a matching food in our database
      const normalizedClassName = prediction.className.toLowerCase();
      
      // Try to find a direct match first
      let matchedFood = enhancedFoodDatabase.find(food => 
        food.name.toLowerCase() === normalizedClassName ||
        food.tags.some(tag => normalizedClassName.includes(tag))
      );
      
      // If no direct match, try keywords matching
      if (!matchedFood) {
        const words = normalizedClassName.split(/\s+/);
        for (const word of words) {
          if (word.length < 3) continue; // Skip short words
          
          matchedFood = enhancedFoodDatabase.find(food => 
            food.name.toLowerCase().includes(word) || 
            food.tags.some(tag => tag.includes(word))
          );
          
          if (matchedFood) break;
        }
      }
      
      return {
        ...prediction,
        matchedFood
      };
    });
    
    console.log('Food recognition results:', extendedPredictions);
    return extendedPredictions;
  } catch (error) {
    console.error('Failed to recognize food:', error);
    throw new Error('Failed to analyze the food image');
  }
};

// Types of food the system can analyze
export const foodAnalysisCapabilities = {
  fruits: [
    'Apple', 'Banana', 'Orange', 'Strawberry', 'Blueberry', 'Grape', 'Watermelon',
    'Peach', 'Pear', 'Pineapple', 'Cherry', 'Kiwi', 'Mango', 'Lemon', 'Lime',
    'Raspberry', 'Blackberry', 'Plum', 'Avocado', 'Coconut', 'Pomegranate', 
    'Grapefruit', 'Apricot', 'Fig', 'Guava', 'Papaya', 'Passion Fruit'
  ],
  vegetables: [
    'Carrot', 'Broccoli', 'Spinach', 'Lettuce', 'Tomato', 'Cucumber', 'Onion',
    'Potato', 'Sweet Potato', 'Bell Pepper', 'Cabbage', 'Cauliflower', 'Corn',
    'Mushroom', 'Eggplant', 'Zucchini', 'Asparagus', 'Brussels Sprout', 'Celery',
    'Green Bean', 'Kale', 'Radish', 'Garlic', 'Leek', 'Peas', 'Pumpkin'
  ],
  proteins: [
    'Chicken', 'Beef', 'Pork', 'Fish', 'Shrimp', 'Tofu', 'Eggs', 'Beans',
    'Lentils', 'Chickpeas', 'Turkey', 'Lamb', 'Tuna', 'Salmon', 'Yogurt',
    'Cheese', 'Nuts', 'Seeds', 'Quinoa'
  ],
  grains: [
    'Rice', 'Bread', 'Pasta', 'Oats', 'Cereal', 'Quinoa', 'Barley', 'Corn',
    'Tortilla', 'Bagel', 'Couscous', 'Bulgur', 'Buckwheat', 'Millet', 'Rye'
  ],
  prepared_foods: [
    'Pizza', 'Burger', 'Sandwich', 'Salad', 'Soup', 'Stir Fry', 'Curry',
    'Pasta Dish', 'Taco', 'Burrito', 'Sushi', 'Steak', 'Roast Chicken',
    'Cake', 'Cookie', 'Ice Cream', 'Smoothie', 'Juice', 'Coffee', 'Tea'
  ],
  snacks: [
    'Chips', 'Cookies', 'Crackers', 'Popcorn', 'Pretzels', 'Nuts', 'Granola Bar',
    'Chocolate', 'Candy', 'Trail Mix', 'Dried Fruit', 'Yogurt', 'Cheese stick'
  ]
};

// Pre-load the model when the service is imported
loadEnhancedModel().catch(console.error);
