
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Camera, BarChart, Award, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/info")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Welcome to NutriTrack
        </h1>

        <div className="flex justify-center mb-8">
          <Button
            onClick={() => navigate("/info")}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Get Started
          </Button>
        </div>

        <div className="grid gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 dark:bg-gray-800/80 dark:border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-purple-700 dark:text-purple-400">What We Do</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                NutriTrack is your intelligent food companion that helps you track and understand your nutrition intake. 
                Simply take a photo of your food, and our AI technology will analyze it, providing you with detailed 
                nutritional information instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 dark:bg-gray-800/80 dark:border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg dark:bg-gray-700">
                  <Camera className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-semibold mb-2">Food Recognition</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Advanced AI technology to identify food from photos
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg dark:bg-gray-700">
                  <BarChart className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-semibold mb-2">Progress Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Monitor your nutrition goals with easy-to-read charts
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg dark:bg-gray-700">
                  <Award className="h-6 w-6 text-yellow-600 mb-2" />
                  <h3 className="font-semibold mb-2">Achievements</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Earn rewards for maintaining healthy eating habits
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg dark:bg-gray-700">
                  <Utensils className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-semibold mb-2">Nutritional Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Detailed breakdown of nutrients and calories
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
