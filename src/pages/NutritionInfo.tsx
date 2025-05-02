
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, ChartBar, LayoutDashboard, Utensils, LogOut, Trophy, Info, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import EnhancedNutritionDisplay from "@/components/EnhancedNutritionDisplay";
import { ExtendedPredictionResult } from "@/utils/enhancedModelService";
import { EnhancedFoodItem, calculateNutritionForPortion, getDefaultPortion } from "@/data/enhancedNutritionData";
import { addMealToLog } from "@/utils/storageService";
import { MealEntry } from "@/components/MealLog";
import InnovativeFeatureCard from "@/components/InnovativeFeatureCard";

interface RecognizedFood {
  food: EnhancedFoodItem;
  confidence: number;
  alternatives: ExtendedPredictionResult[];
}

const FeatureCard = ({ title, icon: Icon, description, to }: { 
  title: string; 
  icon: React.ComponentType<any>;
  description: string;
  to: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="h-full"
  >
    <Link to={to}>
      <Card className="h-full bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 transition-all duration-300 border-0">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
              <Icon className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-700 to-blue-700 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

const NutritionInfo = () => {
  const navigate = useNavigate();
  const [recognizedFood, setRecognizedFood] = useState<RecognizedFood | null>(null);

  useEffect(() => {
    // Get the recognized food from sessionStorage when the component mounts
    const storedFood = sessionStorage.getItem('recognizedFood');
    if (storedFood) {
      setRecognizedFood(JSON.parse(storedFood));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  const handleAddToMealLog = () => {
    if (!recognizedFood) return;
    
    const defaultPortion = getDefaultPortion(recognizedFood.food);
    const nutrition = calculateNutritionForPortion(
      recognizedFood.food, 
      defaultPortion.grams
    );
    
    const newMeal: Omit<MealEntry, 'id'> = {
      foodName: recognizedFood.food.name,
      mealType: (recognizedFood.food.mealType.includes('snack') ? 'snack' : 
               (new Date().getHours() < 11 ? 'breakfast' : 
                new Date().getHours() < 15 ? 'lunch' : 'dinner')) as MealEntry['mealType'],
      servingSize: defaultPortion.name,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      timestamp: new Date().toISOString()
    };
    
    addMealToLog(newMeal, new Date());
    
    toast({
      title: "Meal Added",
      description: `${recognizedFood.food.name} added to your meal log.`
    });
    
    // Navigate to tracker page
    navigate("/tracker");
  };

  const handleSelectAlternative = (index: number) => {
    if (!recognizedFood || !recognizedFood.alternatives[index].matchedFood) return;
    
    const alternative = recognizedFood.alternatives[index];
    setRecognizedFood({
      food: alternative.matchedFood!,
      confidence: alternative.probability,
      alternatives: [
        ...recognizedFood.alternatives.slice(0, index),
        ...recognizedFood.alternatives.slice(index + 1)
      ]
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-gradient-to-br from-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          NutriTrack Features
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/about")} className="border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20">
            <Info className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-700 dark:text-purple-400">About</span>
          </Button>
          <Button variant="outline" onClick={handleLogout} className="border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20">
            <LogOut className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-400">Logout</span>
          </Button>
        </div>
      </div>

      {recognizedFood ? (
        <div className="mb-8">
          <EnhancedNutritionDisplay 
            foodName={recognizedFood.food.name}
            confidence={recognizedFood.confidence}
            nutrition={recognizedFood.food.nutritionPer100g}
            onAddToMealLog={handleAddToMealLog}
            alternativeOptions={recognizedFood.alternatives.map((alt, index) => ({
              foodName: alt.matchedFood!.name,
              confidence: alt.probability,
              onSelect: () => handleSelectAlternative(index)
            }))}
          />
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/camera")}
              className="mr-2"
            >
              Take Another Photo
            </Button>
            <Button onClick={handleAddToMealLog}>
              Add to Meal Log
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xl text-gradient-primary bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center max-w-3xl mx-auto font-medium">
            Discover the power of nutrition tracking with our comprehensive suite of tools.
            Track your meals, analyze nutritional content, and make informed decisions about your diet.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          title="Camera Capture"
          icon={Camera}
          description="Take photos of your meals to instantly analyze their nutritional content using advanced AI technology."
          to="/camera"
        />
        <FeatureCard
          title="Nutrition Tracking"
          icon={ChartBar}
          description="Keep detailed logs of your meals and track your nutritional intake over time with intuitive visualizations."
          to="/tracker"
        />
        <FeatureCard
          title="Dashboard Analytics"
          icon={LayoutDashboard}
          description="View comprehensive analytics of your nutritional habits and progress towards your health goals."
          to="/dashboard"
        />
        <FeatureCard
          title="Personalized Diet Plan"
          icon={Utensils}
          description="Get customized diet recommendations based on your nutritional needs and preferences."
          to="/plan"
        />
        <FeatureCard
          title="Achievements"
          icon={Trophy}
          description="Track your progress and earn achievements as you maintain healthy eating habits."
          to="/achievements"
        />
        <FeatureCard
          title="Seasonal Foods"
          icon={Calendar}
          description="Discover what foods are in season now and learn about their unique nutritional benefits."
          to="/seasonal-fruits"
        />
      </div>

      <div className="bg-gradient-to-r from-purple-300 via-purple-200 to-blue-200 dark:from-purple-900/50 dark:via-purple-800/40 dark:to-blue-900/40 p-8 rounded-2xl shadow-lg mb-10 backdrop-blur-sm border border-purple-100 dark:border-purple-800/30 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-700 to-blue-700 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">Why Track Your Nutrition?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="space-y-2 bg-white/60 dark:bg-gray-800/60 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100 dark:border-purple-800/30"
          >
            <h3 className="font-medium text-purple-700 dark:text-purple-400">Better Health Decisions</h3>
            <p className="text-gray-600 dark:text-gray-300">Make informed choices about your diet by understanding exactly what you're eating.</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="space-y-2 bg-white/60 dark:bg-gray-800/60 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 dark:border-blue-800/30"
          >
            <h3 className="font-medium text-blue-700 dark:text-blue-400">Achieve Your Goals</h3>
            <p className="text-gray-600 dark:text-gray-300">Whether you're looking to lose weight, gain muscle, or maintain a balanced diet.</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="space-y-2 bg-white/60 dark:bg-gray-800/60 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-100 dark:border-indigo-800/30"
          >
            <h3 className="font-medium text-indigo-700 dark:text-indigo-400">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">Monitor your nutritional intake and see how your habits change over time.</p>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 p-6 rounded-xl shadow-md border border-pink-100 dark:border-pink-800/30 text-center mb-8"
      >
        <h3 className="font-bold text-xl mb-2 text-pink-800 dark:text-pink-300">Did You Know?</h3>
        <p className="text-gray-700 dark:text-gray-300">People who track their meals consistently are 3x more likely to reach their health goals!</p>
      </motion.div>
    </div>
  );
};

export default NutritionInfo;
