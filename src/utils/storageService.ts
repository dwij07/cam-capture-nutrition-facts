
import { MealEntry } from "@/components/MealLog";
import { v4 as uuidv4 } from 'uuid';

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'lose' | 'maintain' | 'gain';
  calorieGoal: number;
}

const PROFILE_KEY = 'nutrition-app-profile';
const MEAL_LOG_KEY = 'nutrition-app-meal-log';

// Save user profile to localStorage
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

// Load user profile from localStorage
export const loadUserProfile = (): UserProfile | null => {
  const profileJson = localStorage.getItem(PROFILE_KEY);
  if (!profileJson) return null;
  
  try {
    return JSON.parse(profileJson) as UserProfile;
  } catch (error) {
    console.error('Error parsing profile data:', error);
    return null;
  }
};

// Get meal log for a specific date
export const getMealLogForDate = (date: Date): MealEntry[] => {
  const dateString = formatDateKey(date);
  const mealLogJson = localStorage.getItem(`${MEAL_LOG_KEY}-${dateString}`);
  
  if (!mealLogJson) return [];
  
  try {
    return JSON.parse(mealLogJson) as MealEntry[];
  } catch (error) {
    console.error('Error parsing meal log data:', error);
    return [];
  }
};

// Add meal to log for a specific date
export const addMealToLog = (meal: Omit<MealEntry, 'id'>, date: Date): MealEntry => {
  const dateString = formatDateKey(date);
  const meals = getMealLogForDate(date);
  
  const newMeal: MealEntry = {
    ...meal,
    id: uuidv4(),
  };
  
  meals.push(newMeal);
  localStorage.setItem(`${MEAL_LOG_KEY}-${dateString}`, JSON.stringify(meals));
  
  return newMeal;
};

// Update meal in log
export const updateMealInLog = (mealId: string, updatedMeal: Partial<MealEntry>, date: Date): boolean => {
  const dateString = formatDateKey(date);
  const meals = getMealLogForDate(date);
  
  const mealIndex = meals.findIndex(meal => meal.id === mealId);
  if (mealIndex === -1) return false;
  
  meals[mealIndex] = {
    ...meals[mealIndex],
    ...updatedMeal
  };
  
  localStorage.setItem(`${MEAL_LOG_KEY}-${dateString}`, JSON.stringify(meals));
  return true;
};

// Delete meal from log
export const deleteMealFromLog = (mealId: string, date: Date): boolean => {
  const dateString = formatDateKey(date);
  let meals = getMealLogForDate(date);
  
  const initialLength = meals.length;
  meals = meals.filter(meal => meal.id !== mealId);
  
  if (meals.length === initialLength) return false;
  
  localStorage.setItem(`${MEAL_LOG_KEY}-${dateString}`, JSON.stringify(meals));
  return true;
};

// Get last 7 days of meal logs
export const getWeeklyMealLog = (): { date: Date; meals: MealEntry[] }[] => {
  const today = new Date();
  const result = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    result.push({
      date: date,
      meals: getMealLogForDate(date)
    });
  }
  
  return result;
};

// Calculate total nutrition for a day
export const calculateDailyNutrition = (date: Date) => {
  const meals = getMealLogForDate(date);
  
  return meals.reduce((total, meal) => {
    return {
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      carbs: total.carbs + meal.carbs,
      fat: total.fat + meal.fat
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
};

// Calculate weekly nutrition data for charting
export const calculateWeeklyNutrition = () => {
  const weeklyData = getWeeklyMealLog();
  
  return weeklyData.map(day => {
    const nutrition = day.meals.reduce((total, meal) => {
      return {
        calories: total.calories + meal.calories,
        protein: total.protein + meal.protein,
        carbs: total.carbs + meal.carbs,
        fat: total.fat + meal.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    return {
      day: formatDayName(day.date),
      ...nutrition
    };
  }).reverse(); // Reverse so earliest day comes first
};

// Format date to YYYY-MM-DD for storage
const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format date to day name for display
const formatDayName = (date: Date): string => {
  return date.toLocaleDateString(undefined, { weekday: 'short' });
};
