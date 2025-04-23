
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Trophy, Star, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: 'protein' | 'streak' | 'calories' | 'carbs' | 'variety';
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

interface GamificationProps {
  streakDays: number;
  achievements: UserAchievement[];
}

const GamificationFeatures: React.FC<GamificationProps> = ({
  streakDays,
  achievements
}) => {
  // Show a goal reminder
  const showGoalReminder = () => {
    toast({
      title: "Daily Goal Reminder",
      description: "You still need 20g of protein to reach your daily goal!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Nutrition Streaks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Flame className="h-12 w-12 text-orange-500" />
                </motion.div>
                <motion.div 
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {streakDays}
                </motion.div>
              </div>
              <div>
                <h3 className="font-medium text-lg">{streakDays} Day Streak!</h3>
                <p className="text-sm text-muted-foreground">
                  You've logged your meals for {streakDays} consecutive days
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={showGoalReminder}
            >
              Today's Goals
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Nutrition Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.03 }}
                className={`relative rounded-lg border p-3 ${
                  achievement.earned ? "bg-primary/10 border-primary/30" : "bg-muted/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {achievement.earned ? (
                    <div className="bg-primary/20 rounded-full p-2">
                      {achievement.icon === 'streak' && <Flame className="h-6 w-6 text-orange-500" />}
                      {achievement.icon === 'protein' && <Trophy className="h-6 w-6 text-yellow-500" />}
                      {achievement.icon === 'calories' && <Check className="h-6 w-6 text-green-500" />}
                      {achievement.icon === 'carbs' && <Star className="h-6 w-6 text-blue-500" />}
                      {achievement.icon === 'variety' && <Star className="h-6 w-6 text-purple-500" />}
                    </div>
                  ) : (
                    <div className="bg-muted rounded-full p-2">
                      {achievement.icon === 'streak' && <Flame className="h-6 w-6 text-muted-foreground" />}
                      {achievement.icon === 'protein' && <Trophy className="h-6 w-6 text-muted-foreground" />}
                      {achievement.icon === 'calories' && <Check className="h-6 w-6 text-muted-foreground" />}
                      {achievement.icon === 'carbs' && <Star className="h-6 w-6 text-muted-foreground" />}
                      {achievement.icon === 'variety' && <Star className="h-6 w-6 text-muted-foreground" />}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-sm">{achievement.name}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    
                    {(achievement.progress !== undefined && achievement.maxProgress) && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1 text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </p>
                      </div>
                    )}
                  </div>
                  {achievement.earned && (
                    <Badge className="absolute top-1 right-1 bg-primary text-[10px] h-4">
                      Earned
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Import Button in the right place
import { Button } from "@/components/ui/button";

export default GamificationFeatures;
