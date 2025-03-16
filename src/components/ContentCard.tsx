
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getItemImageUrl, getItemPageUrl, ArchiveItem } from "@/services/archiveApi";
import { Play, Music, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContentCardProps {
  item: ArchiveItem;
  index: number;
}

const ContentCard = ({ item, index }: ContentCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // In a real app, you would update the favorites in a database or local storage
  };
  
  const imageUrl = item.thumb ? item.thumb : getItemImageUrl(item.identifier);
  const archiveUrl = getItemPageUrl(item.identifier);
  
  const isMovie = item.mediatype === "movies";
  const isAudio = item.mediatype === "audio";
  
  // Format date if available
  const formattedDate = item.date 
    ? new Date(item.date).getFullYear() 
    : item.year 
    ? item.year
    : "";

  return (
    <motion.div 
      className="group relative rounded-xl overflow-hidden bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/10 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Link to={archiveUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          <img 
            src={imageUrl} 
            alt={item.title} 
            className={`w-full h-full object-cover transition-all duration-500 ${
              isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              // If image fails to load, set a placeholder
              e.currentTarget.src = "https://placehold.co/600x400/gray/white?text=No+Image";
              setIsImageLoaded(true);
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="outline" className="rounded-full bg-black/20 backdrop-blur-md border-white/20 text-white">
              {isMovie && <Play className="w-5 h-5 mr-2" />}
              {isAudio && <Music className="w-5 h-5 mr-2" />}
              {!isMovie && !isAudio && <ExternalLink className="w-5 h-5 mr-2" />}
              View
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`absolute top-2 right-2 rounded-full ${
              isFavorite 
                ? "bg-white/10 text-red-500" 
                : "bg-black/20 text-white/70 opacity-0 group-hover:opacity-100"
            } backdrop-blur-md border-white/20 transition-all duration-300`}
            onClick={toggleFavorite}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`} />
          </Button>
          
          {item.mediatype && (
            <Badge 
              variant="secondary" 
              className="absolute bottom-2 left-2 text-xs font-medium capitalize bg-black/30 text-white border-none backdrop-blur-md"
            >
              {item.mediatype}
            </Badge>
          )}
          
          {formattedDate && (
            <Badge 
              variant="secondary" 
              className="absolute bottom-2 right-2 text-xs font-medium bg-black/30 text-white border-none backdrop-blur-md"
            >
              {formattedDate}
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium line-clamp-1 mb-1">{item.title}</h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px]">
            {item.description ? item.description : "No description available"}
          </p>
          
          {item.creator && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500 font-medium">
              By {item.creator}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ContentCard;
