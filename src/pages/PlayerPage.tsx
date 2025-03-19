
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import {
  Eye,
  Calendar,
  ExternalLink,
  Share2,
  Heart,
  AlertTriangle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getItemDetails, isPlayableMediaFile } from "@/services/archiveApi";
import { useFavoritesContext } from "@/providers/FavoritesProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import MoviePlayer from "@/components/MoviePlayer";
import MusicPlayer from "@/components/MusicPlayer";
import ContentGrid from "@/components/ContentGrid";
import EpisodeSelector from "@/components/EpisodeSelector";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ContentLoader from "@/components/ContentLoader";

const PlayerPage = () => {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeMedia, setActiveMedia] = useState<string>("");
  const [activeMediaTitle, setActiveMediaTitle] = useState<string>("");
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoritesContext();
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [licenseError, setLicenseError] = useState<string | null>(null);
  
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
  
  // Check if content is legally monetizable
  useEffect(() => {
    if (itemDetails) {
      if (!itemDetails.isLegallyMonetizable) {
        console.warn("Non-monetizable content detected:", itemDetails.identifier);
        setLicenseError("This content cannot be displayed due to licensing restrictions. Only content with Public Domain (CC0) or Creative Commons Attribution (CC-BY) licenses can be shown.");
        setActiveMedia("");
      } else {
        setLicenseError(null);
      }
    }
  }, [itemDetails]);
  
  // Function to get related items from collection
  const getRelatedItemsFromCollection = async (itemId: string) => {
    if (!itemDetails?.collection || itemDetails.collection.length === 0) {
      return [];
    }
    
    const collection = itemDetails.collection[0];
    const url = `https://archive.org/advancedsearch.php?q=collection:${encodeURIComponent(collection)} AND (licenseurl:(*publicdomain* OR *creativecommons.org/licenses/by/*) OR rights:(*publicdomain* OR *CC-BY*) OR license:(*publicdomain* OR *CC-BY*)) AND -licenseurl:(*nc* OR *noncommercial* OR *non-commercial*) AND -rights:(*nc* OR *noncommercial* OR *non-commercial*) AND -license:(*nc* OR *noncommercial* OR *non-commercial*) AND -licenseurl:*nd* AND -rights:*nd* AND -license:*nd*&output=json&rows=10&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch related items");
    }
    
    const data = await response.json();
    
    // Filter for monetizable content and remove the current item
    return data.response.docs
      .filter((item: any) => item.identifier !== itemId)
      .filter((item: any) => {
        // Check if license is monetizable
        const licenseUrl = item.licenseurl;
        const rights = item.rights;
        const license = item.license;
        
        // Check for monetizable licenses
        const containsMonetizable = [
          'publicdomain',
          'creativecommons.org/publicdomain/zero',
          'creativecommons.org/licenses/by/',
          'cc-by',
          'cc0'
        ].some(term => {
          const licenseInfo = [licenseUrl, rights, license].filter(Boolean).join(' ').toLowerCase();
          return licenseInfo.includes(term);
        });
        
        // Check for non-monetizable terms
        const containsNonMonetizable = [
          'nc',
          'non-commercial',
          'noncommercial',
          'all rights reserved',
          'nd',
          'no derivative'
        ].some(term => {
          const licenseInfo = [licenseUrl, rights, license].filter(Boolean).join(' ').toLowerCase();
          return licenseInfo.includes(term);
        });
        
        return containsMonetizable && !containsNonMonetizable;
      });
  };
  
  // Fetch related items
  const { data: relatedItems, isLoading: isRelatedLoading } = useQuery({
    queryKey: ["relatedItems", id],
    queryFn: () => getRelatedItemsFromCollection(id!),
    enabled: !!id && !!itemDetails?.collection?.[0] && !licenseError,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Extract media files from item details
  const episodeFiles = itemDetails?.files || [];
  
  // Improved handling of setting the initial media file
  useEffect(() => {
    if (itemDetails && episodeFiles.length > 0 && !activeMedia && !licenseError) {
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
  }, [itemDetails, id, episodeFiles, activeMedia, licenseError]);
  
  // Check if item is in favorites
  useEffect(() => {
    if (itemDetails && id) {
      setIsFavoriteState(isFavorite(itemDetails.identifier));
    }
  }, [favorites, itemDetails, id, isFavorite]);
  
  // Toggle favorite status
  const toggleFavorite = async () => {
    if (itemDetails) {
      if (isFavoriteState) {
        await removeFavorite(itemDetails.identifier);
        toast({
          title: "Removed from favorites",
          description: `"${itemDetails.title}" has been removed from your favorites.`
        });
      } else {
        await addFavorite({
          id: itemDetails.identifier,
          title: itemDetails.title,
          creator: itemDetails.creator,
          description: itemDetails.description || "",
          mediaType: mediaType!,
          thumbnail: itemDetails.thumbnailUrl || "",
          url: `/play/${mediaType}/${itemDetails.identifier}`,
        });
        toast({
          title: "Added to favorites",
          description: `"${itemDetails.title}" has been added to your favorites.`
        });
      }
      setIsFavoriteState(!isFavoriteState);
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
      
      // Important: Reset media player before changing source
      if (mediaType === "video" || mediaType === "movies") {
        const videoElement = document.querySelector('video');
        if (videoElement) {
          videoElement.pause();
          videoElement.currentTime = 0;
          videoElement.load();
        }
      }
      
      // Clear and set new media URL
      setActiveMedia("");
      setTimeout(() => {
        setActiveMedia(episodeUrl);
        setActiveMediaTitle(episodeName.split('/').pop() || episodeName);
        setMediaError(null);
        
        toast({
          title: "Loading media",
          description: `Playing: ${episodeName.split('/').pop() || episodeName}`,
        });
      }, 50);
      
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
        <ContentLoader 
          visible={true}
          className="py-24" 
          text="Loading content..."
        />
      ) : error ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="text-gray-500">Failed to load content.</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => refetch()} variant="outline">Try Again</Button>
            <Button onClick={() => navigate('/')} variant="default">Go Home</Button>
          </div>
        </div>
      ) : licenseError ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Content Unavailable</h2>
          <Alert variant="destructive" className="max-w-2xl mx-auto mb-4">
            <AlertTitle>Licensing Restriction</AlertTitle>
            <AlertDescription>{licenseError}</AlertDescription>
          </Alert>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">
            For legal compliance and monetization purposes, we can only display content with appropriate licensing. 
            You can still access this content directly on the Internet Archive website.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => navigate('/')} variant="outline">Go Home</Button>
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
                    key={activeMedia} // Add key to force re-render on source change
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
                    key={activeMedia} // Add key to force re-render on source change
                  />
                )}
              </div>
              
              {/* License info */}
              {itemDetails?.isLegallyMonetizable && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4 text-sm">
                  <p className="text-green-700 dark:text-green-300">
                    Licensed content: {
                      itemDetails.license || 
                      itemDetails.licenseurl || 
                      itemDetails.rights || 
                      "Public Domain / Creative Commons"
                    }
                  </p>
                </div>
              )}
              
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
                      variant={isFavoriteState ? "default" : "outline"}
                      size="icon"
                      onClick={toggleFavorite}
                      className={isFavoriteState ? "text-white" : ""}
                    >
                      <Heart className={`w-5 h-5 ${isFavoriteState ? "fill-current" : ""}`} />
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
