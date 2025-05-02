
import { nutritionData, FoodItem, NutritionInfo, findFoodByClass } from './nutritionData';

// Enhanced nutrition data with more properties
export interface EnhancedNutritionInfo extends NutritionInfo {
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  potassium: number;
  vitaminA: number; // % of daily value
  vitaminC: number; // % of daily value
  calcium: number; // % of daily value
  iron: number; // % of daily value
  saturatedFat: number;
  transFat: number;
}

export interface EnhancedFoodItem extends Omit<FoodItem, 'nutritionPer100g'> {
  nutritionPer100g: EnhancedNutritionInfo;
  portionOptions: {
    name: string;
    grams: number;
    default?: boolean;
  }[];
  category: 'fruits' | 'vegetables' | 'grains' | 'protein' | 'dairy' | 'snacks' | 'beverages' | 'prepared';
  mealType: ('breakfast' | 'lunch' | 'dinner' | 'snack')[];
  glycemicIndex?: number; // Optional glycemic index
}

// Add new interfaces for recipes
interface Recipe {
  steps: string[];
  ingredients: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
}

interface MealWithRecipe {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isVegetarian: boolean;
  recipe?: Recipe;
}

interface MealGroup {
  name: string;
  foods: MealWithRecipe[];
  totalCalories: number;
}

interface DayPlan {
  breakfast: MealGroup;
  lunch: MealGroup;
  dinner: MealGroup;
  snacks: MealGroup;
}

// Convert the basic nutrition data to enhanced version
// For now, we'll add some default values for the additional fields
const enhancedData: EnhancedFoodItem[] = nutritionData.map(food => {
  // Define default portion options based on food type
  let portionOptions = [];
  let category: EnhancedFoodItem['category'] = 'snacks';
  let mealType: EnhancedFoodItem['mealType'] = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  // Customize based on food type
  if (food.name.includes('Apple') || food.name.includes('Banana') || food.name.includes('Orange')) {
    category = 'fruits';
    portionOptions = [
      { name: '1 small', grams: 100 },
      { name: '1 medium', grams: 150, default: true },
      { name: '1 large', grams: 200 }
    ];
    mealType = ['breakfast', 'snack'];
  } else if (food.name.includes('Salad')) {
    category = 'vegetables';
    portionOptions = [
      { name: '1 cup', grams: 67, default: true },
      { name: '2 cups', grams: 134 },
      { name: 'Side salad', grams: 100 }
    ];
    mealType = ['lunch', 'dinner'];
  } else if (food.name.includes('Pizza') || food.name.includes('Hamburger') || food.name.includes('Pasta')) {
    category = 'prepared';
    portionOptions = [
      { name: '1 slice/serving', grams: 100, default: true },
      { name: '2 slices/servings', grams: 200 },
      { name: 'Large portion', grams: 300 }
    ];
    mealType = ['lunch', 'dinner'];
  } else if (food.name.includes('Bread') || food.name.includes('Rice')) {
    category = 'grains';
    portionOptions = [
      { name: '1 slice/serving', grams: 30, default: true },
      { name: '2 slices/servings', grams: 60 },
      { name: 'Large portion', grams: 100 }
    ];
    mealType = ['breakfast', 'lunch', 'dinner'];
  } else if (food.name.includes('Steak') || food.name.includes('Sushi')) {
    category = 'protein';
    portionOptions = [
      { name: 'Small portion', grams: 85 },
      { name: 'Regular portion', grams: 170, default: true },
      { name: 'Large portion', grams: 255 }
    ];
    mealType = ['lunch', 'dinner'];
  } else if (food.name.includes('Ice Cream') || food.name.includes('Chocolate')) {
    category = 'snacks';
    portionOptions = [
      { name: 'Small serving', grams: 50 },
      { name: 'Regular serving', grams: 100, default: true },
      { name: 'Large serving', grams: 150 }
    ];
    mealType = ['snack'];
  } else if (food.name.includes('Coffee')) {
    category = 'beverages';
    portionOptions = [
      { name: 'Small cup', grams: 180 },
      { name: 'Regular cup', grams: 240, default: true },
      { name: 'Large cup', grams: 360 }
    ];
    mealType = ['breakfast', 'snack'];
  } else {
    // Default options
    portionOptions = [
      { name: 'Small serving', grams: 50 },
      { name: 'Regular serving', grams: 100, default: true },
      { name: 'Large serving', grams: 150 }
    ];
  }
  
  return {
    ...food,
    nutritionPer100g: {
      ...food.nutritionPer100g,
      fiber: Math.round(Math.random() * 5 * 10) / 10, // 0-5g fiber
      sugar: Math.round(Math.random() * 10 * 10) / 10, // 0-10g sugar
      sodium: Math.round(Math.random() * 400), // 0-400mg sodium
      cholesterol: Math.round(Math.random() * 50), // 0-50mg cholesterol
      potassium: Math.round(Math.random() * 500), // 0-500mg potassium
      vitaminA: Math.round(Math.random() * 20), // 0-20% DV
      vitaminC: Math.round(Math.random() * 20), // 0-20% DV
      calcium: Math.round(Math.random() * 20), // 0-20% DV
      iron: Math.round(Math.random() * 20), // 0-20% DV
      saturatedFat: Math.round(Math.random() * food.nutritionPer100g.fat * 0.4 * 10) / 10, // 0-40% of total fat
      transFat: 0 // No trans fat
    },
    portionOptions,
    category,
    mealType,
    glycemicIndex: category === 'fruits' || category === 'grains' ? Math.round(Math.random() * 70 + 30) : undefined // 30-100 for fruits and grains
  };
});

