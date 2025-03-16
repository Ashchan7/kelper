
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import ContentGrid from "@/components/ContentGrid";
import { useFeaturedContent } from "@/services/archiveApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Music, Sparkles } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("featured");
  
  const featuredContent = useFeaturedContent("all", 8);
  const featuredMovies = useFeaturedContent("movies", 8);
  const featuredMusic = useFeaturedContent("audio", 8);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-6 pt-20 md:pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-background z-10"></div>
        
        <motion.div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0"></div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="https://archive.org/download/archival_videos_act2/archival_videos_act2_512kb.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="container mx-auto relative z-20 max-w-4xl text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4 tracking-tight text-white">
                Discover the <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Internet Archive</span>
              </h1>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Explore a vast collection of movies, music, and more from the Internet Archive.
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <SearchBar onSearch={handleSearch} className="mb-4" />
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Content Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-full p-1">
              <TabsTrigger 
                value="featured" 
                className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-full px-4 py-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Featured
              </TabsTrigger>
              <TabsTrigger 
                value="movies" 
                className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-full px-4 py-2"
              >
                <Film className="w-4 h-4 mr-2" />
                Movies
              </TabsTrigger>
              <TabsTrigger 
                value="music" 
                className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-full px-4 py-2"
              >
                <Music className="w-4 h-4 mr-2" />
                Music
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="featured" className="focus-visible:outline-none focus-visible:ring-0">
            <ContentGrid 
              items={featuredContent.data} 
              isLoading={featuredContent.isLoading} 
              title="Featured Content" 
              description="Explore the most popular items from the Internet Archive"
            />
          </TabsContent>
          
          <TabsContent value="movies" className="focus-visible:outline-none focus-visible:ring-0">
            <ContentGrid 
              items={featuredMovies.data} 
              isLoading={featuredMovies.isLoading} 
              title="Featured Movies" 
              description="Discover the best movies from the Internet Archive"
            />
          </TabsContent>
          
          <TabsContent value="music" className="focus-visible:outline-none focus-visible:ring-0">
            <ContentGrid 
              items={featuredMusic.data} 
              isLoading={featuredMusic.isLoading} 
              title="Featured Music" 
              description="Listen to the most popular music from the Internet Archive"
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default HomePage;
