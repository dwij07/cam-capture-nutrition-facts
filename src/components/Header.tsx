
import React from "react";
import { Camera } from "lucide-react";

/**
 * Header component for the application
 * Displays the application title and description
 */
const Header: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-2">
        <Camera className="h-8 w-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Camera Nutrition Tracking</h1>
      </div>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto">
        Take or upload a photo of your food and get instant nutrition information using on-device machine learning
      </p>
    </div>
  );
};

export default Header;
