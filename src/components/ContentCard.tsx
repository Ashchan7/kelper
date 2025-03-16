
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavorites } from "@/services/favoritesService";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface ContentCardProps {
  id: string;
  title: string;
  creator?: string;
  description?: string;
  mediaType: string;
  thumbnailUrl: string;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
}

const ContentCard = ({
  id,
  title,
  creator,
  description,
  mediaType,
  thumbnailUrl,
  showFavoriteButton = true,
  isFavorite: initialIsFavorite = false,
}: ContentCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { add, remove, check } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || check(id));
  const { toast } = useToast();
  
  const handleCardClick = () => {
    navigate(`/play/${mediaType}/${id}`);
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
      remove(id);
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: "Item removed from your favorites",
      });
    } else {
      add({
        id,
        title,
        creator: creator || "Unknown",
        description: description || "",
        mediaType,
        thumbnail: thumbnailUrl,
        url: `/play/${mediaType}/${id}`,
      });
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: "Item added to your favorites",
      });
    }
  };

  return (
    <motion.div
      className="bg-white/5 dark:bg-black/20 backdrop-blur-sm hover:bg-white/10 dark:hover:bg-black/30 border border-white/10 dark:border-white/5 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300"
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
    >
      <div className="relative aspect-video">
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md ${
              isFavorite 
                ? "bg-white/20 text-red-500" 
                : "bg-black/20 text-white/70 hover:text-white"
            } transition-all duration-300`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`} />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-base font-medium line-clamp-1 mb-1">{title}</h3>
        {creator && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
            {creator}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-sm">
            {mediaType === "movies" ? "Movie" : mediaType === "audio" ? "Music" : mediaType}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;
