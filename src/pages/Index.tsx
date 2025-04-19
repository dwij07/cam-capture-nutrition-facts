
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import CameraCapture from "@/components/CameraCapture";
import EnhancedNutritionDisplay from "@/components/EnhancedNutritionDisplay";
import { recognizeFood, ExtendedPredictionResult } from "@/utils/enhancedModelService";
import { 
  EnhancedFoodItem, 
  calculateNutritionForPortion,
  getDefaultPortion,
  calculateTDEE,
  generateDietPlan
} from "@/data/enhancedNutritionData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Camera, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MealEntry } from "@/components/MealLog";
import MealLog from "@/components/MealLog";
import Dashboard from "@/components/Dashboard";
import ProfileForm from "@/components/ProfileForm";
import DietPlan, { DietPlanInfo } from "@/components/DietPlan";
import { Button } from "@/components/ui/button";
import { 
  addMealToLog, 
  calculateDailyNutrition, 
  calculateWeeklyNutrition,
  deleteMealFromLog, 
  getMealLogForDate,
  loadUserProfile, 
  saveUserProfile, 
  updateMealInLog 
} from "@/utils/storageService";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  // State for food recognition
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognizedFood, setRecognizedFood] = useState<{
    food: EnhancedFoodItem;
    confidence: number;
    alternatives: ExtendedPredictionResult[];
  } | null>(null);
  
  // State for user profile and nutrition data
  const [activeTab, setActiveTab] = useState("camera");
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [profile, setProfile] = useState<{
    age: number;
    gender: 'male' | 'female' | 'other';
    weight: number;
    height: number;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
    goal: 'lose' | 'maintain' | 'gain';
    calorieGoal: number;
  } | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlanInfo | null>(null);
  
  // Load user data on component mount
  useEffect(() => {
    // Load user profile
    const savedProfile = loadUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
    
    // Load meals for today
    refreshMeals();
  }, []);
  
  // Refresh meals when selected date changes
  useEffect(() => {
    refreshMeals();
  }, [selectedDate]);
  
  const refreshMeals = () => {
    const todaysMeals = getMealLogForDate(selectedDate);
    setMeals(todaysMeals);
  };

  // Handle image selection from the ImageUpload component
  const handleImageSelected = async (imageElement: HTMLImageElement) => {
    setIsProcessing(true);
    setError(null);
    setRecognizedFood(null);
    
    try {
      // Classify the image using the enhanced model
      const predictions = await recognizeFood(imageElement);
      
      if (predictions && predictions.length > 0) {
        // Find the top prediction with a matched food
        const topMatch = predictions.find(p => p.matchedFood);
        
        if (topMatch?.matchedFood) {
          // Get alternatives excluding the top match
          const alternatives = predictions
            .filter(p => p.matchedFood && p.matchedFood.name !== topMatch.matchedFood.name);
          
          setRecognizedFood({
            food: topMatch.matchedFood,
            confidence: topMatch.probability,
            alternatives
          });
          
          // Switch to results tab
          setActiveTab("results");
        } else {
          setError("No matching food found. Please try another image.");
        }
      } else {
        setError("No predictions returned. Please try again with a clearer image.");
      }
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle adding recognized food to meal log
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
    
    addMealToLog(newMeal, selectedDate);
    refreshMeals();
    
    toast({
      title: "Meal Added",
      description: `${recognizedFood.food.name} added to your meal log.`
    });
    
    // Switch to tracker tab
    setActiveTab("tracker");
  };
  
  // Handle selecting alternative food
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
  
  // Handle saving user profile
  const handleSaveProfile = (profileData: any) => {
    // Calculate TDEE based on profile data
    const calorieGoal = calculateTDEE(profileData);
    
    const newProfile = {
      ...profileData,
      calorieGoal
    };
    
    setProfile(newProfile);
    saveUserProfile(newProfile);
    
    // Generate diet plan based on profile
    const newDietPlan = generateDietPlan(profileData, calorieGoal);
    setDietPlan(newDietPlan);
    
    toast({
      title: "Profile Saved",
      description: `Your daily calorie goal is set to ${calorieGoal} calories.`
    });
  };
  
  // Handle deleting a meal
  const handleDeleteMeal = (id: string) => {
    deleteMealFromLog(id, selectedDate);
    refreshMeals();
    
    toast({
      title: "Meal Deleted",
      description: "The meal has been removed from your log."
    });
  };
  
  // Calculate nutrition data for the dashboard
  const dailyNutrition = calculateDailyNutrition(selectedDate);
  const weeklyData = calculateWeeklyNutrition();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      
      <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="camera">
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="tracker">
            Track
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="plan">
            Diet Plan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Upload Photo</h2>
                <ImageUpload 
                  onImageSelected={handleImageSelected}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Take Photo</h2>
                <CameraCapture 
                  onCapture={handleImageSelected}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
          </div>
          
          {isProcessing && (
            <div className="flex justify-center items-center mt-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-primary font-medium">
                Analyzing image...
              </span>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="results" className="mt-0">
          {!isProcessing && !error && recognizedFood && (
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
          )}
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("camera")}
              className="mr-2"
            >
              Take Another Photo
            </Button>
            <Button onClick={handleAddToMealLog}>
              Add to Meal Log
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="tracker" className="mt-0">
          <MealLog 
            meals={meals} 
            onAddMeal={() => setActiveTab("camera")}
            onDeleteMeal={handleDeleteMeal}
          />
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => setActiveTab("camera")}>
              <Camera className="h-4 w-4 mr-2" />
              Add Food with Camera
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="dashboard" className="mt-0">
          {profile ? (
            <>
              <Dashboard 
                dailyNutrition={dailyNutrition}
                weeklyData={weeklyData}
                calorieGoal={profile.calorieGoal}
              />
              
              <div className="mt-8">
                <Button variant="outline" onClick={() => setActiveTab("profile")}>
                  Update Profile
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Profile Not Set</h3>
              <p className="text-muted-foreground mb-6">
                Please set up your profile to see personalized dashboard and recommendations.
              </p>
              <Button onClick={() => setActiveTab("profile")}>
                Set Up Profile
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="profile" className="mt-0">
          <ProfileForm 
            onSaveProfile={handleSaveProfile}
            initialData={profile || {}}
          />
        </TabsContent>
        
        <TabsContent value="plan" className="mt-0">
          {dietPlan ? (
            <DietPlan dietPlan={dietPlan} />
          ) : profile ? (
            <div className="text-center py-10">
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Creating Your Plan</h3>
              <p className="text-muted-foreground mb-6">
                We're generating a personalized diet plan based on your profile.
              </p>
              <Button onClick={() => {
                const newDietPlan = generateDietPlan(profile, profile.calorieGoal);
                setDietPlan(newDietPlan);
              }}>
                Generate Diet Plan
              </Button>
            </div>
          ) : (
            <div className="text-center py-10">
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Profile Not Set</h3>
              <p className="text-muted-foreground mb-6">
                Please set up your profile to generate a personalized diet plan.
              </p>
              <Button onClick={() => setActiveTab("profile")}>
                Set Up Profile
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 text-sm text-center text-muted-foreground">
        <p>This application uses on-device machine learning with TensorFlow.js.</p>
        <p>No images are sent to any server - all processing happens directly in your browser.</p>
      </div>
    </div>
  );
};

export default Index;
