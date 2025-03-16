
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import QuickLinks from "./QuickLinks";
import { motion } from "framer-motion";

const Layout = () => {
  const location = useLocation();
  
  // Remove the isPlayerPage logic for Navbar, so it always shows
  
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
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
    </div>
  );
};

export default Layout;
