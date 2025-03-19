
import React from "react";
import { Loader } from "@/components/ui/loader";

interface ContentLoaderProps {
  visible?: boolean;
  className?: string;
  text?: string;
}

const ContentLoader = ({ 
  visible = true, 
  className = "py-12", 
  text 
}: ContentLoaderProps) => {
  if (!visible) return null;

  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      <Loader />
      {text && (
        <p className="mt-4 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export default ContentLoader;
