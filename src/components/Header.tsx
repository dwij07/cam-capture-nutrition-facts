
import React from "react";
import { Camera, LogOut, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const navigate = useNavigate();

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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800/50 dark:to-gray-700/50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-purple-400 to-blue-500 p-2 rounded-lg shadow-md">
            <Camera className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">NutriTrack</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/about" 
            className="flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors font-medium"
          >
            <Info className="h-4 w-4 mr-1" />
            About
          </Link>
          
          <Link 
            to="/seasonal-fruits" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
          >
            Seasonal Foods
          </Link>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/30"
          >
            <LogOut className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-700 dark:text-purple-300">Logout</span>
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800/30 dark:to-gray-700/30 p-3 rounded-lg">
        Take or upload a photo of your food and get instant nutrition information using on-device machine learning
      </p>
    </div>
  );
};

export default Header;
