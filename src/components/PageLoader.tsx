
import React from "react";

interface PageLoaderProps {
  visible?: boolean;
  autoHide?: boolean;
  disableForPlayers?: boolean;
}

const PageLoader = ({ 
  visible = true, 
  autoHide = true,
  disableForPlayers = true
}: PageLoaderProps) => {
  // Return null to disable page loader
  return null;
};

export default PageLoader;
