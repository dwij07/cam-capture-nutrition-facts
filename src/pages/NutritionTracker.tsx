
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DietPlan from "@/components/DietPlan";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Example diet plan data
const sampleDietPlan = {
  id: "1",
  name: "Balanced Nutrition Plan",
  description: "A well-balanced diet with optimal macronutrient distribution for general health.",
  totalCalories: 2200,
  macros: {
    protein: 110,
    carbs: 275,
    fat: 73
  },
  days: [
    {
      breakfast: {
        name: "Morning Boost",
        foods: [
          {
            name: "Oatmeal with Berries",
            portion: "1 bowl (250g)",
            calories: 350,
            protein: 12,
            carbs: 60,
            fat: 8,
            isVegetarian: true
          },
          {
            name: "Greek Yogurt",
            portion: "150g",
            calories: 150,
            protein: 15,
            carbs: 6,
            fat: 5,
            isVegetarian: true
          }
        ],
        totalCalories: 500
      },
      lunch: {
        name: "Midday Power",
        foods: [
          {
            name: "Grilled Chicken Breast",
            portion: "150g",
            calories: 250,
            protein: 35,
            carbs: 0,
            fat: 10,
            isVegetarian: false
          },
          {
            name: "Mixed Vegetables",
            portion: "200g",
            calories: 80,
            protein: 4,
            carbs: 15,
            fat: 0,
            isVegetarian: true
          },
          {
            name: "Brown Rice",
            portion: "150g",
            calories: 170,
            protein: 4,
            carbs: 35,
            fat: 1,
            isVegetarian: true
          }
        ],
        totalCalories: 500
      },
      dinner: {
        name: "Evening Nourishment",
        foods: [
          {
            name: "Baked Salmon",
            portion: "150g",
            calories: 280,
            protein: 30,
            carbs: 0,
            fat: 18,
            isVegetarian: false
          },
          {
            name: "Quinoa",
            portion: "100g",
            calories: 120,
            protein: 4,
            carbs: 21,
            fat: 2,
            isVegetarian: true
          },
          {
            name: "Steamed Asparagus",
            portion: "100g",
            calories: 40,
            protein: 4,
            carbs: 4,
            fat: 0,
            isVegetarian: true
          }
        ],
        totalCalories: 440
      },
      snacks: {
        name: "Healthy Snacks",
        foods: [
          {
            name: "Almonds",
            portion: "30g",
            calories: 180,
            protein: 6,
            carbs: 6,
            fat: 15,
            isVegetarian: true
          },
          {
            name: "Apple",
            portion: "1 medium",
            calories: 95,
            protein: 0,
            carbs: 25,
            fat: 0,
            isVegetarian: true
          }
        ],
        totalCalories: 275
      }
    }
  ]
};

const NutritionTracker: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          setUser(userData.user);
        } else {
          // No active session, redirect to auth page
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6">Nutrition Tracker</h1>
        
        <Tabs defaultValue="diet-plan">
          <TabsList className="mb-8">
            <TabsTrigger value="diet-plan">Diet Plans</TabsTrigger>
            <TabsTrigger value="meal-analyzer">Meal Analyzer</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="diet-plan">
            <DietPlan dietPlan={sampleDietPlan} />
          </TabsContent>
          
          <TabsContent value="meal-analyzer">
            <Card>
              <CardHeader>
                <CardTitle>Meal Analyzer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Upload a photo of your meal to analyze its nutritional content.</p>
                <div className="flex flex-col gap-4">
                  <Button>Upload Photo</Button>
                  <Button variant="outline">Take Photo</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Track your nutrition and diet progress over time.</p>
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Progress charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default NutritionTracker;
