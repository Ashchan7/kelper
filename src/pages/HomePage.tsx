
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import ContentGrid from "@/components/ContentGrid";
import { useFeaturedContent } from "@/services/archiveApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Music, Sparkles } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("featured");
  const { isAuthenticated } = useAuth();
  
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
        <motion.div 
          className="absolute inset-0 opacity-70 dark:opacity-40"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000" 
            alt="Archive background" 
            className="object-cover w-full h-full object-right-top"
          />
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

            {!isAuthenticated && (
              <motion.div 
                variants={itemVariants}
                className="mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="bg-white text-black px-6 py-3 rounded-full font-medium mx-2 hover:bg-white/90 transition-colors"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="bg-transparent text-white border border-white/30 px-6 py-3 rounded-full font-medium mx-2 hover:bg-white/10 transition-colors"
                >
                  Sign In
                </motion.button>
              </motion.div>
            )}
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
