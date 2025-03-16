
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {theme === "dark" ? (
          <motion.div
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
