
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Play } from "lucide-react";
import { useFavorites } from "@/services/favoritesService";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { ArchiveItem } from "@/services/archiveApi";
import { Button } from "@/components/ui/button";

interface ContentCardProps {
  item: ArchiveItem;
  index: number;
  showFavoriteButton?: boolean;
}

const ContentCard = ({
  item,
  index,
  showFavoriteButton = true,
}: ContentCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { add, remove, check } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(check(item.identifier));
  const { toast } = useToast();
  
  const handleCardClick = () => {
    navigate(`/play/${item.mediatype}/${item.identifier}`);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save favorites",
        variant: "destructive",
      });
      return;
    }
    
    if (isFavorite) {
      remove(item.identifier);
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: "Item removed from your favorites",
      });
    } else {
      add({
        id: item.identifier,
        title: item.title,
        creator: item.creator || "Unknown",
        description: item.description || "",
        mediaType: item.mediatype,
        thumbnail: item.thumb || `https://archive.org/services/img/${item.identifier}`,
        url: `/play/${item.mediatype}/${item.identifier}`,
      });
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: "Item added to your favorites",
      });
    }
  };

  // Card hover animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: index * 0.05
      }
    },
    hover: { 
      y: -8,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  // Image animation variants
  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="neo-card overflow-hidden cursor-pointer group"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={item.thumb || `https://archive.org/services/img/${item.identifier}`}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
          variants={imageVariants}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <Button 
            onClick={handleCardClick}
            variant="outline"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 w-12 h-12"
          >
            <Play className="w-6 h-6 text-white" fill="white" />
          </Button>
        </div>
        
        {showFavoriteButton && (
          <motion.button
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-2 right-2 p-2 rounded-full glass-darker ${
              isFavorite 
                ? "bg-white/20 text-red-500" 
                : "bg-black/20 text-white/70 hover:text-white"
            } transition-all duration-300`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`} />
          </motion.button>
        )}
        
        {/* Media type badge */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs px-3 py-1 rounded-full glass-darker text-white backdrop-blur-md">
            {item.mediatype === "movies" ? "Movie" : item.mediatype === "audio" ? "Music" : item.mediatype}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-base font-medium line-clamp-1 mb-1 group-hover:text-black dark:group-hover:text-white transition-colors">
          {item.title}
        </h3>
        {item.creator && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
            {item.creator}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/5">
            {new Date(item.date).getFullYear() || "Unknown year"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;
