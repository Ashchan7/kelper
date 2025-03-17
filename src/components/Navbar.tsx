
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";
import { Search, Sun, Moon, Menu, X, ChevronRight, LogOut, Home, Film, Music, Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className = "" }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg py-4"
          : "bg-transparent py-6"
      } ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-medium relative"
          >
            Kelper
            <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <NavLink to="/" label="Home" />
            <NavLink to="/movies" label="Movies" />
            <NavLink to="/music" label="Music" />
            <NavLink to="/favorites" label="Favorites" />
            <NavLink to="/about" label="About" />
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              to="/search" 
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={logout}
                className="font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5"
              >
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full font-medium text-sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Improved with better blur effect */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-[73px] bg-white/70 dark:bg-black/70 backdrop-blur-xl z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-6 p-6">
              {isAuthenticated && (
                <motion.div 
                  className="glass p-4 rounded-xl mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xl font-medium">
                      {user?.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{user?.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-1">
                <MobileNavLink to="/" label="Home" icon={<Home className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/movies" label="Movies" icon={<Film className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/music" label="Music" icon={<Music className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/favorites" label="Favorites" icon={<Heart className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/about" label="About" icon={<Info className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-2">
                {isAuthenticated ? (
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="w-full justify-start py-3 rounded-xl"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link to="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-center rounded-xl"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        className="w-full justify-center rounded-xl"
                      >
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
        isActive 
          ? "text-black dark:text-white" 
          : "text-gray-600 dark:text-gray-400"
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-full"
          transition={{ type: "spring", duration: 0.6 }}
        />
      )}
    </Link>
  );
};

const MobileNavLink = ({ 
  to, 
  label,
  icon,
  onClick 
}: { 
  to: string; 
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-xl backdrop-blur-sm transition-colors ${
        isActive 
          ? "bg-black/80 text-white dark:bg-white/80 dark:text-black" 
          : "text-gray-800 dark:text-gray-200 bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5" />
    </Link>
  );
};

export default Navbar;
