
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

/**
 * Service for loading and using the MobileNet model for food recognition
 * We're using MobileNet because it's pre-trained and can recognize many common food items
 * In a production app, we would use a model specifically trained for food recognition
 */

// Define the prediction result interface based on MobileNet's output
export interface PredictionResult {
  className: string;
  probability: number;
}

// Singleton instance of the model
let modelInstance: mobilenet.MobileNet | null = null;

/**
 * Loads the MobileNet model if it hasn't been loaded already
 * @returns Promise that resolves to the loaded model
 */
export const loadModel = async (): Promise<mobilenet.MobileNet> => {
  try {
    // If model is already loaded, return it
    if (modelInstance) {
      return modelInstance;
    }

    // Show loading status
    console.log('Loading MobileNet model...');
    
    // Wait for TensorFlow.js to be ready
    await tf.ready();
    
    // Load the model
    modelInstance = await mobilenet.load({
      version: 1,
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
 * Classifies an image using the MobileNet model
 * @param imageElement HTML image element containing the image to classify
 * @returns Promise that resolves to array of prediction results
 */
export const classifyImage = async (
  imageElement: HTMLImageElement
): Promise<PredictionResult[]> => {
  try {
    // Make sure the model is loaded
    const model = await loadModel();
    
    // Run classification
    console.log('Classifying image...');
    const predictions = await model.classify(imageElement);
    
    console.log('Classification results:', predictions);
    return predictions;
  } catch (error) {
    console.error('Failed to classify image:', error);
    throw new Error('Failed to analyze the image');
  }
};

// Pre-load the model when the service is imported
// This will speed up the first classification
loadModel().catch(console.error);
