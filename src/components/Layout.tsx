
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import QuickLinks from "./QuickLinks";
import { motion } from "framer-motion";
import { Toaster } from "./ui/toaster";

const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Show Navbar on all pages */}
      <Navbar />
      
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
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
