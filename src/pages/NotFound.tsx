
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-medium">404</h1>
        <h2 className="text-3xl font-medium mt-6 mb-4">Page not found</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild className="rounded-full px-6">
          <Link to="/">
            Return to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
