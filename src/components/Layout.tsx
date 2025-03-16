
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";

const Layout = () => {
  const location = useLocation();
  
  // Only hide navbar on play pages, show on all other pages
  const isPlayerPage = location.pathname.includes('/play/');
  
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Show Navbar on all pages except player page */}
      <Navbar className={isPlayerPage ? "hidden" : ""} />
      
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      {/* Footer should always be visible */}
      <Footer />
    </div>
  );
};

export default Layout;
