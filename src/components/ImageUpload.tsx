
import React, { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  onImageSelected: (image: HTMLImageElement) => void;
  isProcessing: boolean;
}

/**
 * Component for handling image uploads and camera captures
 * Accepts images from file uploads or camera capture
 */
const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isProcessing }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Create a new image element to pass to the classifier
    const img = new Image();
    img.src = url;
    img.onload = () => {
      onImageSelected(img);
    };
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clear the selected image
  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center">
        {previewUrl ? (
          <div className="relative w-full">
            <img 
              ref={imageRef}
              src={previewUrl} 
              alt="Food preview" 
              className="w-full h-64 object-cover rounded-md"
            />
            <Button 
              variant="destructive" 
              size="icon"
              className="absolute top-2 right-2" 
              onClick={clearImage}
              disabled={isProcessing}
            >
              <X size={20} />
            </Button>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-8 w-full flex flex-col items-center justify-center cursor-pointer hover:border-primary"
            onClick={handleUploadClick}
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-muted-foreground text-center mb-2">
              Click to upload an image of your food
            </p>
            <p className="text-xs text-muted-foreground">
              Supports JPEG, PNG
            </p>
          </div>
        )}
        
        <div className="flex gap-4 mt-4">
          <Button 
            variant={previewUrl ? "outline" : "default"}
            onClick={handleUploadClick}
            disabled={isProcessing}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          
          <Button 
            variant={previewUrl ? "outline" : "default"}
            disabled={isProcessing}
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
        </div>
        
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg,image/png"
          className="hidden" 
          disabled={isProcessing}
        />
      </div>
    </Card>
  );
};

export default ImageUpload;
