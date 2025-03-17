
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchBar from "@/components/SearchBar";
import ContentGrid from "@/components/ContentGrid";
import { useToast } from "@/hooks/use-toast";

import { useArchiveSearch } from "@/services/archiveApi";
import { useQuery } from "@tanstack/react-query";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "movies" | "music">("all");
  const { toast } = useToast();

  // Handle search submission
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ q: query });
  };

  // Determine the media type based on the active tab
  const mediaType = activeTab === "all" ? undefined : activeTab === "movies" ? "movies" : "audio";

  // Use the hook for search
  const { data: searchResults, isLoading, error } = useArchiveSearch(
    searchQuery,
    mediaType === "movies" ? "movies" : mediaType === "music" ? "audio" : "all"
  );

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Search Bar */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Search the Internet Archive
          </h1>
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search for movies, music..."
            className="mt-4"
          />
        </div>

        {/* Tabs for filtering results */}
        {searchQuery && (
          <Tabs 
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "all" | "movies" | "music")}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="music">Music</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            <TabsContent value="all" className="mt-0">
              {renderSearchResults(searchResults?.items, isLoading, error, searchQuery)}
            </TabsContent>
            <TabsContent value="movies" className="mt-0">
              {renderSearchResults(searchResults?.items, isLoading, error, searchQuery)}
            </TabsContent>
            <TabsContent value="music" className="mt-0">
              {renderSearchResults(searchResults?.items, isLoading, error, searchQuery)}
            </TabsContent>
          </Tabs>
        )}
        
        {/* Display a message when no search has been made yet */}
        {!searchQuery && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 p-4 rounded-full bg-primary/10">
              <Filter className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-2">Enter a search term to begin</h2>
            <p className="text-muted-foreground max-w-md">
              Search for movies, music, and more from the Internet Archive's vast collection.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Helper function to render search results
const renderSearchResults = (results: any, isLoading: boolean, error: any, query: string) => {
  if (isLoading) {
    return <ContentGrid isLoading={true} items={[]} />;
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading results. Please try again.</p>
      </div>
    );
  }
  
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground">
          We couldn't find any matches for "{query}". Try different keywords.
        </p>
      </div>
    );
  }
  
  return <ContentGrid items={results} isLoading={false} />;
};

export default SearchPage;
