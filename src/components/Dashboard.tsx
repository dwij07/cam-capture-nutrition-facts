
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

interface DashboardProps {
  dailyNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  weeklyData: {
    day: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  calorieGoal: number;
}

const Dashboard: React.FC<DashboardProps> = ({ dailyNutrition, weeklyData, calorieGoal }) => {
  // Prepare data for pie chart
  const macroData = [
    { name: 'Protein', value: dailyNutrition.protein * 4, color: '#8B5CF6' },
    { name: 'Carbs', value: dailyNutrition.carbs * 4, color: '#0EA5E9' },
    { name: 'Fat', value: dailyNutrition.fat * 9, color: '#F97316' }
  ];

  const COLORS = ['#8B5CF6', '#0EA5E9', '#F97316'];
  
  // Calculate percentage of calorie goal
  const caloriePercentage = Math.min(100, Math.round((dailyNutrition.calories / calorieGoal) * 100));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Calories Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Daily Calories</CardTitle>
          <CardDescription>
            {dailyNutrition.calories} / {calorieGoal} kcal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${caloriePercentage}%` }} 
            />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {caloriePercentage}% of daily goal
          </div>
        </CardContent>
      </Card>
      
      {/* Macronutrients Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Macronutrients</CardTitle>
          <CardDescription>
            Calorie breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[150px]">
            <ChartContainer 
              className="h-full" 
              config={{
                protein: { theme: { light: '#8B5CF6', dark: '#c4b5fd' }, label: 'Protein' },
                carbs: { theme: { light: '#0EA5E9', dark: '#7dd3fc' }, label: 'Carbs' },
                fat: { theme: { light: '#F97316', dark: '#fdba74' }, label: 'Fat' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <div>Protein: {dailyNutrition.protein}g</div>
            <div>Carbs: {dailyNutrition.carbs}g</div>
            <div>Fat: {dailyNutrition.fat}g</div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>Weekly Trends</CardTitle>
          <CardDescription>
            Last 7 days of nutrition tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer 
              className="h-full" 
              config={{
                calories: { theme: { light: '#8B5CF6', dark: '#c4b5fd' }, label: 'Calories' }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calories" fill="#8B5CF6" name="Calories" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
