
import React, { useState, useRef, useCallback } from 'react';
import { Camera, ImageOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (imageElement: HTMLImageElement) => void;
  isProcessing: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isProcessing }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      // Request camera access
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 720 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setCameraError(null);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please check permissions.');
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Take photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image
      const image = new Image();
      image.onload = () => {
        onCapture(image);
        stopCamera(); // Stop camera after capturing
      };
      image.src = canvas.toDataURL('image/jpeg');
    }
  }, [onCapture, stopCamera]);

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Request camera access
  const handleCameraClick = () => {
    if (cameraActive) {
      capturePhoto();
    } else {
      startCamera();
    }
  };

  // Switch between front and back cameras (if available)
  const switchCamera = async () => {
    stopCamera();
    
    try {
      // Get current facing mode
      const currentFacingMode = cameraActive && streamRef.current ?
        streamRef.current.getVideoTracks()[0].getSettings().facingMode : 'environment';
      
      // Request opposite camera
      const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
      
      const constraints = {
        video: {
          facingMode: newFacingMode,
          width: { ideal: 720 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setCameraError(null);
      }
    } catch (error) {
      console.error('Error switching camera:', error);
      setCameraError('Unable to switch camera.');
      toast({
        title: "Camera Error",
        description: "Unable to switch camera.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="relative flex flex-col items-center">
        {cameraActive ? (
          <div className="relative w-full">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full aspect-square object-cover rounded-md"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <Button 
                onClick={handleCameraClick}
                disabled={isProcessing}
                variant="default"
                size="lg"
                className="rounded-full"
              >
                <Camera className="h-6 w-6" />
              </Button>
              <Button 
                onClick={switchCamera}
                disabled={isProcessing}
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {cameraError ? (
              <div className="p-8 text-center">
                <ImageOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">{cameraError}</p>
                <Button onClick={startCamera} disabled={isProcessing}>
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Take a photo of your food</p>
                <Button onClick={startCamera} disabled={isProcessing}>
                  Open Camera
                </Button>
              </div>
            )}
          </div>
        )}
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Card>
  );
};

export default CameraCapture;
