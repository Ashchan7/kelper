
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import QuickLinks from "./QuickLinks";
import SidebarNavigation from "./SidebarNavigation";
import { motion } from "framer-motion";
import { Toaster } from "./ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import PageLoader from "./PageLoader";
import { useState, useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  
  // Simulate initial page load
  useEffect(() => {
    // Hide loader after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loader on route changes
  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Page Loader */}
      <PageLoader visible={loading} />
      
      {/* Show Navbar on all pages */}
      <Navbar />
      
      <div className="flex flex-1">
        {/* Don't show sidebar at all anymore since navigation links are in header */}
        
        <motion.main
          className="flex-grow w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
      
      {/* Add the QuickLinks component for mobile devices */}
      <QuickLinks />
      
      {/* Footer should always be visible */}
      <Footer />
      
      {/* Add Toaster for notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;
