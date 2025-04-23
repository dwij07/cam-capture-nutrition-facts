
import { v4 as uuidv4 } from "uuid";
import { UserAchievement } from "@/components/GamificationFeatures";
import { MealEntry } from "@/components/MealLog";

// Local storage keys
const STREAK_KEY = "nutrition-app-streak";
const ACHIEVEMENTS_KEY = "nutrition-app-achievements";
const LAST_LOG_DATE_KEY = "nutrition-app-last-log";

// Get current streak days
export const getStreakDays = (): number => {
  const storedStreak = localStorage.getItem(STREAK_KEY);
  return storedStreak ? parseInt(storedStreak) : 0;
};

// Update streak based on meal logging
export const updateStreak = () => {
  const lastLogDate = localStorage.getItem(LAST_LOG_DATE_KEY);
  const today = new Date().toISOString().split('T')[0];
  
  if (!lastLogDate) {
    // First time logging
    localStorage.setItem(STREAK_KEY, "1");
    localStorage.setItem(LAST_LOG_DATE_KEY, today);
    return 1;
  }
  
  // Check if last log was yesterday
  const lastDate = new Date(lastLogDate);
  const todayDate = new Date(today);
  const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let streak = parseInt(localStorage.getItem(STREAK_KEY) || "0");
  
  if (today === lastLogDate) {
    // Already logged today, streak stays the same
    return streak;
  } else if (diffDays === 1 || 
            (lastDate.getDay() === 5 && todayDate.getDay() === 1)) { // Friday to Monday case
    // Next day or Monday after Friday, increment streak
    streak += 1;
    localStorage.setItem(STREAK_KEY, streak.toString());
    localStorage.setItem(LAST_LOG_DATE_KEY, today);
  } else if (diffDays > 1) {
    // Broke the streak
    streak = 1;
    localStorage.setItem(STREAK_KEY, "1");
    localStorage.setItem(LAST_LOG_DATE_KEY, today);
  }
  
  // Update achievements based on streak
  checkAndUpdateAchievements();
  
  return streak;
};

// Initialize default achievements if not already in storage
export const initializeAchievements = (): UserAchievement[] => {
  const storedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY);
  
  if (storedAchievements) {
    return JSON.parse(storedAchievements);
  }
  
  const defaultAchievements: UserAchievement[] = [
    {
      id: uuidv4(),
      name: "Consistency Champion",
      description: "Log your meals for 7 consecutive days",
      icon: "streak",
      earned: false,
      progress: 0,
      maxProgress: 7
    },
    {
      id: uuidv4(),
      name: "Protein Pro",
      description: "Consume at least 60g of protein for 5 days",
      icon: "protein",
      earned: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: uuidv4(),
      name: "Calorie Conscious",
      description: "Stay within your calorie goal for 3 days",
      icon: "calories",
      earned: false,
      progress: 0,
      maxProgress: 3
    },
    {
      id: uuidv4(),
      name: "Carb Controller",
      description: "Keep carbs under 150g for 5 days",
      icon: "carbs",
      earned: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: uuidv4(),
      name: "Diverse Diet",
      description: "Log 10 different foods in a week",
      icon: "variety",
      earned: false,
      progress: 0,
      maxProgress: 10
    },
  ];
  
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaultAchievements));
  return defaultAchievements;
};

// Get user achievements
export const getAchievements = (): UserAchievement[] => {
  return initializeAchievements();
};

// Check and update achievements based on user actions
export const checkAndUpdateAchievements = (): UserAchievement[] => {
  const achievements = getAchievements();
  const streak = getStreakDays();
  
  // Update streak-based achievement
  const streakAchievement = achievements.find(a => a.name === "Consistency Champion");
  if (streakAchievement && !streakAchievement.earned) {
    streakAchievement.progress = Math.min(streak, streakAchievement.maxProgress!);
    if (streakAchievement.progress >= streakAchievement.maxProgress!) {
      streakAchievement.earned = true;
    }
  }
  
  // Save updated achievements
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  return achievements;
};

// Update nutrition-based achievements
export const updateNutritionAchievements = (meals: MealEntry[], calorieGoal: number): UserAchievement[] => {
  const achievements = getAchievements();
  
  // Calculate daily totals
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const uniqueFoods = new Set(meals.map(meal => meal.foodName)).size;
  
  // Update protein achievement
  const proteinAchievement = achievements.find(a => a.name === "Protein Pro");
  if (proteinAchievement && !proteinAchievement.earned && totalProtein >= 60) {
    proteinAchievement.progress = Math.min((proteinAchievement.progress || 0) + 1, proteinAchievement.maxProgress!);
    if (proteinAchievement.progress >= proteinAchievement.maxProgress!) {
      proteinAchievement.earned = true;
    }
  }
  
  // Update calorie achievement
  const calorieAchievement = achievements.find(a => a.name === "Calorie Conscious");
  if (calorieAchievement && !calorieAchievement.earned && 
      totalCalories <= calorieGoal && totalCalories > 0) {
    calorieAchievement.progress = Math.min((calorieAchievement.progress || 0) + 1, calorieAchievement.maxProgress!);
    if (calorieAchievement.progress >= calorieAchievement.maxProgress!) {
      calorieAchievement.earned = true;
    }
  }
  
  // Update carbs achievement
  const carbsAchievement = achievements.find(a => a.name === "Carb Controller");
  if (carbsAchievement && !carbsAchievement.earned && totalCarbs <= 150 && totalCarbs > 0) {
    carbsAchievement.progress = Math.min((carbsAchievement.progress || 0) + 1, carbsAchievement.maxProgress!);
    if (carbsAchievement.progress >= carbsAchievement.maxProgress!) {
      carbsAchievement.earned = true;
    }
  }
  
  // Update food variety achievement
  const varietyAchievement = achievements.find(a => a.name === "Diverse Diet");
  if (varietyAchievement && !varietyAchievement.earned) {
    varietyAchievement.progress = Math.min(uniqueFoods, varietyAchievement.maxProgress!);
    if (varietyAchievement.progress >= varietyAchievement.maxProgress!) {
      varietyAchievement.earned = true;
    }
  }
  
  // Save updated achievements
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  return achievements;
};
