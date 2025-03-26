
import React from "react";

interface ContentLoaderProps {
  visible?: boolean;
  className?: string;
  text?: string;
  autoHide?: boolean;
  disableForPlayers?: boolean;
}

const ContentLoader = ({ 
  visible = true, 
  className = "py-12", 
  text,
  autoHide = true,
  disableForPlayers = true
}: ContentLoaderProps) => {
  // Return null to disable all loading animations
  return null;
};

export default ContentLoader;
