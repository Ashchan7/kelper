
import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import ContentGrid from "@/components/ContentGrid";
import { useArchiveSearch, useFeaturedContent } from "@/services/archiveApi";
import { Music } from "lucide-react";

const MusicPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const featuredMusic = useFeaturedContent("audio", 16);
  const searchResults = useArchiveSearch(searchQuery, "audio");
  
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
          <Music className="w-10 h-10 mb-3 mx-auto opacity-50" />
          <h1 className="text-3xl md:text-4xl font-medium mb-4">Music Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover a rich collection of music, live concerts, and recordings from the Internet Archive.
          </p>
        </motion.div>
        
        <SearchBar onSearch={handleSearch} placeholder="Search for music..." />
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
          items={featuredMusic.data} 
          isLoading={featuredMusic.isLoading}
          title="Popular Music"
          description="The most listened to music from the Internet Archive"
        />
      )}
    </div>
  );
};

export default MusicPage;