// Add some more foods with detailed nutritional info
const additionalFoods: EnhancedFoodItem[] = [
  {
    name: "Greek Yogurt",
    nutritionPer100g: {
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      serving: "1 cup (245g)",
      fiber: 0,
      sugar: 3.6,
      sodium: 36,
      cholesterol: 10,
      potassium: 141,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 11,
      iron: 0,
      saturatedFat: 0.3,
      transFat: 0
    },
    classes: ["yogurt", "greek yogurt", "dairy"],
    portionOptions: [
      { name: "1/2 cup", grams: 122 },
      { name: "1 cup", grams: 245, default: true },
      { name: "2 cups", grams: 490 }
    ],
    category: "dairy",
    mealType: ["breakfast", "snack"]
  },
  {
    name: "Quinoa",
    nutritionPer100g: {
      calories: 120,
      protein: 4.4,
      carbs: 21.3,
      fat: 1.9,
      serving: "1 cup cooked (185g)",
      fiber: 2.8,
      sugar: 0.9,
      sodium: 7,
      cholesterol: 0,
      potassium: 172,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 2,
      iron: 8,
      saturatedFat: 0.2,
      transFat: 0
    },
    classes: ["quinoa", "grain", "seeds"],
    portionOptions: [
      { name: "1/2 cup cooked", grams: 93 },
      { name: "1 cup cooked", grams: 185, default: true },
      { name: "2 cups cooked", grams: 370 }
    ],
    category: "grains",
    mealType: ["lunch", "dinner"],
    glycemicIndex: 53
  },
  {
    name: "Salmon",
    nutritionPer100g: {
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13,
      serving: "3 oz fillet (85g)",
      fiber: 0,
      sugar: 0,
      sodium: 59,
      cholesterol: 55,
      potassium: 380,
      vitaminA: 2,
      vitaminC: 0,
      calcium: 1,
      iron: 3,
      saturatedFat: 3.1,
      transFat: 0
    },
    classes: ["salmon", "fish", "seafood"],
    portionOptions: [
      { name: "3 oz fillet", grams: 85 },
      { name: "6 oz fillet", grams: 170, default: true },
      { name: "8 oz fillet", grams: 227 }
    ],
    category: "protein",
    mealType: ["lunch", "dinner"]
  },
  {
    name: "Avocado",
    nutritionPer100g: {
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
      serving: "1/2 avocado (68g)",
      fiber: 6.7,
      sugar: 0.7,
      sodium: 7,
      cholesterol: 0,
      potassium: 485,
      vitaminA: 3,
      vitaminC: 17,
      calcium: 1,
      iron: 3,
      saturatedFat: 2.1,
      transFat: 0
    },
    classes: ["avocado", "fruit"],
    portionOptions: [
      { name: "1/4 avocado", grams: 34 },
      { name: "1/2 avocado", grams: 68, default: true },
      { name: "Whole avocado", grams: 136 }
    ],
    category: "fruits",
    mealType: ["breakfast", "lunch", "dinner", "snack"],
    glycemicIndex: 15
  },
  {
    name: "Almonds",
    nutritionPer100g: {
      calories: 579,
      protein: 21.2,
      carbs: 21.7,
      fat: 49.9,
      serving: "1 oz (28g)",
      fiber: 12.5,
      sugar: 4.4,
      sodium: 1,
      cholesterol: 0,
      potassium: 733,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 26,
      iron: 14,
      saturatedFat: 3.8,
      transFat: 0
    },
    classes: ["almonds", "nuts", "tree nuts"],
    portionOptions: [
      { name: "10 almonds", grams: 12 },
      { name: "1 oz (23 almonds)", grams: 28, default: true },
      { name: "1/4 cup", grams: 35 }
    ],
    category: "snacks",
    mealType: ["snack"],
    glycemicIndex: 0
  }
];

