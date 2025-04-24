
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, ChartBar, LayoutDashboard, Utensils, LogOut, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import EnhancedNutritionDisplay from "@/components/EnhancedNutritionDisplay";
import { ExtendedPredictionResult } from "@/utils/enhancedModelService";
import { EnhancedFoodItem, calculateNutritionForPortion, getDefaultPortion } from "@/data/enhancedNutritionData";
import { addMealToLog } from "@/utils/storageService";
import { MealEntry } from "@/components/MealLog";

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
  >
    <Link to={to}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Icon className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          NutriTrack Features
        </h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
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
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
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
      </div>

      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4">Why Track Your Nutrition?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium">Better Health Decisions</h3>
            <p className="text-muted-foreground">Make informed choices about your diet by understanding exactly what you're eating.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Achieve Your Goals</h3>
            <p className="text-muted-foreground">Whether you're looking to lose weight, gain muscle, or maintain a balanced diet.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Track Progress</h3>
            <p className="text-muted-foreground">Monitor your nutritional intake and see how your habits change over time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionInfo;
