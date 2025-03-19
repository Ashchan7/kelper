
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "small" | "default" | "large";
  color?: "default" | "white" | "primary";
  visible?: boolean;
  autoHide?: boolean;
}

const Loader = ({ 
  className, 
  size = "default", 
  color = "default",
  visible = true,
  autoHide = false
}: LoaderProps) => {
  const [isVisible, setIsVisible] = useState(visible);
  
  // Size mapping
  const sizeMap = {
    small: "24px",
    default: "40px",
    large: "60px"
  };

  // Color mapping
  const colorMap = {
    default: "currentColor",
    white: "white",
    primary: "hsl(var(--primary))"
  };

  // Calculate actual size
  const actualSize = sizeMap[size];
  const actualColor = colorMap[color];
  
  // Auto-hide logic - check if any audio/video elements are playing
  useEffect(() => {
    if (!autoHide || !visible) return;
    
    const checkMediaPlaying = () => {
      const audioElements = document.querySelectorAll('audio');
      const videoElements = document.querySelectorAll('video');
      
      // Check if any audio is playing
      const isAudioPlaying = Array.from(audioElements).some(
        audio => !audio.paused && !audio.ended && audio.readyState > 2
      );
      
      // Check if any video is playing
      const isVideoPlaying = Array.from(videoElements).some(
        video => !video.paused && !video.ended && video.readyState > 2
      );
      
      // Hide loader if media is playing
      if (isAudioPlaying || isVideoPlaying) {
        setIsVisible(false);
      }
    };
    
    // Initial check
    checkMediaPlaying();
    
    // Set up event listeners for media elements
    const handlePlaying = () => {
      setIsVisible(false);
    };
    
    const handleWaiting = () => {
      setIsVisible(true);
    };
    
    const mediaElements = [...document.querySelectorAll('audio'), ...document.querySelectorAll('video')];
    
    mediaElements.forEach(element => {
      element.addEventListener('playing', handlePlaying);
      element.addEventListener('waiting', handleWaiting);
      element.addEventListener('canplay', handlePlaying);
    });
    
    // Check every second as a fallback
    const interval = setInterval(checkMediaPlaying, 1000);
    
    return () => {
      clearInterval(interval);
      mediaElements.forEach(element => {
        element.removeEventListener('playing', handlePlaying);
        element.removeEventListener('waiting', handleWaiting);
        element.removeEventListener('canplay', handlePlaying);
      });
    };
  }, [autoHide, visible]);
  
  // Respect both the passed visible prop and internal state
  const shouldDisplay = visible && isVisible;
  
  if (!shouldDisplay) return null;

  return (
    <div 
      className={cn(
        "flex items-center justify-center", 
        className
      )}
      aria-label="Loading"
      role="status"
    >
      <svg 
        className="transform-origin-center overflow-visible"
        style={{
          '--uib-size': actualSize,
          '--uib-color': actualColor,
          '--uib-speed': '1.4s',
          '--uib-bg-opacity': '0.1',
          height: 'var(--uib-size)',
          width: 'var(--uib-size)',
        } as React.CSSProperties}
        x="0px" 
        y="0px" 
        viewBox="0 0 40 40" 
        preserveAspectRatio="xMidYMid meet"
      >
        <path 
          className="opacity-[var(--uib-bg-opacity)]" 
          fill="none" 
          stroke="var(--uib-color)" 
          strokeWidth="4" 
          pathLength="100"
          d="M29.76 18.72c0 7.28-3.92 13.6-9.84 16.96-2.88 1.68-6.24 2.64-9.84 2.64s-6.88-.96-9.76-2.64c0-7.28 3.92-13.52 9.84-16.96 2.88-1.68 6.24-2.64 9.76-2.64s6.88.96 9.76 2.64c5.84 3.36 9.76 9.68 9.84 16.96-2.88 1.68-6.24 2.64-9.76 2.64s-6.88-.96-9.84-2.64c-5.84-3.36-9.76-9.68-9.76-16.96 0-7.28 3.92-13.6 9.76-16.96 5.92-3.36 9.84 3.92 9.84 11.2z"
        />
        <path 
          className="animate-travel" 
          fill="none" 
          stroke="var(--uib-color)" 
          strokeWidth="4" 
          pathLength="100"
          strokeDasharray="15, 85"
          strokeDashoffset="0"
          strokeLinecap="round"
          d="M29.76 18.72c0 7.28-3.92 13.6-9.84 16.96-2.88 1.68-6.24 2.64-9.84 2.64s-6.88-.96-9.76-2.64c0-7.28 3.92-13.52 9.84-16.96 2.88-1.68 6.24-2.64 9.76-2.64s6.88.96 9.76 2.64c5.84 3.36 9.76 9.68 9.84 16.96-2.88 1.68-6.24 2.64-9.76 2.64s-6.88-.96-9.84-2.64c-5.84-3.36-9.76-9.68-9.76-16.96 0-7.28 3.92-13.6 9.76-16.96 5.92-3.36 9.84 3.92 9.84 11.2z"
        />
      </svg>
    </div>
  );
};

export { Loader };
