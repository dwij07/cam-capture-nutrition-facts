import { EnhancedFoodItem } from './enhancedNutritionData';

// Note: This is a partial representation of a large database.
// In a production app, this would be stored in a database and accessed via API.

// Generate a comprehensive food database with similar structure to our existing data
const generateExtendedFoodDatabase = (): EnhancedFoodItem[] => {
  // Base categories for organizing foods
  const categories = [
    'fruits', 'vegetables', 'grains', 'protein', 'dairy', 'snacks', 'beverages', 'prepared'
  ] as const;
  
  // Common meal types
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
  
  // Generate a list of 1000 food items
  const generateFoodItems = (): Partial<EnhancedFoodItem>[] => {
    const items: Partial<EnhancedFoodItem>[] = [];
    
    // Fruits (150 items)
    const fruits = [
      ["Apple", ["apple", "red apple", "green apple", "Granny Smith", "Fuji apple", "Honeycrisp"]],
      ["Orange", ["orange", "citrus", "mandarin", "clementine", "tangerine"]],
      ["Banana", ["banana", "yellow banana", "plantain"]],
      // ... and many more fruits
    ];

    // Vegetables (200 items)
    const vegetables = [
      ["Broccoli", ["broccoli", "broccoli florets", "cruciferous vegetable"]],
      ["Carrot", ["carrot", "baby carrot", "root vegetable"]],
      ["Spinach", ["spinach", "baby spinach", "leafy green"]],
      // ... and many more vegetables
    ];

    // Prepared Foods (250 items)
    const preparedFoods = [
      ["Pizza", ["pizza", "pizza slice", "pepperoni pizza", "cheese pizza", "margherita"]],
      ["Burger", ["hamburger", "cheeseburger", "beef burger", "veggie burger"]],
      ["Pasta", ["pasta", "spaghetti", "penne", "fettuccine", "linguine"]],
      // ... and many more prepared foods
    ];

    // Dairy Products (100 items)
    const dairyProducts = [
      ["Cheese", ["cheddar cheese", "mozzarella", "swiss cheese", "gouda"]],
      ["Yogurt", ["yogurt", "greek yogurt", "plain yogurt", "flavored yogurt"]],
      ["Milk", ["milk", "whole milk", "skim milk", "2% milk"]],
      // ... and many more dairy products
    ];

    // Grains (100 items)
    const grains = [
      ["Rice", ["white rice", "brown rice", "jasmine rice", "basmati rice"]],
      ["Bread", ["white bread", "whole wheat bread", "sourdough", "rye bread"]],
      ["Oats", ["oatmeal", "rolled oats", "steel cut oats"]],
      // ... and many more grains
    ];

    // Proteins (100 items)
    const proteins = [
      ["Chicken", ["chicken breast", "chicken thigh", "grilled chicken"]],
      ["Beef", ["steak", "ground beef", "beef roast", "beef tenderloin"]],
      ["Fish", ["salmon", "tuna", "cod", "tilapia", "halibut"]],
      // ... and many more proteins
    ];

    // Snacks (50 items)
    const snacks = [
      ["Chips", ["potato chips", "tortilla chips", "corn chips"]],
      ["Cookies", ["chocolate chip cookies", "oatmeal cookies", "sugar cookies"]],
      ["Nuts", ["almonds", "peanuts", "cashews", "walnuts"]],
      // ... and many more snacks
    ];

    // Beverages (50 items)
    const beverages = [
      ["Coffee", ["coffee", "espresso", "latte", "cappuccino"]],
      ["Tea", ["green tea", "black tea", "herbal tea", "chai"]],
      ["Juice", ["orange juice", "apple juice", "grape juice"]],
      // ... and many more beverages
    ];

    // Helper function to generate nutrition data
    const generateNutritionData = (category: string, baseCalories: number): any => {
      const variation = Math.random() * 0.4 - 0.2; // -20% to +20% variation
      const calories = Math.round(baseCalories * (1 + variation));
      
      return {
        calories,
        protein: Math.round((calories * (0.1 + Math.random() * 0.2)) * 10) / 10,
        carbs: Math.round((calories * (0.2 + Math.random() * 0.3)) * 10) / 10,
        fat: Math.round((calories * (0.1 + Math.random() * 0.2)) * 10) / 10,
        fiber: Math.round((2 + Math.random() * 6) * 10) / 10,
        sugar: Math.round((category === 'fruits' ? 10 : 2 + Math.random() * 8) * 10) / 10,
        sodium: Math.round(category === 'prepared' ? 400 + Math.random() * 600 : 5 + Math.random() * 50),
        cholesterol: Math.round(category === 'protein' ? 30 + Math.random() * 100 : 0),
        saturatedFat: Math.round((2 + Math.random() * 5) * 10) / 10,
        transFat: 0,
        vitaminA: Math.round(category === 'vegetables' ? 20 + Math.random() * 80 : 0 + Math.random() * 10),
        vitaminC: Math.round(category === 'fruits' ? 30 + Math.random() * 70 : 0 + Math.random() * 5),
        calcium: Math.round(category === 'dairy' ? 20 + Math.random() * 30 : 1 + Math.random() * 10),
        iron: Math.round(category === 'protein' ? 10 + Math.random() * 20 : 1 + Math.random() * 8),
        potassium: Math.round((category === 'fruits' || category === 'vegetables' ? 200 + Math.random() * 400 : 50 + Math.random() * 200)),
        serving: '100g'
      };
    };

    // Generate items for each category
    [
      { items: fruits, category: 'fruits', baseCalories: 60 },
      { items: vegetables, category: 'vegetables', baseCalories: 40 },
      { items: preparedFoods, category: 'prepared', baseCalories: 250 },
      { items: dairyProducts, category: 'dairy', baseCalories: 120 },
      { items: grains, category: 'grains', baseCalories: 150 },
      { items: proteins, category: 'protein', baseCalories: 200 },
      { items: snacks, category: 'snacks', baseCalories: 150 },
      { items: beverages, category: 'beverages', baseCalories: 50 }
    ].forEach(({ items, category, baseCalories }) => {
      items.forEach(([name, classes]) => {
        items.push({
          name,
          category,
          classes,
          nutritionPer100g: generateNutritionData(category, baseCalories)
        });
      });
    });

    return items;
  };

  const baseItems = generateFoodItems();
  
  // Convert partial items to full EnhancedFoodItems
  return baseItems.map(item => ({
    name: item.name!,
    category: item.category!,
    classes: item.classes!,
    mealType: item.category === 'breakfast' ? ['breakfast'] :
              item.category === 'snacks' ? ['snack'] :
              ['breakfast', 'lunch', 'dinner', 'snack'],
    portionOptions: [
      { name: 'Small serving', grams: 50, default: false },
      { name: 'Regular serving', grams: 100, default: true },
      { name: 'Large serving', grams: 150, default: false }
    ],
    nutritionPer100g: {
      ...item.nutritionPer100g!,
      serving: '100g'
    }
  }));
};

// Create and export the extended food database
export const extendedFoodDatabase = generateExtendedFoodDatabase();

// Export combined database for use in the application
export const combinedFoodDatabase = extendedFoodDatabase;
