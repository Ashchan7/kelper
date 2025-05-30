
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search for movies, music...", className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative w-full glass rounded-full overflow-hidden">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-4 py-6 rounded-full w-full bg-white/10 dark:bg-black/20 backdrop-blur-lg border-0 shadow-none text-base focus-visible:ring-0 focus-visible:outline-none"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <Button 
        type="submit"
        className="rounded-full absolute right-1.5 top-1/2 transform -translate-y-1/2 font-medium shadow-none border-0"
      >
        Search
      </Button>
    </motion.form>
  );
};

export default SearchBar;
