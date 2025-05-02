
import { EnhancedFoodItem } from './enhancedNutritionData';

export const indianFoods: EnhancedFoodItem[] = [
  {
    name: "Butter Chicken",
    nutritionPer100g: {
      calories: 247,
      protein: 15,
      carbs: 10,
      fat: 17,
      serving: "1 cup (240g)",
      fiber: 2.5,
      sugar: 3.8,
      sodium: 520,
      cholesterol: 85,
      potassium: 320,
      vitaminA: 12,
      vitaminC: 8,
      calcium: 6,
      iron: 10,
      saturatedFat: 8.2,
      transFat: 0
    },
    classes: ["butter chicken", "murgh makhani", "indian curry", "curry chicken"],
    portionOptions: [
      { name: "Small serving", grams: 180 },
      { name: "Regular serving", grams: 240, default: true },
      { name: "Large serving", grams: 300 }
    ],
    category: "prepared",
    mealType: ["lunch", "dinner"]
  },
  {
    name: "Naan",
    nutritionPer100g: {
      calories: 310,
      protein: 9,
      carbs: 57,
      fat: 7,
      serving: "1 piece (85g)",
      fiber: 2.1,
      sugar: 2.0,
      sodium: 400,
      cholesterol: 0,
      potassium: 120,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 4,
      iron: 8,
      saturatedFat: 1.5,
      transFat: 0
    },
    classes: ["naan", "naan bread", "indian bread", "flatbread"],
    portionOptions: [
      { name: "1 small piece", grams: 60 },
      { name: "1 regular piece", grams: 85, default: true },
      { name: "1 large piece", grams: 110 }
    ],
    category: "grains",
    mealType: ["lunch", "dinner"]
  },
  {
    name: "Paneer Tikka",
    nutritionPer100g: {
      calories: 212,
      protein: 18,
      carbs: 4,
      fat: 14,
      serving: "6 pieces (150g)",
      fiber: 1.2,
      sugar: 2.5,
      sodium: 320,
      cholesterol: 38,
      potassium: 210,
      vitaminA: 8,
      vitaminC: 5,
      calcium: 45,
      iron: 5,
      saturatedFat: 7.5,
      transFat: 0
    },
    classes: ["paneer tikka", "paneer", "indian cheese", "tikka"],
    portionOptions: [
      { name: "Small serving", grams: 100 },
      { name: "Regular serving", grams: 150, default: true },
      { name: "Large serving", grams: 200 }
    ],
    category: "protein",
    mealType: ["lunch", "dinner", "snack"]
  },
  {
    name: "Dal Makhani",
    nutritionPer100g: {
      calories: 172,
      protein: 8,
      carbs: 23,
      fat: 6,
      serving: "1 cup (200g)",
      fiber: 7.2,
      sugar: 1.5,
      sodium: 280,
      cholesterol: 10,
      potassium: 380,
      vitaminA: 4,
      vitaminC: 3,
      calcium: 6,
      iron: 15,
      saturatedFat: 3.2,
      transFat: 0
    },
    classes: ["dal makhani", "black lentils", "indian lentils"],
    portionOptions: [
      { name: "Small serving", grams: 150 },
      { name: "Regular serving", grams: 200, default: true },
      { name: "Large serving", grams: 250 }
    ],
    category: "protein", // Changed from "legumes" to "protein"
    mealType: ["lunch", "dinner"]
  },
  {
    name: "Samosa",
    nutritionPer100g: {
      calories: 308,
      protein: 6,
      carbs: 32,
      fat: 18,
      serving: "1 piece (60g)",
      fiber: 3.2,
      sugar: 2.1,
      sodium: 410,
      cholesterol: 0,
      potassium: 240,
      vitaminA: 2,
      vitaminC: 8,
      calcium: 3,
      iron: 6,
      saturatedFat: 2.8,
      transFat: 0.5
    },
    classes: ["samosa", "indian snack", "potato samosa", "fried pastry"],
    portionOptions: [
      { name: "1 small piece", grams: 45 },
      { name: "1 regular piece", grams: 60, default: true },
      { name: "1 large piece", grams: 90 }
    ],
    category: "snacks", // Changed from "snack" to "snacks"
    mealType: ["snack"] // Removed "appetizer"
  },
  {
    name: "Chicken Biryani",
    nutritionPer100g: {
      calories: 184,
      protein: 12,
      carbs: 22,
      fat: 6,
      serving: "1 cup (250g)",
      fiber: 1.8,
      sugar: 0.9,
      sodium: 310,
      cholesterol: 45,
      potassium: 210,
      vitaminA: 4,
      vitaminC: 6,
      calcium: 2,
      iron: 8,
      saturatedFat: 1.6,
      transFat: 0
    },
    classes: ["chicken biryani", "biryani", "indian rice", "rice dish"],
    portionOptions: [
      { name: "Small serving", grams: 180 },
      { name: "Regular serving", grams: 250, default: true },
      { name: "Large serving", grams: 350 }
    ],
    category: "prepared",
    mealType: ["lunch", "dinner"]
  },
  {
    name: "Aloo Gobi",
    nutritionPer100g: {
      calories: 112,
      protein: 3,
      carbs: 18,
      fat: 4,
      serving: "1 cup (180g)",
      fiber: 4.1,
      sugar: 3.8,
      sodium: 180,
      cholesterol: 0,
      potassium: 390,
      vitaminA: 18,
      vitaminC: 45,
      calcium: 4,
      iron: 5,
      saturatedFat: 0.5,
      transFat: 0
    },
    classes: ["aloo gobi", "potato cauliflower", "indian vegetables", "vegetable curry"],
    portionOptions: [
      { name: "Small serving", grams: 120 },
      { name: "Regular serving", grams: 180, default: true },
      { name: "Large serving", grams: 240 }
    ],
    category: "vegetables", // Changed from "vegetable" to "vegetables"
    mealType: ["lunch", "dinner"]
  },
  {
    name: "Palak Paneer",
    nutritionPer100g: {
      calories: 165,
      protein: 11,
      carbs: 6,
      fat: 11,
      serving: "1 cup (200g)",
      fiber: 3.8,
      sugar: 2.0,
      sodium: 260,
      cholesterol: 30,
      potassium: 570,
      vitaminA: 42,
      vitaminC: 28,
      calcium: 32,
      iron: 14,
      saturatedFat: 5.2,
      transFat: 0
    },
    classes: ["palak paneer", "spinach paneer", "spinach cheese", "indian spinach dish"],
    portionOptions: [
      { name: "Small serving", grams: 150 },
      { name: "Regular serving", grams: 200, default: true },
      { name: "Large serving", grams: 250 }
    ],
    category: "prepared",
    mealType: ["lunch", "dinner"]
  }
];

