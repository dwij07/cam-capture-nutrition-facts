
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface InnovativeFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  badges?: string[];
  comingSoon?: boolean;
}

const InnovativeFeatureCard: React.FC<InnovativeFeatureCardProps> = ({
  title,
  description,
  icon,
  badges = [],
  comingSoon = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-md">
        <div className="p-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg h-full">
            <div className="p-5 flex items-start">
              <div className="mr-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 p-3 rounded-lg">
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  {comingSoon && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{description}</p>
                
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default InnovativeFeatureCard;
