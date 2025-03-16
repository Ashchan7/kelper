
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileSearch, Film, Music, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 -z-10 opacity-70 dark:opacity-30"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
            alt="Archive background" 
            className="object-cover w-full h-full"
          />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div 
              className="inline-block mb-6 px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-lg border border-white/20"
              variants={itemVariants}
            >
              The Internet Archive Explorer
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-medium mb-6 tracking-tight text-white"
              variants={itemVariants}
            >
              Discover the <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">Internet Archive</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Explore a vast collection of movies, music, and cultural artifacts from the world's largest digital library.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={itemVariants}
            >
              <Button 
                className="h-12 px-6 text-base rounded-full bg-white text-black hover:bg-white/90 dark:bg-black dark:text-white dark:hover:bg-black/90 dark:border dark:border-white/20"
                onClick={() => navigate('/movies')}
              >
                Start Exploring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="h-12 px-6 text-base rounded-full border-white/20 text-white hover:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Explore the Archive</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover millions of free books, movies, music, and more from the Internet Archive's vast collection.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Movies Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full neo-card overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Film className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Movies</CardTitle>
                  <CardDescription>
                    Classic films, documentaries, independent cinema, and more.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Stream thousands of free movies from every era and genre, including rare and historical footage.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full"
                    onClick={() => navigate('/movies')}
                  >
                    Browse Movies
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Music Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full neo-card overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Music</CardTitle>
                  <CardDescription>
                    Live concerts, recordings, and audio treasures.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Listen to rare live recordings, classical music, podcasts, and audiobooks from around the world.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full"
                    onClick={() => navigate('/music')}
                  >
                    Browse Music
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Archive Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full neo-card overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FileSearch className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Search</CardTitle>
                  <CardDescription>
                    Find specific content from the vast collection.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use our advanced search tools to discover exactly what you're looking for in the Internet Archive.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full"
                    onClick={() => navigate('/search')}
                  >
                    Search Archive
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="glass-darker rounded-3xl overflow-hidden"
          >
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-lg">
                <h2 className="text-2xl md:text-3xl font-medium mb-4">
                  Ready to explore the archive?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Create an account to save your favorites and continue exploring the vast collection of content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="rounded-full apple-button"
                    onClick={() => navigate('/signup')}
                  >
                    Create an Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full apple-button-secondary"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
              <div className="hidden md:block w-1/3 relative aspect-square">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-background/50 to-primary/10 pulse-animation"></div>
                <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-background/80 to-primary/20 float-animation delay-300"></div>
                <div className="absolute inset-20 rounded-full bg-gradient-to-tr from-background to-primary/30"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
