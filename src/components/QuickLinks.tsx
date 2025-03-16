
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Film, Music, Heart } from "lucide-react";

const QuickLinks = () => {
  const location = useLocation();
  
  // Only show quicklinks on mobile devices
  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-40 flex justify-center">
      <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-background/80 backdrop-blur-md border border-border/40 shadow-lg max-w-xs mx-auto">
        <QuickLink to="/" icon={<Home className="w-5 h-5" />} label="Home" />
        <QuickLink to="/movies" icon={<Film className="w-5 h-5" />} label="Movies" />
        <QuickLink to="/music" icon={<Music className="w-5 h-5" />} label="Music" />
        <QuickLink to="/favorites" icon={<Heart className="w-5 h-5" />} label="Favorites" />
      </div>
    </div>
  );
};

const QuickLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));
    
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center"
    >
      <Link 
        to={to} 
        className="flex flex-col items-center gap-1"
      >
        <div className={`p-2 rounded-md ${isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
          {icon}
        </div>
        <span className="text-xs font-medium">{label}</span>
      </Link>
    </motion.div>
  );
};

export default QuickLinks;
