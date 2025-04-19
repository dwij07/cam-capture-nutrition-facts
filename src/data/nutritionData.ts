
/**
 * Static dataset mapping food items to nutrition facts
 * This serves as a simple lookup table for the demo
 * In a real application, this would be replaced with an API call
 */

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

export interface FoodItem {
  name: string;
  nutritionPer100g: NutritionInfo;
  classes: string[]; // Different class names that could match from model
}

export const nutritionData: FoodItem[] = [
  {
    name: "Apple",
    nutritionPer100g: {
      calories: 52,
      protein: 0.3,
      carbs: 13.8,
      fat: 0.2,
      serving: "1 medium apple (182g)"
    },
    classes: ["apple", "green apple", "red apple", "Granny Smith"]
  },
  {
    name: "Banana",
    nutritionPer100g: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      serving: "1 medium banana (118g)"
    },
    classes: ["banana"]
  },
  {
    name: "Orange",
    nutritionPer100g: {
      calories: 43,
      protein: 0.9,
      carbs: 8.3,
      fat: 0.1,
      serving: "1 medium orange (131g)"
    },
    classes: ["orange"]
  },
  {
    name: "Pizza",
    nutritionPer100g: {
      calories: 266,
      protein: 11,
      carbs: 33,
      fat: 10,
      serving: "1 slice (107g)"
    },
    classes: ["pizza", "slice of pizza", "pizza slice", "pepperoni pizza"]
  },
  {
    name: "Hamburger",
    nutritionPer100g: {
      calories: 295,
      protein: 17,
      carbs: 30,
      fat: 14,
      serving: "1 burger (110g)"
    },
    classes: ["hamburger", "burger", "cheeseburger"]
  },
  {
    name: "French Fries",
    nutritionPer100g: {
      calories: 312,
      protein: 3.4,
      carbs: 41,
      fat: 15,
      serving: "Regular serving (117g)"
    },
    classes: ["french fries", "fries", "chips"]
  },
  {
    name: "Salad",
    nutritionPer100g: {
      calories: 20,
      protein: 1.2,
      carbs: 3.3,
      fat: 0.2,
      serving: "1 cup (67g)"
    },
    classes: ["salad", "green salad", "garden salad", "caesar salad"]
  },
  {
    name: "Ice Cream",
    nutritionPer100g: {
      calories: 207,
      protein: 3.5,
      carbs: 24,
      fat: 11,
      serving: "1 scoop (68g)"
    },
    classes: ["ice cream", "vanilla ice cream", "chocolate ice cream"]
  },
  {
    name: "Steak",
    nutritionPer100g: {
      calories: 271,
      protein: 25,
      carbs: 0,
      fat: 19,
      serving: "1 serving (85g)"
    },
    classes: ["steak", "beef steak", "meat"]
  },
  {
    name: "Sushi",
    nutritionPer100g: {
      calories: 145,
      protein: 5.8,
      carbs: 27,
      fat: 0.7,
      serving: "1 roll (100g)"
    },
    classes: ["sushi", "maki", "sushi roll"]
  },
  {
    name: "Chocolate",
    nutritionPer100g: {
      calories: 546,
      protein: 4.9,
      carbs: 60,
      fat: 31,
      serving: "1 bar (43g)"
    },
    classes: ["chocolate", "chocolate bar", "dark chocolate", "milk chocolate"]
  },
  {
    name: "Bread",
    nutritionPer100g: {
      calories: 265,
      protein: 9.4,
      carbs: 49,
      fat: 3.2,
      serving: "1 slice (30g)"
    },
    classes: ["bread", "white bread", "bread loaf", "toast"]
  },
  {
    name: "Pasta",
    nutritionPer100g: {
      calories: 158,
      protein: 5.8,
      carbs: 31,
      fat: 0.9,
      serving: "1 cup cooked (140g)"
    },
    classes: ["pasta", "spaghetti", "noodles", "macaroni"]
  },
  {
    name: "Coffee",
    nutritionPer100g: {
      calories: 2,
      protein: 0.1,
      carbs: 0,
      fat: 0,
      serving: "1 cup (240ml)"
    },
    classes: ["coffee", "cup of coffee", "coffee cup", "espresso"]
  },
  {
    name: "Rice",
    nutritionPer100g: {
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      serving: "1 cup cooked (158g)"
    },
    classes: ["rice", "white rice", "rice bowl", "fried rice"]
  }
];

/**
 * Find the nutrition information for a food item based on the classifier result
 * @param classifierResult The label returned from the image classifier
 * @returns The matching food item or undefined if no match is found
 */
export const findFoodByClass = (classifierResult: string): FoodItem | undefined => {
  // Normalize the classifier result (lowercase)
  const normalizedResult = classifierResult.toLowerCase();
  
  // Try to find an exact match first
  return nutritionData.find(food => 
    food.classes.some(cls => normalizedResult.includes(cls.toLowerCase()))
  );
};
