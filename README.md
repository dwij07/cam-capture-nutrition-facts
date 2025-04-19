
# Camera Nutrition Tracking App

A web application for tracking nutrition information using on-device food recognition with TensorFlow.js.

## Features

- Upload or take photos of food
- On-device image classification using TensorFlow.js and MobileNet
- Display of nutrition facts (calories, protein, carbs, fat)
- Clean, modern UI with responsive design

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **ML**: TensorFlow.js, MobileNet pre-trained model
- **Data**: Static nutrition database (expandable)

## How to Run Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:8080`

## Implementation Details

### Machine Learning Model

This application uses the MobileNet model via TensorFlow.js for food recognition. MobileNet is a lightweight convolutional neural network pre-trained on the ImageNet dataset, which includes many common food items.

In a production environment, this could be replaced with a model specifically trained for food recognition.

### Nutrition Data

The nutrition data is currently stored as a static dataset in `src/data/nutritionData.ts`. In a production application, this would be replaced with a more comprehensive database or API call.

### Privacy

All processing is done on-device using TensorFlow.js, meaning that images never leave the user's browser.

## Future Improvements

- Add camera functionality for mobile devices
- Implement a more comprehensive food database
- Train a custom model specifically for food recognition
- Add portion size estimation
- Allow users to save their food history

## Requirements

- Node.js 16+
- Modern browser with JavaScript enabled

## Dependencies

- React
- TypeScript
- TensorFlow.js
- MobileNet model
- TailwindCSS
- shadcn/ui components
