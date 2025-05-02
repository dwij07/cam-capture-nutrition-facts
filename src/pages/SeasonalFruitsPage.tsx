
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, LogOut, Info, Search, 
  Apple, Cherry, Banana, Grape, Citrus, Nut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InnovativeFeatureCard from "@/components/InnovativeFeatureCard";

// Example seasonal fruits database
const seasonalFruits = {
  spring: [
    {
      name: "Strawberries",
      nutritionalBenefits: "Rich in vitamin C and manganese.",
      icon: <Cherry className="h-12 w-12 text-red-500" />,
      badges: ["Vitamin C", "Antioxidants", "Low-Calorie"]
    },
    {
      name: "Cherries",
      nutritionalBenefits: "High in antioxidants and anti-inflammatory compounds.",
      icon: <Cherry className="h-12 w-12 text-red-600" />,
      badges: ["Antioxidants", "Melatonin", "Anti-inflammatory"]
    },
    {
      name: "Apricots",
      nutritionalBenefits: "Good source of vitamin A and potassium.",
      icon: <Apple className="h-12 w-12 text-orange-400" />,
      badges: ["Vitamin A", "Potassium", "Fiber"]
    }
  ],
  summer: [
    {
      name: "Watermelon",
      nutritionalBenefits: "Hydrating with high water content and citrulline.",
      icon: <Cherry className="h-12 w-12 text-pink-500" />,
      badges: ["Hydrating", "Vitamin A", "Lycopene"]
    },
    {
      name: "Peaches",
      nutritionalBenefits: "Rich in vitamins and minerals, supports digestive health.",
      icon: <Apple className="h-12 w-12 text-orange-300" />,
      badges: ["Vitamin C", "Fiber", "Potassium"]
    },
    {
      name: "Blueberries",
      nutritionalBenefits: "Packed with antioxidants and known to improve brain function.",
      icon: <Cherry className="h-12 w-12 text-blue-600" />,
      badges: ["Antioxidants", "Vitamin K", "Brain Health"]
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
      name: "Grapes",
      nutritionalBenefits: "Contains resveratrol which may benefit heart health.",
      icon: <Grape className="h-12 w-12 text-purple-500" />,
      badges: ["Antioxidants", "Resveratrol", "Vitamin K"]
    },
    {
      name: "Pears",
      nutritionalBenefits: "Good source of fiber and contains antioxidants.",
      icon: <Apple className="h-12 w-12 text-green-300" />,
      badges: ["Fiber", "Vitamin C", "Copper"]
    }
  ],
  winter: [
    {
      name: "Oranges",
      nutritionalBenefits: "Excellent source of vitamin C and flavonoids.",
      icon: <Citrus className="h-12 w-12 text-orange-500" />,
      badges: ["Vitamin C", "Folate", "Potassium"]
    },
    {
      name: "Grapefruit",
      nutritionalBenefits: "High in nutrients and beneficial plant compounds.",
      icon: <Citrus className="h-12 w-12 text-pink-300" />,
      badges: ["Vitamin C", "Vitamin A", "Antioxidants"]
    },
    {
      name: "Pomegranate",
      nutritionalBenefits: "Rich in antioxidants, supports heart health.",
      icon: <Cherry className="h-12 w-12 text-red-600" />,
      badges: ["Antioxidants", "Vitamin K", "Potassium"]
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

interface FruitCardProps {
  name: string;
  nutritionalBenefits: string;
  icon: React.ReactNode;
  badges: string[];
}

const FruitCard: React.FC<FruitCardProps> = ({ name, nutritionalBenefits, icon, badges }) => {
  return (
    <InnovativeFeatureCard
      title={name}
      description={nutritionalBenefits}
      icon={icon}
      badges={badges}
    />
  );
};

const SeasonalFruitsPage: React.FC = () => {
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

  // Filter fruits based on search term
  const filteredFruits = searchTerm 
    ? Object.values(seasonalFruits).flat().filter(fruit => 
        fruit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fruit.nutritionalBenefits.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fruit.badges.some(badge => badge.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : seasonalFruits[currentSeason as keyof typeof seasonalFruits];

  const seasonIcons = {
    spring: <Cherry className="h-6 w-6 text-pink-400" />,
    summer: <Banana className="h-6 w-6 text-yellow-500" />,
    fall: <Apple className="h-6 w-6 text-orange-500" />,
    winter: <Citrus className="h-6 w-6 text-orange-300" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with back button, about, and logout */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/info")}
            className="mr-4 text-orange-700 hover:text-orange-800 hover:bg-orange-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-900/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/about")}
              className="border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-900/20"
            >
              <Info className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-700 dark:text-orange-400">About</span>
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Seasonal Fruits
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Discover fruits that are currently in season for maximum nutrition, flavor, and enjoyment.
            Eating seasonal fruits provides more nutrients and supports sustainable agriculture.
          </p>
        </motion.div>
        
        {/* Search bar */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for fruits, nutrients, or seasons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800 focus:border-orange-400 dark:focus:border-orange-600"
          />
        </div>
        
        {/* Season tabs */}
        {!searchTerm && (
          <Tabs defaultValue={currentSeason} onValueChange={(value) => setCurrentSeason(value)} className="mb-8">
            <TabsList className="grid grid-cols-4 max-w-md mx-auto bg-orange-100/50 dark:bg-orange-900/30">
              <TabsTrigger value="spring" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-200 data-[state=active]:to-orange-200 data-[state=active]:dark:from-pink-800/50 data-[state=active]:dark:to-orange-800/50">
                {seasonIcons.spring} Spring
              </TabsTrigger>
              <TabsTrigger value="summer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-200 data-[state=active]:to-orange-200 data-[state=active]:dark:from-yellow-800/50 data-[state=active]:dark:to-orange-800/50">
                {seasonIcons.summer} Summer
              </TabsTrigger>
              <TabsTrigger value="fall" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-200 data-[state=active]:to-red-200 data-[state=active]:dark:from-orange-800/50 data-[state=active]:dark:to-red-800/50">
                {seasonIcons.fall} Fall
              </TabsTrigger>
              <TabsTrigger value="winter" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-200 data-[state=active]:to-purple-200 data-[state=active]:dark:from-orange-800/50 data-[state=active]:dark:to-purple-800/50">
                {seasonIcons.winter} Winter
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        {/* Season description */}
        {!searchTerm && (
          <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {currentSeason === "spring" && (
                  <>
                    {seasonIcons.spring}
                    <h2 className="text-xl font-semibold ml-2 text-pink-600 dark:text-pink-400">Spring Fruits (March-May)</h2>
                  </>
                )}
                {currentSeason === "summer" && (
                  <>
                    {seasonIcons.summer}
                    <h2 className="text-xl font-semibold ml-2 text-yellow-600 dark:text-yellow-400">Summer Fruits (June-August)</h2>
                  </>
                )}
                {currentSeason === "fall" && (
                  <>
                    {seasonIcons.fall}
                    <h2 className="text-xl font-semibold ml-2 text-orange-600 dark:text-orange-400">Fall Fruits (September-November)</h2>
                  </>
                )}
                {currentSeason === "winter" && (
                  <>
                    {seasonIcons.winter}
                    <h2 className="text-xl font-semibold ml-2 text-orange-500 dark:text-orange-400">Winter Fruits (December-February)</h2>
                  </>
                )}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300">
                {currentSeason === "spring" && "Spring brings sweet berries and early harvest fruits that are rich in antioxidants and perfect for fresh snacking."}
                {currentSeason === "summer" && "Summer offers juicy, hydrating fruits packed with nutrients and natural sweetness - perfect for hot days."}
                {currentSeason === "fall" && "Fall features crisp apples, sweet grapes, and nutrient-dense fruits that help boost immunity for winter."}
                {currentSeason === "winter" && "Winter offers citrus fruits rich in vitamin C and immune-boosting properties to keep you healthy during cold months."}
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Fruits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {searchTerm ? (
            filteredFruits.length > 0 ? (
              filteredFruits.map((fruit, index) => (
                <motion.div
                  key={`${fruit.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <FruitCard {...fruit} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-600 dark:text-gray-400">No fruits found matching "{searchTerm}". Try another search term.</p>
              </div>
            )
          ) : (
            seasonalFruits[currentSeason as keyof typeof seasonalFruits].map((fruit, index) => (
              <motion.div
                key={`${fruit.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <FruitCard {...fruit} />
              </motion.div>
            ))
          )}
        </div>
        
        {/* Benefits section */}
        <Card className="mb-8 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-orange-200 dark:border-orange-700">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-orange-700 to-red-700 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Benefits of Eating Seasonal Fruits
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-orange-700 dark:text-orange-400 flex items-center">
                  <Apple className="h-5 w-5 mr-2" />
                  Better Nutrition
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Seasonal fruits are harvested at peak ripeness, offering maximum nutritional value and flavor.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center">
                  <Banana className="h-5 w-5 mr-2" />
                  Environmental Benefits
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Eating seasonal fruits reduces carbon footprint by minimizing transportation and storage requirements.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-pink-700 dark:text-pink-400 flex items-center">
                  <Cherry className="h-5 w-5 mr-2" />
                  Enhanced Flavor
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Fruits grown and harvested in their natural season taste better and have superior texture and sweetness.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeasonalFruitsPage;
