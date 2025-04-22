
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to NutriTrack</h1>
      <p className="text-lg mb-8 text-center max-w-md text-gray-600">
        Your personal nutrition tracking assistant
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/auth">Get Started</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