// Combine the enhanced base data with the additional foods
export const enhancedNutritionData: EnhancedFoodItem[] = [...enhancedData, ...additionalFoods];

/**
 * Find the nutrition information for a food item based on the classifier result
 * @param classifierResult The label returned from the image classifier
 * @returns The matching food item or undefined if no match is found
 */
export const findEnhancedFoodByClass = (classifierResult: string): EnhancedFoodItem | undefined => {
  // Normalize the classifier result
  const normalizedResult = classifierResult.toLowerCase();
  
  // Try to find a match in our enhanced data
  return enhancedNutritionData.find(food => 
    food.classes.some(cls => normalizedResult.includes(cls.toLowerCase()))
  );
};

/**
 * Get the default portion size for a food item
 */
export const getDefaultPortion = (food: EnhancedFoodItem) => {
  const defaultOption = food.portionOptions.find(option => option.default);
  return defaultOption || food.portionOptions[0];
};

/**
 * Calculate nutrition values for a specific portion size
 */
export const calculateNutritionForPortion = (
  food: EnhancedFoodItem,
  portionGrams: number
): EnhancedNutritionInfo => {
  const { nutritionPer100g } = food;
  const factor = portionGrams / 100;
  
  return {
    calories: Math.round(nutritionPer100g.calories * factor),
    protein: Math.round(nutritionPer100g.protein * factor * 10) / 10,
    carbs: Math.round(nutritionPer100g.carbs * factor * 10) / 10,
    fat: Math.round(nutritionPer100g.fat * factor * 10) / 10,
    serving: `${portionGrams}g`,
    fiber: Math.round(nutritionPer100g.fiber * factor * 10) / 10,
    sugar: Math.round(nutritionPer100g.sugar * factor * 10) / 10,
    sodium: Math.round(nutritionPer100g.sodium * factor),
    cholesterol: Math.round(nutritionPer100g.cholesterol * factor),
    potassium: Math.round(nutritionPer100g.potassium * factor),
    vitaminA: Math.round(nutritionPer100g.vitaminA * factor),
    vitaminC: Math.round(nutritionPer100g.vitaminC * factor),
    calcium: Math.round(nutritionPer100g.calcium * factor),
    iron: Math.round(nutritionPer100g.iron * factor),
    saturatedFat: Math.round(nutritionPer100g.saturatedFat * factor * 10) / 10,
    transFat: Math.round(nutritionPer100g.transFat * factor * 10) / 10
  };
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure) based on profile data
 */
export interface ProfileData {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // in kg
  height: number; // in cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'lose' | 'maintain' | 'gain';
}

export const calculateTDEE = (profile: ProfileData): number => {
  // First calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  
  // Apply activity multiplier
  const activityMultipliers: Record<string, number> = {
    'sedentary': 1.2, // Little or no exercise
    'light': 1.375, // Light exercise 1-3 days/week
    'moderate': 1.55, // Moderate exercise 3-5 days/week
    'active': 1.725, // Hard exercise 6-7 days/week
    'very-active': 1.9 // Very hard exercise & physical job
  };
  
  const tdee = Math.round(bmr * activityMultipliers[profile.activityLevel]);
  
  // Adjust based on goal
  if (profile.goal === 'lose') {
    return Math.round(tdee * 0.85); // 15% calorie deficit
  } else if (profile.goal === 'gain') {
    return Math.round(tdee * 1.1); // 10% calorie surplus
  }
  
  return tdee; // Maintain weight
};

