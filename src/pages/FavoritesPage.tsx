
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import ContentGrid from "@/components/ContentGrid";
import { useFavorites } from "@/services/favoritesService";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const FavoritesPage = () => {
  const { favorites, isLoading } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your favorites",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);
  
  // If not authenticated, don't render the content
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-8">
            <Heart className="w-6 h-6 mr-2 text-red-500" />
            <h1 className="text-3xl font-medium">Your Favorites</h1>
          </div>
          
          {favorites.length === 0 && !isLoading ? (
            <div className="text-center py-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <Heart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </motion.div>
              <h2 className="text-2xl font-medium mb-2">No favorites yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start exploring and add movies or music to your favorites.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/movies")}
                  className="px-6 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium"
                >
                  Explore Movies
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/music")}
                  className="px-6 py-2 rounded-full border border-black dark:border-white font-medium"
                >
                  Explore Music
                </motion.button>
              </div>
            </div>
          ) : (
            <ContentGrid
              items={favorites.map(item => ({
                identifier: item.id,
                title: item.title,
                creator: item.creator,
                description: item.description,
                mediatype: item.mediaType,
                thumbnailUrl: item.thumbnail,
                dateAdded: new Date(item.addedAt).toISOString(),
                isFavorite: true,
              }))}
              isLoading={isLoading}
              showFavoriteButton={true}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FavoritesPage;
