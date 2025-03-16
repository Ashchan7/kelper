
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Film, Music, Heart, Info } from "lucide-react";

const QuickLinks = () => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-4 p-3 rounded-lg bg-background/90 backdrop-blur-md border border-border/40 shadow-lg">
      <QuickLink to="/" icon={<Home className="w-5 h-5" />} label="Home" />
      <QuickLink to="/movies" icon={<Film className="w-5 h-5" />} label="Movies" />
      <QuickLink to="/music" icon={<Music className="w-5 h-5" />} label="Music" />
      <QuickLink to="/favorites" icon={<Heart className="w-5 h-5" />} label="Favorites" />
      <QuickLink to="/about" icon={<Info className="w-5 h-5" />} label="About" />
    </div>
  );
};

const QuickLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
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
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-xs font-medium">{label}</span>
      </Link>
    </motion.div>
  );
};

export default QuickLinks;
