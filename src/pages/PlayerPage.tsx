import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import {
  Eye,
  Calendar,
  ExternalLink,
  Share2,
  Heart,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getItemDetails, isPlayableMediaFile } from "@/services/archiveApi";
import { useFavorites } from "@/providers/FavoritesProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import MoviePlayer from "@/components/MoviePlayer";
import MusicPlayer from "@/components/MusicPlayer";
import ContentGrid from "@/components/ContentGrid";
import EpisodeSelector from "@/components/EpisodeSelector";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PlayerPage = () => {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeMedia, setActiveMedia] = useState<string>("");
  const [activeMediaTitle, setActiveMediaTitle] = useState<string>("");
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  
  // Fetch item details with proper error handling for current React Query version
  const { data: itemDetails, isLoading, error, refetch } = useQuery({
    queryKey: ["itemDetails", id],
    queryFn: () => getItemDetails(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
  
  // Handle error side effect outside the query config
  useEffect(() => {
    if (error) {
      console.error("Error fetching item details:", error);
      toast({
        title: "Error loading content",
        description: "There was a problem loading the media details. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  // Function to get related items from collection
  const getRelatedItemsFromCollection = async (itemId: string) => {
    if (!itemDetails?.collection || itemDetails.collection.length === 0) {
      return [];
    }
    
    const collection = itemDetails.collection[0];
    const url = `https://archive.org/advancedsearch.php?q=collection:${encodeURIComponent(collection)}&output=json&rows=10&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate&sort[]=downloads desc`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch related items");
    }
    
    const data = await response.json();
    // Filter out the current item
    return data.response.docs.filter((item: any) => item.identifier !== itemId);
  };
  
  // Fetch related items
  const { data: relatedItems, isLoading: isRelatedLoading } = useQuery({
    queryKey: ["relatedItems", id],
    queryFn: () => getRelatedItemsFromCollection(id!),
    enabled: !!id && !!itemDetails?.collection?.[0],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Extract media files from item details
  const episodeFiles = itemDetails?.files || [];
  
  // Improved handling of setting the initial media file
  useEffect(() => {
    if (itemDetails && episodeFiles.length > 0) {
      setMediaError(null);
      console.log("Total files available:", episodeFiles.length);
      
      try {
        // Find playable files using our improved detection function
        const playableFiles = episodeFiles.filter(isPlayableMediaFile);
        console.log("Playable files found:", playableFiles.length);
        
        if (playableFiles.length > 0) {
          // Select the first playable file
          const firstPlayableFile = playableFiles[0];
          
          // For videos, prefer the MP4 derivative if available for better browser compatibility
          const mp4Version = playableFiles.find(file => 
            file.name.toLowerCase().endsWith('.mp4') && 
            file.source === 'derivative'
          );
          
          const fileToUse = mp4Version || firstPlayableFile;
          console.log("Selected file for playback:", fileToUse.name);
          
          const initialMediaUrl = `https://archive.org/download/${id}/${encodeURIComponent(fileToUse.name)}`;
          setActiveMedia(initialMediaUrl);
          setActiveMediaTitle(fileToUse.name.split('/').pop() || fileToUse.name);
          
          console.log("Setting initial media:", {
            url: initialMediaUrl,
            title: fileToUse.name,
            format: fileToUse.format
          });
        } else {
          console.warn("No playable media files found");
          setMediaError("No playable media files found for this item.");
        }
      } catch (err) {
        console.error("Error setting initial media:", err);
        setMediaError("Error preparing media files for playback.");
      }
    }
  }, [itemDetails, id, episodeFiles]);
  
  // Check if item is in favorites
  useEffect(() => {
    if (itemDetails) {
      setIsFavorite(favorites.some((fav) => fav.id === itemDetails.identifier));
    }
  }, [favorites, itemDetails]);
  
  // Toggle favorite status
  const toggleFavorite = () => {
    if (itemDetails) {
      if (isFavorite) {
        removeFavorite(itemDetails.identifier);
        toast({
          title: "Removed from favorites",
          description: `"${itemDetails.title}" has been removed from your favorites.`
        });
      } else {
        addFavorite({
          id: itemDetails.identifier,
          title: itemDetails.title,
          creator: itemDetails.creator,
          thumbnailUrl: itemDetails.thumbnailUrl,
          mediaType: mediaType!,
        });
        toast({
          title: "Added to favorites",
          description: `"${itemDetails.title}" has been added to your favorites.`
        });
      }
      setIsFavorite(!isFavorite);
    }
  };
  
  // Handle sharing functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: itemDetails?.title || "Check out this content!",
          text: `I found this on Kelper: ${itemDetails?.title}`,
          url: window.location.href,
        });
        console.log("Successfully shared");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard(window.location.href);
    }
  };
  
  // Helper function to copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link copied!",
        description: "Link has been copied to clipboard."
      });
    }, (err) => {
      console.error("Failed to copy: ", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    });
  };
  
  // Improved episode selection with better error handling
  const handleEpisodeSelect = (episodeUrl: string, episodeName: string, file?: any) => {
    try {
      console.log("Selected episode:", episodeName);
      console.log("Episode URL:", episodeUrl);
      
      setActiveMedia(episodeUrl);
      setActiveMediaTitle(episodeName.split('/').pop() || episodeName);
      setMediaError(null);
      
      toast({
        title: "Loading media",
        description: `Playing: ${episodeName.split('/').pop() || episodeName}`,
      });
      
    } catch (error) {
      console.error("Error selecting episode:", error);
      setMediaError("Unable to load selected media.");
      toast({
        title: "Media Error",
        description: "Failed to load selected media. The file might be unavailable.",
        variant: "destructive"
      });
    }
  };
  
  // Check if files appear to be episodes based on filenames
  const hasEpisodes = episodeFiles.length > 0;
  
  return (
    <div className="pt-20 pb-28 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-8 w-1/2 mt-4" />
            </div>
            <div className="w-full lg:w-1/3">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="text-gray-500">Failed to load content.</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => refetch()} variant="outline">Try Again</Button>
            <Button onClick={() => navigate('/')} variant="default">Go Home</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Hero section with info */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Media player */}
            <div className="w-full lg:w-2/3 flex flex-col">
              {/* Media Player */}
              <div className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden mb-4">
                {mediaError ? (
                  <div className="aspect-video flex items-center justify-center bg-black/80 p-6">
                    <div className="text-center max-w-md">
                      <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Media Error</AlertTitle>
                        <AlertDescription>{mediaError}</AlertDescription>
                      </Alert>
                      <p className="text-sm text-gray-400 mb-4">
                        This may be due to browser restrictions, CORS policies, or the media format.
                        Try accessing the content directly on Archive.org.
                      </p>
                      <Button 
                        variant="default" 
                        asChild
                      >
                        <a 
                          href={`https://archive.org/details/${id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Archive.org
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : mediaType === "video" || mediaType === "movies" ? (
                  <MoviePlayer
                    src={activeMedia}
                    title={activeMediaTitle}
                    poster={itemDetails?.thumbnailUrl || ""}
                  />
                ) : (
                  <MusicPlayer
                    tracks={[{
                      id: itemDetails?.identifier || "track-1",
                      title: activeMediaTitle || itemDetails?.title || "Unknown Track",
                      artist: itemDetails?.creator || "Unknown Artist",
                      src: activeMedia,
                      coverArt: itemDetails?.thumbnailUrl || ""
                    }]}
                    initialTrackIndex={0}
                  />
                )}
              </div>
              
              {/* Title and controls */}
              <div className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex flex-col space-y-4">
                  {/* Media title */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">
                        {itemDetails?.title || "Unknown Title"}
                      </h1>
                      {itemDetails?.creator && (
                        <p className="text-gray-500 dark:text-gray-400">
                          {itemDetails.creator}
                        </p>
                      )}
                      {itemDetails?.date && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {itemDetails.date}
                        </p>
                      )}
                    </div>
                    <Button
                      variant={isFavorite ? "default" : "outline"}
                      size="icon"
                      onClick={toggleFavorite}
                      className={isFavorite ? "text-white" : ""}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  
                  {/* Views and buttons */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>
                          {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(itemDetails?.downloads || 0)} views
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {itemDetails?.addedDate ? format(new Date(itemDetails.addedDate), 'MMM d, yyyy') : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                        <a 
                          href={`https://archive.org/details/${id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on Archive.org
                        </a>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Description and episodes/files selector */}
            <div className="w-full lg:w-1/3 space-y-4">
              {/* Description */}
              <div className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {itemDetails?.description ? (
                    <ScrollArea className="h-[200px]">
                      <p className="whitespace-pre-line">{itemDetails.description}</p>
                    </ScrollArea>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No description available.</p>
                  )}
                </div>
              </div>
              
              {/* Only show the episode selector here */}
              {hasEpisodes && (
                <div className="h-[400px]">
                  <EpisodeSelector
                    episodeFiles={episodeFiles}
                    itemId={id!}
                    activeEpisode={activeMedia}
                    onEpisodeSelect={handleEpisodeSelect}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Related content */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium">You might also like</h2>
            {isRelatedLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-black/10 dark:bg-white/5">
                    <Skeleton className="w-full aspect-video" />
                    <div className="p-3">
                      <Skeleton className="h-4 w-2/3 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ContentGrid 
                items={relatedItems || []}
                isLoading={isRelatedLoading}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
