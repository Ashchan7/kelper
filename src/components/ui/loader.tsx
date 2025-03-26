
import React from "react";

interface LoaderProps {
  className?: string;
  size?: "small" | "default" | "large";
  color?: "default" | "white" | "primary";
  visible?: boolean;
  autoHide?: boolean;
  disableForPlayers?: boolean;
}

const Loader = ({ 
  className, 
  size = "default", 
  color = "default",
  visible = true,
  autoHide = false,
  disableForPlayers = false
}: LoaderProps) => {
  // Returning null to remove all loading animations
  return null;
};

export { Loader };
