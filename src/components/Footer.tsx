
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Film, Music, Heart, Info } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full">
      {/* Quick Links - Mobile */}
      <motion.div 
        className="fixed bottom-4 left-0 right-0 md:hidden z-40 px-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="glass-darker py-4 px-6 mx-auto flex justify-between items-center rounded-2xl">
          <QuickLink to="/" icon={<Home className="w-5 h-5" />} label="Home" />
          <QuickLink to="/movies" icon={<Film className="w-5 h-5" />} label="Movies" />
          <QuickLink to="/music" icon={<Music className="w-5 h-5" />} label="Music" />
          <QuickLink to="/favorites" icon={<Heart className="w-5 h-5" />} label="Favorites" />
          <QuickLink to="/about" icon={<Info className="w-5 h-5" />} label="About" />
        </div>
      </motion.div>

      {/* Footer content - Desktop */}
      <div className="hidden md:block glass-darker mt-20 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Kelper</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Discover movies and music from the Internet Archive, beautifully presented and easy to access.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <div className="space-y-2">
                <FooterLink to="/" label="Home" />
                <FooterLink to="/movies" label="Movies" />
                <FooterLink to="/music" label="Music" />
                <FooterLink to="/favorites" label="Favorites" />
                <FooterLink to="/about" label="About" />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Account</h4>
              <div className="space-y-2">
                <FooterLink to="/login" label="Login" />
                <FooterLink to="/signup" label="Sign up" />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <div className="space-y-2">
                <FooterLink to="/privacy" label="Privacy Policy" />
                <FooterLink to="/terms" label="Terms of Service" />
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Kelper. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const QuickLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <Link 
      to={to} 
      className="flex flex-col items-center justify-center gap-1 transition-colors text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

const FooterLink = ({ to, label }: { to: string; label: string }) => {
  return (
    <Link 
      to={to} 
      className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
};

export default Footer;