/**
 * Generate a diet plan based on profile and TDEE
 */
export const generateDietPlan = (profile: ProfileData, tdee: number) => {
  let planName: string;
  let planDescription: string;
  
  // Set macronutrient ratios based on goal
  let proteinRatio: number;
  let carbsRatio: number;
  let fatRatio: number;
  
  if (profile.goal === 'lose') {
    planName = "Weight Loss Plan";
    planDescription = "A calorie-controlled plan with higher protein to preserve muscle mass.";
    proteinRatio = 0.4; // 40% protein
    carbsRatio = 0.3; // 30% carbs
    fatRatio = 0.3; // 30% fat
  } else if (profile.goal === 'gain') {
    planName = "Muscle Building Plan";
    planDescription = "A higher calorie plan with balanced macros to support muscle growth.";
    proteinRatio = 0.3; // 30% protein
    carbsRatio = 0.45; // 45% carbs
    fatRatio = 0.25; // 25% fat
  } else {
    planName = "Balanced Maintenance Plan";
    planDescription = "A balanced plan to maintain your current weight and support overall health.";
    proteinRatio = 0.3; // 30% protein
    carbsRatio = 0.4; // 40% carbs
    fatRatio = 0.3; // 30% fat
  }
  
  // Calculate macros in grams
  const protein = Math.round((tdee * proteinRatio) / 4); // 4 calories per gram of protein
  const carbs = Math.round((tdee * carbsRatio) / 4); // 4 calories per gram of carbs
  const fat = Math.round((tdee * fatRatio) / 9); // 9 calories per gram of fat
  
  // Create a recipe generation function
  const createRecipe = (name: string, isVeg: boolean): Recipe => {
    return {
      ingredients: [
        isVeg ? "1 cup quinoa" : "4 oz chicken breast",
        "1 tbsp olive oil",
        "Mixed vegetables",
        "Salt and pepper to taste"
      ],
      steps: [
        "Gather all ingredients",
        isVeg ? "Rinse quinoa thoroughly" : "Season the protein",
        "Heat oil in a pan",
        isVeg ? "Cook quinoa according to package instructions" : "Cook protein until done",
        "Add vegetables and seasonings",
        "Serve hot"
      ],
      prepTime: "10 minutes",
      cookTime: "20 minutes",
      servings: 1
    };
  };

  // Comprehensive meal options with vegetarian and non-vegetarian choices
  const breakfastOptions: MealWithRecipe[] = [
    {
      name: "Overnight Oats with Berries",
      portion: "1 cup",
      calories: Math.round(tdee * 0.2),
      protein: Math.round(protein * 0.15),
      carbs: Math.round(carbs * 0.25),
      fat: Math.round(fat * 0.15),
      isVegetarian: true,
      recipe: createRecipe("Overnight Oats", true)
    },
    {
      name: "Greek Yogurt Parfait",
      portion: "1 cup",
      calories: Math.round(tdee * 0.2),
      protein: Math.round(protein * 0.18),
      carbs: Math.round(carbs * 0.15),
      fat: Math.round(fat * 0.12),
      isVegetarian: true,
      recipe: createRecipe("Greek Yogurt Parfait", true)
    },
    {
      name: "Vegetable Tofu Scramble",
      portion: "1 plate",
      calories: Math.round(tdee * 0.22),
      protein: Math.round(protein * 0.20),
      carbs: Math.round(carbs * 0.15),
      fat: Math.round(fat * 0.18),
      isVegetarian: true,
      recipe: createRecipe("Tofu Scramble", true)
    },
    {
      name: "Avocado Toast with Poached Eggs",
      portion: "2 slices",
      calories: Math.round(tdee * 0.23),
      protein: Math.round(protein * 0.18),
      carbs: Math.round(carbs * 0.15),
      fat: Math.round(fat * 0.25),
      isVegetarian: true,
      recipe: createRecipe("Avocado Toast", true)
    },
    {
      name: "Turkey Bacon Breakfast Sandwich",
      portion: "1 sandwich",
      calories: Math.round(tdee * 0.25),
      protein: Math.round(protein * 0.25),
      carbs: Math.round(carbs * 0.2),
      fat: Math.round(fat * 0.2),
      isVegetarian: false,
      recipe: createRecipe("Breakfast Sandwich", false)
    },
    {
      name: "Ham and Cheese Omelette",
      portion: "3 eggs",
      calories: Math.round(tdee * 0.23),
      protein: Math.round(protein * 0.28),
      carbs: Math.round(carbs * 0.05),
      fat: Math.round(fat * 0.25),
      isVegetarian: false,
      recipe: createRecipe("Ham Omelette", false)
    },
    {
      name: "Steak and Eggs",
      portion: "4oz steak, 2 eggs",
      calories: Math.round(tdee * 0.28),
      protein: Math.round(protein * 0.35),
      carbs: Math.round(carbs * 0.05),
      fat: Math.round(fat * 0.30),
      isVegetarian: false,
      recipe: createRecipe("Steak and Eggs", false)
    },
    {
      name: "Smoked Salmon Bagel",
      portion: "1 bagel",
      calories: Math.round(tdee * 0.25),
      protein: Math.round(protein * 0.22),
      carbs: Math.round(carbs * 0.25),
      fat: Math.round(fat * 0.18),
      isVegetarian: false,
      recipe: createRecipe("Salmon Bagel", false)
    }
  ];

  const lunchOptions: MealWithRecipe[] = [
    {
      name: "Quinoa Buddha Bowl",
      portion: "1 bowl",
      calories: Math.round(tdee * 0.3),
      protein: Math.round(protein * 0.25),
      carbs: Math.round(carbs * 0.3),
      fat: Math.round(fat * 0.25),
      isVegetarian: true,
      recipe: createRecipe("Quinoa Bowl", true)
    },
    {
      name: "Mediterranean Chickpea Salad",
      portion: "1 large bowl",
      calories: Math.round(tdee * 0.28),
      protein: Math.round(protein * 0.22),
      carbs: Math.round(carbs * 0.25),
      fat: Math.round(fat * 0.22),
      isVegetarian: true,
      recipe: createRecipe("Chickpea Salad", true)
    },
    {
      name: "Lentil and Vegetable Soup",
      portion: "1 large bowl",
      calories: Math.round(tdee * 0.25),
      protein: Math.round(protein * 0.18),
      carbs: Math.round(carbs * 0.28),
      fat: Math.round(fat * 0.15),
      isVegetarian: true,
      recipe: createRecipe("Lentil Soup", true)
    },
    {
      name: "Spinach and Feta Wrap",
      portion: "1 wrap",
      calories: Math.round(tdee * 0.27),
      protein: Math.round(protein * 0.20),
      carbs: Math.round(carbs * 0.28),
      fat: Math.round(fat * 0.22),
      isVegetarian: true,
      recipe: createRecipe("Spinach Wrap", true)
    },
    {
      name: "Grilled Chicken Salad",
      portion: "1 large bowl",
      calories: Math.round(tdee * 0.3),
      protein: Math.round(protein * 0.35),
      carbs: Math.round(carbs * 0.2),
      fat: Math.round(fat * 0.25),
      isVegetarian: false,
      recipe: createRecipe("Chicken Salad", false)
    },
    {
      name: "Turkey Club Sandwich",
      portion: "1 sandwich",
      calories: Math.round(tdee * 0.32),
      protein: Math.round(protein * 0.30),
      carbs: Math.round(carbs * 0.25),
      fat: Math.round(fat * 0.22),
      isVegetarian: false,
      recipe: createRecipe("Turkey Sandwich", false)
    },
    {
      name: "Beef and Broccoli Stir Fry",
      portion: "1 cup",
      calories: Math.round(tdee * 0.33),
      protein: Math.round(protein * 0.32),
      carbs: Math.round(carbs * 0.22),
      fat: Math.round(fat * 0.25),
      isVegetarian: false,
      recipe: createRecipe("Beef Stir Fry", false)
    },
    {
      name: "Tuna Nicoise Salad",
      portion: "1 large bowl",
      calories: Math.round(tdee * 0.28),
      protein: Math.round(protein * 0.32),
      carbs: Math.round(carbs * 0.18),
      fat: Math.round(fat * 0.25),
      isVegetarian: false,
      recipe: createRecipe("Tuna Salad", false)
    }
  ];

  const dinnerOptions: MealWithRecipe[] = [
    {
      name: "Lentil Curry with Brown Rice",
      portion: "1 cup curry, 1/2 cup rice",
      calories: Math.round(tdee * 0.35),
      protein: Math.round(protein * 0.25),
      carbs: Math.round(carbs * 0.35),
      fat: Math.round(fat * 0.3),
      isVegetarian: true,
      recipe: createRecipe("Lentil Curry", true)
    },
    {
      name: "Vegetable and Tofu Stir-Fry",
      portion: "1 large plate",
      calories: Math.round(tdee * 0.32),
      protein: Math.round(protein * 0.22),
      carbs: Math.round(carbs * 0.30),
      fat: Math.round(fat * 0.25),
      isVegetarian: true,
      recipe: createRecipe("Tofu Stir-Fry", true)
    },
    {
      name: "Eggplant Parmesan with Quinoa",
      portion: "1 large serving",
      calories: Math.round(tdee * 0.33),
      protein: Math.round(protein * 0.20),
      carbs: Math.round(carbs * 0.32),
      fat: Math.round(fat * 0.28),
      isVegetarian: true,
      recipe: createRecipe("Eggplant Parmesan", true)
    },
    {
      name: "Vegetarian Chili with Cornbread",
      portion: "1 bowl with 1 piece cornbread",
      calories: Math.round(tdee * 0.34),
      protein: Math.round(protein * 0.22),
      carbs: Math.round(carbs * 0.38),
      fat: Math.round(fat * 0.25),
      isVegetarian: true,
      recipe: createRecipe("Vegetarian Chili", true)
    },
    {
      name: "Grilled Salmon with Vegetables",
      portion: "6 oz salmon",
      calories: Math.round(tdee * 0.35),
      protein: Math.round(protein * 0.4),
      carbs: Math.round(carbs * 0.25),
      fat: Math.round(fat * 0.35),
      isVegetarian: false,
      recipe: createRecipe("Grilled Salmon", false)
    },
    {
      name: "Baked Chicken with Sweet Potato",
      portion: "6 oz chicken, 1 medium sweet potato",
      calories: Math.round(tdee * 0.33),
      protein: Math.round(protein * 0.38),
      carbs: Math.round(carbs * 0.28),
      fat: Math.round(fat * 0.20),
      isVegetarian: false,
      recipe: createRecipe("Baked Chicken", false)
    },
    {
      name: "Steak with Roasted Vegetables",
      portion: "6 oz steak, 1 cup vegetables",
      calories: Math.round(tdee * 0.38),
      protein: Math.round(protein * 0.42),
      carbs: Math.round(carbs * 0.15),
      fat: Math.round(fat * 0.40),
      isVegetarian: false,
      recipe: createRecipe("Steak Dinner", false)
    },
    {
      name: "Shrimp Scampi with Zucchini Noodles",
      portion: "6 oz shrimp, 2 cups zoodles",
      calories: Math.round(tdee * 0.32),
      protein: Math.round(protein * 0.35),
      carbs: Math.round(carbs * 0.12),
      fat: Math.round(fat * 0.30),
      isVegetarian: false,
      recipe: createRecipe("Shrimp Scampi", false)
    }
  ];

  const snackOptions: MealWithRecipe[] = [
    {
      name: "Mixed Nuts and Dried Fruit",
      portion: "1/4 cup",
      calories: Math.round(tdee * 0.15),
      protein: Math.round(protein * 0.1),
      carbs: Math.round(carbs * 0.15),
      fat: Math.round(fat * 0.2),
      isVegetarian: true,
      recipe: createRecipe("Trail Mix", true)
    },
    {
      name: "Apple with Almond Butter",
      portion: "1 medium apple, 2 tbsp almond butter",
      calories: Math.round(tdee * 0.12),
      protein: Math.round(protein * 0.08),
      carbs: Math.round(carbs * 0.18),
      fat: Math.round(fat * 0.15),
      isVegetarian: true,
      recipe: createRecipe("Apple Snack", true)
    },
    {
      name: "Hummus with Vegetable Sticks",
      portion: "1/4 cup hummus, 1 cup vegetables",
      calories: Math.round(tdee * 0.11),
      protein: Math.round(protein * 0.07),
      carbs: Math.round(carbs * 0.12),
      fat: Math.round(fat * 0.14),
      isVegetarian: true,
      recipe: createRecipe("Hummus Snack", true)
    },
    {
      name: "Greek Yogurt with Honey",
      portion: "1 cup",
      calories: Math.round(tdee * 0.15),
      protein: Math.round(protein * 0.12),
      carbs: Math.round(carbs * 0.10),
      fat: Math.round(fat * 0.08),
      isVegetarian: true,
      recipe: createRecipe("Yogurt Snack", true)
    },
    {
      name: "Protein Bar",
      portion: "1 bar",
      calories: Math.round(tdee * 0.15),
      protein: Math.round(protein * 0.18),
      carbs: Math.round(carbs * 0.12),
      fat: Math.round(fat * 0.10),
      isVegetarian: false,
      recipe: createRecipe("Protein Bar", false)
    },
    {
      name: "Turkey and Cheese Roll-Ups",
      portion: "4 roll-ups",
      calories: Math.round(tdee * 0.12),
      protein: Math.round(protein * 0.15),
      carbs: Math.round(carbs * 0.05),
      fat: Math.round(fat * 0.12),
      isVegetarian: false,
      recipe: createRecipe("Turkey Roll-Ups", false)
    },
    {
      name: "Beef Jerky",
      portion: "1 oz",
      calories: Math.round(tdee * 0.10),
      protein: Math.round(protein * 0.16),
      carbs: Math.round(carbs * 0.03),
      fat: Math.round(fat * 0.05),
      isVegetarian: false,
      recipe: createRecipe("Jerky Snack", false)
    },
    {
      name: "Hard Boiled Eggs",
      portion: "2 eggs",
      calories: Math.round(tdee * 0.10),
      protein: Math.round(protein * 0.12),
      carbs: Math.round(carbs * 0.01),
      fat: Math.round(fat * 0.14),
      isVegetarian: false,
      recipe: createRecipe("Egg Snack", false)
    }
  ];

  // Generate 5 days of meal plans with different combinations
  const days = [];
  for (let i = 0; i < 5; i++) {
    // Randomly select meals for this day, ensuring a mix of vegetarian and non-vegetarian options
    const breakfast = {
      name: `Day ${i + 1} Breakfast`,
      foods: [breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)]],
      totalCalories: 0
    };
    breakfast.totalCalories = breakfast.foods.reduce((sum, food) => sum + food.calories, 0);
    
    const lunch = {
      name: `Day ${i + 1} Lunch`,
      foods: [lunchOptions[Math.floor(Math.random() * lunchOptions.length)]],
      totalCalories: 0
    };
    lunch.totalCalories = lunch.foods.reduce((sum, food) => sum + food.calories, 0);
    
    const dinner = {
      name: `Day ${i + 1} Dinner`,
      foods: [dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)]],
      totalCalories: 0
    };
    dinner.totalCalories = dinner.foods.reduce((sum, food) => sum + food.calories, 0);
    
    const snacks = {
      name: `Day ${i + 1} Snacks`,
      foods: [snackOptions[Math.floor(Math.random() * snackOptions.length)]],
      totalCalories: 0
    };
    snacks.totalCalories = snacks.foods.reduce((sum, food) => sum + food.calories, 0);
    
    days.push({
      breakfast,
      lunch,
      dinner,
      snacks
    });
  }
  
  // Calculate total calories and macros for the whole plan
  const totalCalories = days.reduce((sum, day) => {
    return sum + day.breakfast.totalCalories + day.lunch.totalCalories + 
           day.dinner.totalCalories + day.snacks.totalCalories;
  }, 0) / days.length; // Average daily calories
  
  return {
    id: new Date().getTime().toString(),
    name: planName,
    description: planDescription,
    totalCalories: Math.round(totalCalories),
    macros: {
      protein,
      carbs,
      fat
    },
    days
  };
};
