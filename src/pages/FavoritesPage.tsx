import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import ContentGrid from "@/components/ContentGrid";
import { useFavoritesContext } from "@/providers/FavoritesProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { ArchiveItem } from "@/services/archiveApi";

const FavoritesPage = () => {
  const { favorites, isLoading } = useFavoritesContext();
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
    
    // Add metadata for SEO
    document.title = "Your Favorites | Kelper";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'View and manage your favorite movies and music from the Internet Archive');
    }
  }, [isAuthenticated, navigate, toast]);
  
  // If not authenticated, don't render the content
  if (!isAuthenticated) {
    return null;
  }
  
  // Convert favorites to ArchiveItem format for ContentGrid
  const favoriteItems: ArchiveItem[] = favorites.map(item => ({
    identifier: item.id,
    title: item.title,
    creator: item.creator,
    description: item.description,
    mediatype: item.mediaType,
    thumb: item.thumbnail,
    collection: [], // Required field
    date: new Date(item.addedAt).toISOString(), // Required field
    publicdate: new Date(item.addedAt).toISOString(), // Required field
  }));
  
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 mr-3"
            >
              <Heart className="w-6 h-6" />
            </motion.div>
            <h1 className="text-3xl font-medium">Your Favorites</h1>
          </div>
          
          {favorites.length === 0 && !isLoading ? (
            <div className="text-center py-20 neo-card p-10">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-block p-6 rounded-full bg-gray-100 dark:bg-gray-800 float-animation"
              >
                <Heart className="w-14 h-14 text-gray-400 dark:text-gray-500" />
              </motion.div>
              <h2 className="text-2xl font-medium mb-3">No favorites yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Start exploring and add movies or music to your favorites collection.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/movies")}
                  className="apple-button"
                >
                  Explore Movies
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/music")}
                  className="apple-button-secondary"
                >
                  Explore Music
                </motion.button>
              </div>
            </div>
          ) : (
            <ContentGrid
              items={favoriteItems}
              isLoading={isLoading}
              title="Your Favorite Items"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FavoritesPage;
