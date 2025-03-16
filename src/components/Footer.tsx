
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Film, Music, Heart, Info, Mail, Globe, Twitter, Instagram, Youtube, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto w-full">
      {/* Quick Links - Mobile */}
      <motion.div 
        className="fixed bottom-4 left-0 right-0 md:hidden z-40 px-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="glass-darker py-4 px-6 mx-auto flex justify-between items-center rounded-full">
          <QuickLink to="/" icon={<Home className="w-5 h-5" />} label="Home" />
          <QuickLink to="/movies" icon={<Film className="w-5 h-5" />} label="Movies" />
          <QuickLink to="/music" icon={<Music className="w-5 h-5" />} label="Music" />
          <QuickLink to="/favorites" icon={<Heart className="w-5 h-5" />} label="Favorites" />
          <QuickLink to="/about" icon={<Info className="w-5 h-5" />} label="About" />
        </div>
      </motion.div>

      {/* Footer content - Desktop */}
      <div className="hidden md:block glass mt-20 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Kelper</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Discover movies and music from the Internet Archive, beautifully presented and easy to access.
              </p>
              <div className="flex space-x-4 pt-2">
                <SocialLink href="https://twitter.com" icon={<Twitter className="w-4 h-4" />} label="Twitter" />
                <SocialLink href="https://instagram.com" icon={<Instagram className="w-4 h-4" />} label="Instagram" />
                <SocialLink href="https://youtube.com" icon={<Youtube className="w-4 h-4" />} label="YouTube" />
                <SocialLink href="https://github.com" icon={<Github className="w-4 h-4" />} label="GitHub" />
              </div>
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
              <h4 className="font-medium mb-4">Contact</h4>
              <div className="space-y-3">
                <a href="mailto:contact@kelper.app" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  contact@kelper.app
                </a>
                <a href="https://kelper.app" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <Globe className="w-4 h-4 mr-2" />
                  kelper.app
                </a>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  123 Archive Street<br />
                  Digital City, DC 10101
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Kelper. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <FooterLink to="/terms" label="Terms of Service" />
              <FooterLink to="/privacy" label="Privacy Policy" />
              <FooterLink to="/cookies" label="Cookie Policy" />
            </div>
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

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

export default Footer;
