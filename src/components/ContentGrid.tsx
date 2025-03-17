
import { useState } from "react";
import { ArchiveItem } from "@/services/archiveApi";
import ContentCard from "./ContentCard";
import { motion } from "framer-motion";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentGridProps {
  items: ArchiveItem[];
  isLoading: boolean;
  title?: string;
  description?: string;
}

const ContentGrid = ({ 
  items, 
  isLoading, 
  title, 
  description 
}: ContentGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div className="w-full">
        {title && (
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            {description && <Skeleton className="h-4 w-full max-w-xl" />}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No items found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <motion.h2 
              className="text-2xl md:text-3xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h2>
            {description && (
              <motion.p 
                className="text-gray-600 dark:text-gray-400 mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {description}
              </motion.p>
            )}
          </div>
          
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-full"
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-full"
            >
              <LayoutList className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      )}
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, index) => (
            <ContentCard key={item.identifier} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.identifier}
              className="flex flex-col md:flex-row gap-4 neo-card overflow-hidden transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, x: 0 }}
            >
              <div className="md:w-48 h-48 md:h-auto">
                <img 
                  src={item.thumb || `https://archive.org/services/img/${item.identifier}`} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/gray/white?text=No+Image";
                  }}
                />
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-medium mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description || "No description available"}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.mediatype && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-medium capitalize"
                    >
                      {item.mediatype}
                    </Badge>
                  )}
                  {item.year && (
                    <Badge 
                      variant="outline" 
                      className="text-xs font-medium"
                    >
                      {item.year}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                  {item.creator ? `By ${item.creator}` : "Unknown creator"}
                </p>
              </div>
              <div className="p-4 flex items-center justify-end md:self-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  asChild
                >
                  <a href={`https://archive.org/details/${item.identifier}`} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Import Badge for the list view
import { Badge } from "@/components/ui/badge";

export default ContentGrid;
