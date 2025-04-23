
import React, { useState, useEffect } from "react";
import { Search, Plus, Check, Barcode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { nutritionData, FoodItem } from "@/data/nutritionData";
import { MealEntry } from "@/components/MealLog";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";

interface FoodSearchProps {
  onAddFood: (food: Omit<MealEntry, 'id'>) => void;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ onAddFood }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingSize, setServingSize] = useState<number>(1);
  const [mealType, setMealType] = useState<MealEntry['mealType']>("snack");
  const [customCalories, setCustomCalories] = useState<string>("");
  const [isCustomEntry, setIsCustomEntry] = useState(false);
  const [customFoodName, setCustomFoodName] = useState("");
  const [barcodeMode, setBarcodeMode] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  
  // Search for foods when search term changes
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    const results = nutritionData.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
  }, [searchTerm]);
  
  // Handle selecting a food
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setIsCustomEntry(false);
  };
  
  // Handle adding selected food to meal log
  const handleAddFood = () => {
    if (isCustomEntry) {
      if (!customFoodName.trim()) {
        toast({
          title: "Food name required",
          description: "Please enter a name for your custom food",
          variant: "destructive"
        });
        return;
      }
      
      const calories = parseInt(customCalories) || 0;
      if (calories <= 0) {
        toast({
          title: "Invalid calories",
          description: "Please enter a valid calorie value",
          variant: "destructive"
        });
        return;
      }
      
      // Create custom food entry
      onAddFood({
        foodName: customFoodName,
        mealType,
        servingSize: "1 serving",
        calories,
        protein: 0, // Default values for custom entry
        carbs: 0,
        fat: 0,
        timestamp: new Date().toISOString()
      });
      
      // Reset form
      setCustomFoodName("");
      setCustomCalories("");
      setIsCustomEntry(false);
      
      toast({
        title: "Food added successfully",
        description: `${customFoodName} added to your ${mealType} log`,
      });
    } else if (selectedFood) {
      // Calculate nutrition based on serving size
      const multiplier = servingSize;
      const nutrition = {
        calories: Math.round(selectedFood.nutritionPer100g.calories * multiplier),
        protein: Math.round(selectedFood.nutritionPer100g.protein * multiplier * 10) / 10,
        carbs: Math.round(selectedFood.nutritionPer100g.carbs * multiplier * 10) / 10,
        fat: Math.round(selectedFood.nutritionPer100g.fat * multiplier * 10) / 10
      };
      
      onAddFood({
        foodName: selectedFood.name,
        mealType,
        servingSize: `${servingSize} serving${servingSize > 1 ? 's' : ''}`,
        ...nutrition,
        timestamp: new Date().toISOString()
      });
      
      // Reset form
      setSelectedFood(null);
      setServingSize(1);
      setSearchTerm("");
      setSearchResults([]);
      
      toast({
        title: "Food added successfully",
        description: `${selectedFood.name} added to your ${mealType} log`,
      });
    }
  };
  
  // Handle barcode scan (mock implementation)
  const handleBarcodeScan = () => {
    if (!barcodeInput) {
      toast({
        title: "Enter barcode",
        description: "Please enter a barcode number",
        variant: "destructive"
      });
      return;
    }
    
    // This would normally connect to a barcode database API
    // For demo purposes, we'll simulate finding a product
    toast({
      title: "Scanning barcode...",
      description: `Looking up product with barcode: ${barcodeInput}`,
    });
    
    // Simulate API delay
    setTimeout(() => {
      // Mock response - in a real app, this would come from an API
      if (barcodeInput === "123456789") {
        const mockFood: FoodItem = {
          name: "Scanned Protein Bar",
          nutritionPer100g: {
            calories: 350,
            protein: 20,
            carbs: 30,
            fat: 12,
            serving: "1 bar (50g)"
          },
          classes: ["protein bar"]
        };
        
        setSelectedFood(mockFood);
        setBarcodeMode(false);
      } else {
        toast({
          title: "Product not found",
          description: "Try entering food details manually",
          variant: "destructive"
        });
      }
    }, 1500);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Food Search & Manual Entry</span>
          {!barcodeMode && (
            <Button variant="outline" size="sm" onClick={() => setBarcodeMode(true)}>
              <Barcode className="h-4 w-4 mr-2" />
              Scan Barcode
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {barcodeMode ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Enter barcode number..." 
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
              />
              <Button size="sm" onClick={handleBarcodeScan}>Scan</Button>
              <Button size="sm" variant="ghost" onClick={() => setBarcodeMode(false)}>Cancel</Button>
            </div>
            <p className="text-sm text-muted-foreground">Enter a barcode number to search for product</p>
            <p className="text-xs text-muted-foreground">(Try "123456789" for a demo product)</p>
          </div>
        ) : isCustomEntry ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Food Name</label>
              <Input 
                placeholder="Enter food name..." 
                value={customFoodName}
                onChange={(e) => setCustomFoodName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Calories</label>
              <Input 
                type="number" 
                placeholder="Enter calories..." 
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={handleAddFood}>Add Food</Button>
              <Button variant="outline" onClick={() => setIsCustomEntry(false)}>Cancel</Button>
            </div>
          </div>
        ) : selectedFood ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{selectedFood.name}</h3>
              <Badge variant="outline">{selectedFood.nutritionPer100g.calories} kcal/serving</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Serving Size</label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setServingSize(prev => Math.max(0.5, prev - 0.5))}
                    disabled={servingSize <= 0.5}
                  >
                    -
                  </Button>
                  <div className="w-16 text-center">{servingSize}</div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setServingSize(prev => prev + 0.5)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Meal Type</label>
                <Select value={mealType} onValueChange={(value: MealEntry['mealType']) => setMealType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-2 border rounded-md text-center">
                <div className="font-medium">Protein</div>
                <div>{(selectedFood.nutritionPer100g.protein * servingSize).toFixed(1)}g</div>
              </div>
              <div className="p-2 border rounded-md text-center">
                <div className="font-medium">Carbs</div>
                <div>{(selectedFood.nutritionPer100g.carbs * servingSize).toFixed(1)}g</div>
              </div>
              <div className="p-2 border rounded-md text-center">
                <div className="font-medium">Fat</div>
                <div>{(selectedFood.nutritionPer100g.fat * servingSize).toFixed(1)}g</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={handleAddFood}>Add Food</Button>
              <Button variant="outline" onClick={() => setSelectedFood(null)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-9" 
                placeholder="Search for a food..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {searchResults.length > 0 ? (
              <div className="border rounded-md max-h-60 overflow-y-auto">
                {searchResults.map(food => (
                  <div 
                    key={food.name}
                    className="p-2 hover:bg-accent cursor-pointer flex justify-between items-center border-b last:border-b-0"
                    onClick={() => handleSelectFood(food)}
                  >
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-xs text-muted-foreground">{food.nutritionPer100g.serving}</div>
                    </div>
                    <div className="text-sm">{food.nutritionPer100g.calories} kcal</div>
                  </div>
                ))}
              </div>
            ) : searchTerm.trim().length >= 2 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No results found</p>
                <Button variant="link" size="sm" onClick={() => setIsCustomEntry(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add custom food
                </Button>
              </div>
            ) : null}
            
            <Button className="w-full" onClick={() => setIsCustomEntry(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Food Entry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodSearch;
