
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Camera, BarChart, Award, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// Testimonials data
const testimonials = [
  {
    name: "Sarah J.",
    image: "/placeholder.svg",
    role: "Fitness Enthusiast",
    content: "NutriTrack changed how I approach my meals. The AI analysis makes tracking so simple!"
  },
  {
    name: "Michael T.",
    image: "/placeholder.svg",
    role: "Busy Professional",
    content: "I've lost 15 pounds in 3 months just by being more aware of what I eat. This app made it possible."
  },
  {
    name: "Priya K.",
    image: "/placeholder.svg",
    role: "Nutrition Coach",
    content: "I recommend NutriTrack to all my clients. The detailed breakdowns and progress tracking are unmatched."
  }
];

// Stats for animated counters
const stats = [
  { value: 10000, label: "Active Users" },
  { value: 500000, label: "Meals Tracked" },
  { value: 250000, label: "Goals Achieved" }
];

const AboutPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [counts, setCounts] = useState(stats.map(() => 0));

  // Animation for counters
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prevCounts => 
        prevCounts.map((count, i) => {
          const target = stats[i].value;
          const increment = Math.ceil(target / 30);
          if (count < target) {
            return Math.min(count + increment, target);
          }
          return count;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Back button */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                Your intelligent companion for healthier eating habits and nutritional awareness.
              </motion.p>
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

        {/* Animated stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {counts[index].toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
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
              
              {/* Step 2 */}
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
              
              {/* Step 3 */}
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
              
              {/* Step 4 */}
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

        {/* Testimonials section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-purple-600 dark:text-purple-400">
            What Our Users Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 p-1 rounded-xl"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic flex-grow">"{testimonial.content}"</p>
                </div>
              </motion.div>
            ))}
          </div>
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
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default AboutPage;
