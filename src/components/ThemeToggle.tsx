
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={(value) => {
          if (value) setTheme(value as "light" | "dark" | "system");
        }}
        className="glass-darker rounded-full p-1"
      >
        <ToggleGroupItem 
          value="light" 
          className={`rounded-full p-2 ${theme === 'light' ? 'bg-white/20 text-black dark:text-white' : ''}`}
          aria-label="Light mode"
        >
          <Sun className="h-4 w-4" />
          <span className="sr-only">Light</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="dark" 
          className={`rounded-full p-2 ${theme === 'dark' ? 'bg-black/20 text-white dark:text-white' : ''}`}
          aria-label="Dark mode"
        >
          <Moon className="h-4 w-4" />
          <span className="sr-only">Dark</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </motion.div>
  );
};

export default ThemeToggle;
