import React from "react";
import { Camera, LogOut } from "lucide-react";
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Camera className="h-8 w-8 mr-2 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">NutriTrack</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/about" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto">
        Take or upload a photo of your food and get instant nutrition information using on-device machine learning
      </p>
    </div>
  );
};

export default Header;
