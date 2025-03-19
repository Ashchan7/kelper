
import React from "react";
import { Loader } from "@/components/ui/loader";
import { motion } from "framer-motion";

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
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
    >
      <Loader size="large" autoHide={autoHide} disableForPlayers={disableForPlayers} />
    </motion.div>
  );
};

export default PageLoader;
