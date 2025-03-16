
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ContentGrid from "@/components/ContentGrid";
import { ArchiveItem } from "@/services/archiveApi";
import { Heart } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // In a real app, you would fetch favorites from a database or API
  // For demo purposes, we'll use sample data
  useEffect(() => {
    if (isAuthenticated) {
      // Simulate API call to fetch favorites
      setTimeout(() => {
        // Sample data - in a real app, this would come from your backend
        const sampleFavorites: ArchiveItem[] = [
          {
            identifier: "night_of_the_living_dead",
            title: "Night of the Living Dead",
            description: "A group of people try to survive when the dead start to come back to life and eat the living in this cult classic.",
            mediatype: "movies",
            collection: ["feature_films", "cult_movies"],
            date: "1968-10-04T00:00:00Z",
            creator: "George A. Romero",
            subject: ["zombies", "horror", "cult"],
            thumb: "https://archive.org/services/img/night_of_the_living_dead",
            downloads: 100000,
            year: "1968",
            publicdate: "2014-03-21T00:00:00Z"
          },
          {
            identifier: "in_the_realm_of_the_senses",
            title: "Plan 9 from Outer Space",
            description: "Considered one of the worst films ever made, this sci-fi film by Ed Wood has become a cult classic.",
            mediatype: "movies",
            collection: ["sci-fi_horror", "cult_movies"],
            date: "1959-07-22T00:00:00Z",
            creator: "Ed Wood",
            subject: ["science fiction", "aliens", "bad movies"],
            thumb: "https://archive.org/services/img/Plan_9_from_Outer_Space_1959",
            downloads: 50000,
            year: "1959",
            publicdate: "2015-04-12T00:00:00Z"
          },
          {
            identifier: "grateful_dead_1977-05-08",
            title: "Grateful Dead Live at Barton Hall - May 8, 1977",
            description: "One of the most famous Grateful Dead concerts, considered by many fans to be the best.",
            mediatype: "audio",
            collection: ["GratefulDead", "etree", "stream_only"],
            date: "1977-05-08T00:00:00Z",
            creator: "Grateful Dead",
            subject: ["live music", "rock", "jam band"],
            thumb: "https://archive.org/services/img/gd1977-05-08.matrix.dusborne.124987",
            downloads: 75000,
            year: "1977",
            publicdate: "2009-08-12T00:00:00Z"
          }
        ];
        
        setFavorites(sampleFavorites);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 pt-28 pb-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Heart className="w-16 h-16 mb-4 mx-auto opacity-40" />
          <h1 className="text-3xl md:text-4xl font-medium mb-4">Your Favorites</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
            Please log in to view and manage your favorite items from the Internet Archive.
          </p>
          <Button 
            onClick={() => navigate("/login")}
            className="rounded-full px-6"
          >
            Log In
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Heart className="w-10 h-10 mb-3 mx-auto opacity-50" />
        <h1 className="text-3xl md:text-4xl font-medium mb-4">Your Favorites</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your personal collection of favorite movies and music from the Internet Archive.
        </p>
      </motion.div>
      
      <ContentGrid 
        items={favorites} 
        isLoading={isLoading}
        title={favorites.length > 0 ? "Your Favorite Items" : undefined}
      />
      
      {!isLoading && favorites.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't added any favorites yet.</p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate("/movies")}
              variant="outline"
              className="rounded-full"
            >
              Explore Movies
            </Button>
            <Button 
              onClick={() => navigate("/music")}
              className="rounded-full"
            >
              Explore Music
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
