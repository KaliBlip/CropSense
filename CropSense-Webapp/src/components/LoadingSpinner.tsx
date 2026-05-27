import React from "react";
import { Sprout } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Analyzing botanical health..." }: LoadingSpinnerProps) {
  return (
    <div className="loading-container">
      <div className="spinner-relative">
        {/* Outer glowing pulsing ring */}
        <div className="spinner-outer-ping" />
        
        {/* Middle rotating dashed ring */}
        <div className="spinner-middle-spin" />
        
        {/* Inner solid ring with icon */}
        <div className="spinner-inner-solid">
          <Sprout size={24} className="spinner-icon-pulse" />
        </div>
      </div>
      
      <div className="spinner-text-group">
        <h3 className="spinner-message-title">
          {message}
        </h3>
        <p className="spinner-message-sub">
          Running Transfer Learning ResNet50 model inference
        </p>
      </div>
    </div>
  );
}
