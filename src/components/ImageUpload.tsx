
import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { preprocessImage } from "@/utils/enhancedModelService";
import * as tf from '@tensorflow/tfjs';

interface ImageUploadProps {
  onImageSelected: (image: HTMLImageElement) => void;
  isProcessing: boolean;
}

/**
 * Component for handling image uploads
 * Enhanced with preprocessing techniques to improve recognition accuracy
 */
const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isProcessing }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Handle file selection with enhanced preprocessing
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Check file size and type
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Create a new image element to pass to the classifier
      const img = new Image();
      img.src = url;
      
      // Wait for the image to load before processing
      img.onload = async () => {
        try {
          setIsEnhancing(true);
          
          // Apply preprocessing for better recognition
          await preprocessImage(img);
          
          // Pass the image for recognition with enhanced confidence
          onImageSelected(img);
          
          setIsEnhancing(false);
        } catch (error) {
          console.error("Error preprocessing image:", error);
          toast({
            title: "Processing Error",
            description: "Could not process the image. Please try another one.",
            variant: "destructive"
          });
          setIsEnhancing(false);
        }
      };
    } catch (error) {
      console.error("Error loading image:", error);
      toast({
        title: "Upload Error",
        description: "Could not load the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clear the selected image and release memory
  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Clear any tensors to prevent memory leaks
    tf.disposeVariables();
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
              disabled={isProcessing || isEnhancing}
            >
              <X size={20} />
            </Button>
            
            {isEnhancing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Enhancing image for better recognition...</p>
                </div>
              </div>
            )}
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
            disabled={isProcessing || isEnhancing}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>
        
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg,image/png"
          className="hidden" 
          disabled={isProcessing || isEnhancing}
        />
      </div>
    </Card>
  );
};

export default ImageUpload;
