
import React from "react";
import Header from "@/components/Header";
import CameraCapture from "@/components/CameraCapture";
import ImageUpload from "@/components/ImageUpload";
import { Card, CardContent } from "@/components/ui/card";

const CameraPage = () => {
  const handleImageSelected = (imageElement: HTMLImageElement) => {
    // ... implement image handling logic
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Upload Photo</h2>
            <ImageUpload 
              onImageSelected={handleImageSelected}
              isProcessing={false}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Take Photo</h2>
            <CameraCapture 
              onCapture={handleImageSelected}
              isProcessing={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CameraPage;
