
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, LogOut, Info, Search, 
  Cherry, Apple, Banana, Carrot, 
  Leaf, Sun, Snowflake, CloudRain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InnovativeFeatureCard from "@/components/InnovativeFeatureCard";

// Example seasonal foods database
const seasonalFoods = {
  spring: [
    {
      name: "Asparagus",
      nutritionalBenefits: "High in folate, fiber, and antioxidants.",
      icon: <Leaf className="h-12 w-12 text-green-500" />,
      badges: ["Vitamin K", "Folate", "Fiber"]
    },
    {
      name: "Strawberries",
      nutritionalBenefits: "Rich in vitamin C and manganese.",
      icon: <Cherry className="h-12 w-12 text-red-500" />,
      badges: ["Vitamin C", "Antioxidants", "Low-Calorie"]
    },
    {
      name: "Peas",
      nutritionalBenefits: "Good source of plant-based protein and fiber.",
      icon: <Leaf className="h-12 w-12 text-green-500" />,
      badges: ["Protein", "Fiber", "Vitamin A"]
    }
  ],
  summer: [
    {
      name: "Tomatoes",
      nutritionalBenefits: "Contain lycopene, which may reduce cancer risk.",
      icon: <Cherry className="h-12 w-12 text-red-500" />,
      badges: ["Lycopene", "Vitamin C", "Potassium"]
    },
    {
      name: "Watermelon",
      nutritionalBenefits: "Hydrating with high water content and citrulline.",
      icon: <Cherry className="h-12 w-12 text-pink-500" />,
      badges: ["Hydrating", "Vitamin A", "Lycopene"]
    },
    {
      name: "Corn",
      nutritionalBenefits: "Contains fiber, vitamins, and antioxidants.",
      icon: <Banana className="h-12 w-12 text-yellow-500" />,
      badges: ["Fiber", "Antioxidants", "B Vitamins"]
    }
  ],
  fall: [
    {
      name: "Apples",
      nutritionalBenefits: "Rich in fiber and various antioxidants.",
      icon: <Apple className="h-12 w-12 text-red-500" />,
      badges: ["Fiber", "Vitamin C", "Antioxidants"]
    },
    {
      name: "Pumpkin",
      nutritionalBenefits: "High in vitamin A and antioxidants.",
      icon: <Banana className="h-12 w-12 text-orange-500" />,
      badges: ["Vitamin A", "Fiber", "Potassium"]
    },
    {
      name: "Brussels Sprouts",
      nutritionalBenefits: "Packed with vitamins K and C.",
      icon: <Carrot className="h-12 w-12 text-green-500" />,
      badges: ["Vitamin K", "Vitamin C", "Fiber"]
    }
  ],
  winter: [
    {
      name: "Citrus Fruits",
      nutritionalBenefits: "Excellent source of vitamin C and flavonoids.",
      icon: <Apple className="h-12 w-12 text-yellow-500" />,
      badges: ["Vitamin C", "Folate", "Potassium"]
    },
    {
      name: "Kale",
      nutritionalBenefits: "Nutrient-dense with vitamins A, K, and C.",
      icon: <Leaf className="h-12 w-12 text-green-500" />,
      badges: ["Vitamin K", "Vitamin A", "Calcium"]
    },
    {
      name: "Sweet Potatoes",
      nutritionalBenefits: "Rich in beta-carotene and fiber.",
      icon: <Carrot className="h-12 w-12 text-orange-500" />,
      badges: ["Vitamin A", "Fiber", "Potassium"]
    }
  ]
};

// Get current season (for Northern Hemisphere)
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
};

interface FoodCardProps {
  name: string;
  nutritionalBenefits: string;
  icon: React.ReactNode;
  badges: string[];
}

const FoodCard: React.FC<FoodCardProps> = ({ name, nutritionalBenefits, icon, badges }) => {
  return (
    <InnovativeFeatureCard
      title={name}
      description={nutritionalBenefits}
      icon={icon}
      badges={badges}
    />
  );
};

const SeasonalFoodsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSeason, setCurrentSeason] = useState(getCurrentSeason());
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter foods based on search term
  const filteredFoods = searchTerm 
    ? Object.values(seasonalFoods).flat().filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.nutritionalBenefits.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.badges.some(badge => badge.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : seasonalFoods[currentSeason as keyof typeof seasonalFoods];

  const seasonIcons = {
    spring: <CloudRain className="h-6 w-6 text-blue-500" />,
    summer: <Sun className="h-6 w-6 text-yellow-500" />,
    fall: <Leaf className="h-6 w-6 text-orange-500" />,
    winter: <Snowflake className="h-6 w-6 text-blue-300" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with back button, about, and logout */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/info")}
            className="mr-4 text-green-700 hover:text-green-800 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/about")}
              className="border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
            >
              <Info className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-400">About</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-400">Logout</span>
            </Button>
          </div>
        </div>
        
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Seasonal Foods
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Discover foods that are currently in season for maximum nutrition, flavor, and sustainability.
            Eating seasonally can provide more nutrients and support local agriculture.
          </p>
        </motion.div>
        
        {/* Search bar */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for foods, nutrients, or seasons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800 focus:border-green-400 dark:focus:border-green-600"
          />
        </div>
        
        {/* Season tabs */}
        {!searchTerm && (
          <Tabs defaultValue={currentSeason} onValueChange={(value) => setCurrentSeason(value)} className="mb-8">
            <TabsList className="grid grid-cols-4 max-w-md mx-auto bg-green-100/50 dark:bg-green-900/30">
              <TabsTrigger value="spring" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-200 data-[state=active]:to-blue-200 data-[state=active]:dark:from-green-800/50 data-[state=active]:dark:to-blue-800/50">
                {seasonIcons.spring} Spring
              </TabsTrigger>
              <TabsTrigger value="summer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-200 data-[state=active]:to-orange-200 data-[state=active]:dark:from-yellow-800/50 data-[state=active]:dark:to-orange-800/50">
                {seasonIcons.summer} Summer
              </TabsTrigger>
              <TabsTrigger value="fall" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-200 data-[state=active]:to-red-200 data-[state=active]:dark:from-orange-800/50 data-[state=active]:dark:to-red-800/50">
                {seasonIcons.fall} Fall
              </TabsTrigger>
              <TabsTrigger value="winter" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-200 data-[state=active]:to-purple-200 data-[state=active]:dark:from-blue-800/50 data-[state=active]:dark:to-purple-800/50">
                {seasonIcons.winter} Winter
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        {/* Season description */}
        {!searchTerm && (
          <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {currentSeason === "spring" && (
                  <>
                    {seasonIcons.spring}
                    <h2 className="text-xl font-semibold ml-2 text-blue-600 dark:text-blue-400">Spring Foods (March-May)</h2>
                  </>
                )}
                {currentSeason === "summer" && (
                  <>
                    {seasonIcons.summer}
                    <h2 className="text-xl font-semibold ml-2 text-yellow-600 dark:text-yellow-400">Summer Foods (June-August)</h2>
                  </>
                )}
                {currentSeason === "fall" && (
                  <>
                    {seasonIcons.fall}
                    <h2 className="text-xl font-semibold ml-2 text-orange-600 dark:text-orange-400">Fall Foods (September-November)</h2>
                  </>
                )}
                {currentSeason === "winter" && (
                  <>
                    {seasonIcons.winter}
                    <h2 className="text-xl font-semibold ml-2 text-blue-500 dark:text-blue-400">Winter Foods (December-February)</h2>
                  </>
                )}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300">
                {currentSeason === "spring" && "Spring brings tender, leafy vegetables like lettuce, spinach, and other early produce that's perfect for lighter meals."}
                {currentSeason === "summer" && "Summer's abundance includes juicy fruits, crisp vegetables, and berries packed with nutrients and natural sweetness."}
                {currentSeason === "fall" && "Fall features hearty root vegetables, crisp apples, and nutrient-dense foods that help prepare for winter."}
                {currentSeason === "winter" && "Winter offers citrus fruits rich in vitamin C, hardy greens, and root vegetables that store well and provide essential nutrients."}
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Foods grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {searchTerm ? (
            filteredFoods.length > 0 ? (
              filteredFoods.map((food, index) => (
                <motion.div
                  key={`${food.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <FoodCard {...food} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-600 dark:text-gray-400">No foods found matching "{searchTerm}". Try another search term.</p>
              </div>
            )
          ) : (
            seasonalFoods[currentSeason as keyof typeof seasonalFoods].map((food, index) => (
              <motion.div
                key={`${food.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <FoodCard {...food} />
              </motion.div>
            ))
          )}
        </div>
        
        {/* Benefits section */}
        <Card className="mb-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              Benefits of Eating Seasonally
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-green-700 dark:text-green-400 flex items-center">
                  <Leaf className="h-5 w-5 mr-2" />
                  Better Nutrition
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Seasonal foods are harvested at peak ripeness, offering maximum nutritional value and flavor.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-700 dark:text-blue-400 flex items-center">
                  <CloudRain className="h-5 w-5 mr-2" />
                  Environmental Benefits
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Eating seasonally reduces carbon footprint by minimizing transportation and storage requirements.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-orange-700 dark:text-orange-400 flex items-center">
                  <Sun className="h-5 w-5 mr-2" />
                  Enhanced Flavor
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Fruits and vegetables grown and harvested in their natural season taste better and have superior texture.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeasonalFoodsPage;
