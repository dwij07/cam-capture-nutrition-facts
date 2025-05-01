import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Utensils, Camera, BarChart, Award, ArrowLeft, ArrowRight, 
  Sparkles, CloudRain, Users, LeafIcon, ListCheck, Compass, LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import InnovativeFeatureCard from "@/components/InnovativeFeatureCard";

// Coming soon features
const comingSoonFeatures = [
  {
    title: "AI Meal Recommendations",
    description: "Get personalized meal suggestions based on your past eating habits and preferences.",
    icon: <Sparkles className="h-12 w-12 text-purple-500" />,
    badges: ["AI-Powered", "Personalized"]
  },
  {
    title: "Food Waste Tracker",
    description: "Track and reduce your food waste with smart reminders and tips.",
    icon: <CloudRain className="h-12 w-12 text-green-500" />,
    badges: ["Eco-Friendly", "Sustainability"]
  },
  {
    title: "Community Challenges",
    description: "Join weekly and monthly health challenges with the NutriTrack community.",
    icon: <Users className="h-12 w-12 text-blue-500" />,
    badges: ["Social", "Motivational"]
  },
  {
    title: "Nutrition Habit Streaks",
    description: "Build healthy habits with streak tracking and achievement rewards.",
    icon: <ListCheck className="h-12 w-12 text-orange-500" />,
    badges: ["Gamification", "Consistency"]
  }
];

// FAQs
const faqs = [
  {
    question: "How accurate is the food recognition?",
    answer: "Our AI model can recognize thousands of different foods with over 90% accuracy based on our data. For best results, take clear photos in good lighting."
  },
  {
    question: "Can I track meals without taking photos?",
    answer: "Yes! While our photo recognition is a key feature, you can also manually log your meals using our extensive food database search."
  },
  {
    question: "Is my data private?",
    answer: "Absolutely. Your nutrition data and photos are stored securely and never shared with third parties. You have full control over your privacy settings."
  },
  {
    question: "Can I set custom nutrition goals?",
    answer: "Yes, NutriTrack lets you set personalized goals based on your dietary preferences, allergies, and health objectives."
  },
  {
    question: "Is there a premium version?",
    answer: "We offer both free and premium tiers. The premium subscription includes advanced analytics, unlimited meal history, and priority access to new features."
  }
];

const AboutPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Back button and logout */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/info")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Hero section with animation */}
        <div className="relative overflow-hidden rounded-3xl mb-16 bg-gradient-to-r from-gradient-start to-gradient-end p-1">
          <div className="absolute inset-0">
            <div className="wave-animation"></div>
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-16 z-10 bg-white/10 backdrop-blur-sm rounded-3xl">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              >
                Welcome to NutriTrack
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
              >
                Your intelligent companion for healthier eating habits and nutritional awareness.
              </motion.p>
              <Button 
                onClick={() => navigate("/info")}
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Now
                <ArrowRight className="ml-2" />
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 md:mt-0"
            >
              <img 
                src="/placeholder.svg" 
                alt="Healthy Eating Mascot" 
                className="w-48 md:w-64 h-auto drop-shadow-xl"
              />
            </motion.div>
          </div>
        </div>

        {/* What We Do section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 dark:bg-gray-800/80 dark:border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-purple-700 dark:text-purple-400">What We Do</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                NutriTrack is your intelligent food companion that helps you track and understand your nutrition intake. 
                Simply take a photo of your food, and our AI technology will analyze it, providing you with detailed 
                nutritional information instantly. We make healthy eating simple, informed, and personalized to your needs.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features section as a process flow */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-blue-700 dark:text-blue-400">How NutriTrack Works</h2>
          
          <div className="relative">
            {/* Connection line between steps */}
            {!isMobile && (
              <div className="absolute left-1/2 top-24 h-[calc(100%-100px)] w-1 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></div>
            )}
            
            <div className="grid gap-12">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 flex justify-center">
                  <div className="bg-soft-purple rounded-full p-6 relative z-10">
                    <Camera className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <HoverCard>
                    <HoverCardTrigger>
                      <Card className="hover:scale-105 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-bold mb-2">Snap Your Food</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Simply take a photo of your meal with our app's camera.
                          </p>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      Our advanced image recognition works with all types of meals and lighting conditions.
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </motion.div>
              
              {/* Steps 2-4 */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col md:flex-row-reverse items-center"
              >
                <div className="md:w-1/2 flex justify-center">
                  <div className="bg-soft-green rounded-full p-6 relative z-10">
                    <Utensils className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <HoverCard>
                    <HoverCardTrigger>
                      <Card className="hover:scale-105 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-bold mb-2">Get Instant Analysis</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Our AI identifies your food and provides nutritional breakdown.
                          </p>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      We analyze calories, macronutrients, vitamins, and more with incredible accuracy.
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 flex justify-center">
                  <div className="bg-soft-yellow rounded-full p-6 relative z-10">
                    <BarChart className="h-12 w-12 text-yellow-600" />
                  </div>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <HoverCard>
                    <HoverCardTrigger>
                      <Card className="hover:scale-105 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Monitor your nutrition habits with intuitive charts and insights.
                          </p>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      Visualize your progress and get personalized recommendations for better nutrition.
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col md:flex-row-reverse items-center"
              >
                <div className="md:w-1/2 flex justify-center">
                  <div className="bg-soft-orange rounded-full p-6 relative z-10">
                    <Award className="h-12 w-12 text-orange-600" />
                  </div>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <HoverCard>
                    <HoverCardTrigger>
                      <Card className="hover:scale-105 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-bold mb-2">Achieve Your Goals</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Earn rewards and achievements as you maintain healthy habits.
                          </p>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      Stay motivated with our gamified system that celebrates your nutrition victories.
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-purple-600 dark:text-purple-400">
            Coming Soon
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {comingSoonFeatures.map((feature, index) => (
              <InnovativeFeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                badges={feature.badges}
                comingSoon={true}
              />
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-blue-600 dark:text-blue-400">
            Frequently Asked Questions
          </h2>
          
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-90"></div>
            <div className="relative z-10 py-16 px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Nutrition?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of users who've improved their health with data-driven nutrition insights.
              </p>
              <Button 
                onClick={() => navigate("/info")}
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
              >
                Get Started Now
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add wave animation styles */}
      <style>
        {`
        .wave-animation {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            -45deg,
            rgba(238, 119, 252, 0.1),
            rgba(153, 119, 250, 0.1),
            rgba(83, 145, 241, 0.1)
          );
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        `}
      </style>
    </div>
  );
};

export default AboutPage;
