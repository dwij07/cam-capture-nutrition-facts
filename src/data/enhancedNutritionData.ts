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
  
  // Create a sample 3-day meal plan
  // This is a simplified version - in a real app, this would be much more sophisticated
  const mealPlan = {
    id: "default-plan",
    name: planName,
    description: planDescription,
    totalCalories: tdee,
    macros: {
      protein,
      carbs,
      fat
    },
    days: [
      // Day 1
      {
        breakfast: {
          name: "Protein-Packed Breakfast",
          foods: [
            {
              name: "Greek Yogurt with Berries",
              portion: "1 cup yogurt with 1/2 cup berries",
              calories: Math.round(tdee * 0.2),
              protein: Math.round(protein * 0.25),
              carbs: Math.round(carbs * 0.15),
              fat: Math.round(fat * 0.1),
              isVegetarian: true
            }
          ],
          totalCalories: Math.round(tdee * 0.2)
        },
        lunch: {
          name: "Balanced Lunch",
          foods: [
            {
              name: "Chicken Salad with Quinoa",
              portion: "4oz chicken with 1/2 cup quinoa and veggies",
              calories: Math.round(tdee * 0.3),
              protein: Math.round(protein * 0.35),
              carbs: Math.round(carbs * 0.3),
              fat: Math.round(fat * 0.25),
              isVegetarian: false
            }
          ],
          totalCalories: Math.round(tdee * 0.3)
        },
        dinner: {
          name: "Nutrient-Rich Dinner",
          foods: [
            {
              name: "Salmon with Sweet Potato and Asparagus",
              portion: "5oz salmon, 1 medium sweet potato, 1 cup asparagus",
              calories: Math.round(tdee * 0.35),
              protein: Math.round(protein * 0.35),
              carbs: Math.round(carbs * 0.4),
              fat: Math.round(fat * 0.5),
              isVegetarian: false
            }
          ],
          totalCalories: Math.round(tdee * 0.35)
        },
        snacks: {
          name: "Healthy Snacks",
          foods: [
            {
              name: "Almonds",
              portion: "1oz (23 almonds)",
              calories: Math.round(tdee * 0.15),
              protein: Math.round(protein * 0.05),
              carbs: Math.round(carbs * 0.15),
              fat: Math.round(fat * 0.15),
              isVegetarian: true
            }
          ],
          totalCalories: Math.round(tdee * 0.15)
        }
      },
      // Day 2
      {
        breakfast: {
          name: "Protein-Packed Breakfast",
          foods: [
            {
              name: "Egg Scramble with Avocado Toast",
              portion: "3 eggs and 1 slice toast with 1/4 avocado",
              calories: Math.round(tdee * 0.2),
              protein: Math.round(protein * 0.25),
              carbs: Math.round(carbs * 0.15),
              fat: Math.round(fat * 0.2),
              isVegetarian: true
            }
          ],
          totalCalories: Math.round(tdee * 0.2)
        },
        lunch: {
          name: "Balanced Lunch",
          foods: [
            {
              name: "Turkey and Veggie Wrap",
              portion: "4oz turkey with veggies in whole grain wrap",
              calories: Math.round(tdee * 0.3),
              protein: Math.round(protein * 0.35),
              carbs: Math.round(carbs * 0.35),
              fat: Math.round(fat * 0.2),
              isVegetarian: false
            }
          ],
          totalCalories: Math.round(tdee * 0.3)
        },
        dinner: {
          name: "Nutrient-Rich Dinner",
          foods: [
            {
              name: "Stir-Fry with Rice",
              portion: "4oz lean beef with vegetables and 1/2 cup rice",
              calories: Math.round(tdee * 0.35),
              protein: Math.round(protein * 0.35),
              carbs: Math.round(carbs * 0.35),
              fat: Math.round(fat * 0.4),
              isVegetarian: false
            }
          ],
          totalCalories: Math.round(tdee * 0.35)
        },
        snacks: {
          name: "Healthy Snacks",
          foods: [
            {
              name: "Greek Yogurt with Honey",
              portion: "1 cup yogurt with 1 tsp honey",
              calories: Math.round(tdee * 0.15),
              protein: Math.round(protein * 0.05),
              carbs: Math.round(carbs * 0.15),
              fat: Math.round(fat * 0.2),
              isVegetarian: true
            }
          ],
          totalCalories: Math.round(tdee * 0.15)
        }
      },
      // Day 3
      {
        breakfast: {
          name: "Protein-Packed Breakfast",
          foods: [
            {
              name: "Protein Smoothie",
              portion: "1 scoop protein powder, 1 banana, 1 cup milk",
              calories: Math.round(tdee * 0.2),
              protein: Math.round(protein * 0.3),
              carbs: Math.round(carbs * 0.2),
              fat: Math.round(fat * 0.1),
              isVegetarian: true
            }
          ],
          totalCalories: Math.round(tdee * 0.2)
        },
        lunch: {
          name: "Balanced Lunch",
          foods: [
            {
              name: "Quinoa Bowl with Chicken and Avocado",
              portion: "4oz chicken, 1/2 cup quinoa, 1/4 avocado",
              calories: Math.round(tdee * 0.3),
              protein: Math.round(protein * 0.3),
              carbs: Math.round(carbs * 0.25),
              fat: Math.round(fat * 0.3),
              isVegetarian: false
            }
          ],
          totalCalories: Math.round(tdee * 0.3)
        },
        dinner: {
          name: "Nutrient-Rich Dinner",
          foods: [
            {
              name: "Grilled Fish Tacos",
              portion: "5oz white fish with 2 corn tortillas and toppings",
              calories: Math.round(tdee * 0.35),
              protein: Math.round(protein * 0.35),
              carbs: Math.round(carbs * 0.4),
              fat: Math.round(fat * 0.4),
              isVegetarian: false
            }
          ],
          totalCalories: Math.round(tdee * 0.35)
        },
        snacks: {
          name: "Healthy Snacks",
          foods: [
            {
              name: "Apple with Peanut Butter",
              portion: "1 medium apple with 1 tbsp peanut butter",
              calories: Math.round(tdee * 0.15),
              protein: Math.round(protein * 0.05),
              carbs: Math.round(carbs * 0.15),
              fat: Math.round(fat * 0.2),
              isVegetarian: true
            }
          ],
          totalCalories: Math.round(tdee * 0.15)
        }
      }
    ]
  };
  
  return mealPlan;
};