export const chineseFoods: EnhancedFoodItem[] = [
  {
    name: "Kung Pao Chicken",
    nutritionPer100g: {
      calories: 215,
      protein: 18,
      carbs: 12,
      fat: 12,
      serving: "1 cup (200g)",
      fiber: 2.0,
      sugar: 4.5,
      sodium: 480,
      cholesterol: 65,
      potassium: 280,
      vitaminA: 6,
      vitaminC: 12,
      calcium: 3,
      iron: 8,
      saturatedFat: 2.5,
      transFat: 0
    },
    classes: ["kung pao chicken", "chinese chicken", "spicy chicken"],
    portionOptions: [
      { name: "Small serving", grams: 150 },
      { name: "Regular serving", grams: 200, default: true },
      { name: "Large serving", grams: 250 }
    ],
    category: "prepared",
    mealType: ["lunch", "dinner"]
  },
  {
    name: "Fried Rice",
    nutritionPer100g: {
      calories: 185,
      protein: 5,
      carbs: 32,
      fat: 4.5,
      serving: "1 cup (180g)",
      fiber: 1.2,
      sugar: 0.5,
      sodium: 380,
      cholesterol: 25,
      potassium: 120,
      vitaminA: 4,
      vitaminC: 6,
      calcium: 2,
      iron: 6,
      saturatedFat: 1.0,
      transFat: 0
    },
    classes: ["fried rice", "chinese rice", "stir fried rice"],
    portionOptions: [
      { name: "Small bowl", grams: 120 },
      { name: "Regular bowl", grams: 180, default: true },
      { name: "Large bowl", grams: 240 }
    ],
    category: "grains",
    mealType: ["lunch", "dinner"]
  }
];

export const americanFoods: EnhancedFoodItem[] = [
  {
    name: "Cheeseburger",
    nutritionPer100g: {
      calories: 295,
      protein: 17,
      carbs: 24,
      fat: 15,
      serving: "1 burger (170g)",
      fiber: 1.5,
      sugar: 4.0,
      sodium: 620,
      cholesterol: 45,
      potassium: 220,
      vitaminA: 4,
      vitaminC: 2,
      calcium: 15,
      iron: 20,
      saturatedFat: 6.5,
      transFat: 0.5
    },
    classes: ["cheeseburger", "hamburger", "burger"],
    portionOptions: [
      { name: "Single patty", grams: 170, default: true },
      { name: "Double patty", grams: 250 }
    ],
    category: "prepared",
    mealType: ["lunch", "dinner"]
  },
  {
    name: "Mac and Cheese",
    nutritionPer100g: {
      calories: 350,
      protein: 13,
      carbs: 43,
      fat: 15,
      serving: "1 cup (200g)",
      fiber: 1.8,
      sugar: 3.5,
      sodium: 580,
      cholesterol: 35,
      potassium: 180,
      vitaminA: 8,
      vitaminC: 0,
      calcium: 25,
      iron: 6,
      saturatedFat: 8.5,
      transFat: 0
    },
    classes: ["mac and cheese", "macaroni and cheese", "macaroni cheese"],
    portionOptions: [
      { name: "Small serving", grams: 150 },
      { name: "Regular serving", grams: 200, default: true },
      { name: "Large serving", grams: 250 }
    ],
    category: "prepared",
    mealType: ["lunch", "dinner"]
  }
];
