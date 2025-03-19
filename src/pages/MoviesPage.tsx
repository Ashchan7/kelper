
import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import ContentGrid from "@/components/ContentGrid";
import { useArchiveSearch, useFeaturedContent } from "@/services/archiveApi";
import { Film } from "lucide-react";

const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const featuredMovies = useFeaturedContent("movies", 16, true); // Set monetizableOnly to true
  const searchResults = useArchiveSearch(searchQuery, "movies", 1, 20, true); // Set monetizableOnly to true
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-6 pt-28 pb-20">
      <div className="max-w-4xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Film className="w-10 h-10 mb-3 mx-auto opacity-50" />
          <h1 className="text-3xl md:text-4xl font-medium mb-4">Movies Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore a vast archive of legally sharable films, documentaries, and more from the Internet Archive.
          </p>
        </motion.div>
        
        <SearchBar onSearch={handleSearch} placeholder="Search for movies..." />
      </div>
      
      {searchQuery ? (
        <ContentGrid 
          items={searchResults.data?.items || []} 
          isLoading={searchResults.isLoading}
          title={`Search Results for "${searchQuery}"`}
          description={searchResults.data?.totalResults 
            ? `Found ${searchResults.data.totalResults} results` 
            : undefined}
        />
      ) : (
        <ContentGrid 
          items={featuredMovies.data} 
          isLoading={featuredMovies.isLoading}
          title="Popular Public Domain Movies"
          description="The most viewed and legally shareable movies from the Internet Archive"
        />
      )}
    </div>
  );
};

export default MoviesPage;
