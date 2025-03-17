import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import MoviePlayer from "@/components/MoviePlayer";
import MusicPlayer from "@/components/MusicPlayer";
import EpisodeSelector from "@/components/EpisodeSelector";
import { getItemDetails } from "@/services/archiveApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Heart, ExternalLink, Share2, ListVideo } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const PlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [itemDetails, setItemDetails] = useState<any | null>(null);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string>("");
  const [activeMediaTitle, setActiveMediaTitle] = useState<string>("");
  const { toast } = useToast();
  
  // Check if we're dealing with a movie or audio
  const mediaType = location.state?.mediaType || 
                  (location.pathname.includes('/movies/') ? 'movies' : 
                   location.pathname.includes('/music/') ? 'audio' : 'movies'); // Default to movies if none specified
  
  useEffect(() => {
    if (!id) return;
    
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getItemDetails(id);
        console.log("Item details:", data);
        
        setItemDetails(data.metadata);
        
        // Get suitable files for playback
        const files: any[] = data.files || [];
        
        console.log("All files:", files);
        
        // More inclusive file detection - accept more formats and be more permissive
        const suitableFiles = files.filter((file: any) => {
          if (!file || !file.name) return false;
          
          const name = file.name.toLowerCase();
          const format = (file.format || '').toLowerCase();
          
          if (mediaType === 'movies') {
            return (
              name.endsWith('.mp4') || 
              name.endsWith('.webm') || 
              name.endsWith('.mov') ||
              name.endsWith('.avi') ||
              name.endsWith('.mkv') ||
              name.endsWith('.ogv') ||
              name.endsWith('.m4v') ||
              format.includes('video') ||
              name.includes('video') ||
              // Accept more file types that might be video
              name.includes('movie') ||
              name.includes('film')
            );
          } else if (mediaType === 'audio') {
            return (
              name.endsWith('.mp3') || 
              name.endsWith('.ogg') || 
              name.endsWith('.wav') || 
              name.endsWith('.flac') ||
              name.endsWith('.m4a') ||
              name.endsWith('.aac') ||
              format.includes('audio') ||
              name.includes('audio') ||
              name.includes('sound') ||
              name.includes('track')
            );
          }
          
          return false;
        });
        
        console.log("Suitable files:", suitableFiles);
        
        if (suitableFiles.length === 0) {
          // If no suitable files found, try to find ANY file that might be playable
          // Be very permissive here to catch anything that could be media
          const fallbackFiles = files.filter((file: any) => {
            if (!file || !file.name) return false;
            
            const name = file.name.toLowerCase();
            const format = (file.format || '').toLowerCase();
            
            // Accept any file that remotely looks like it could be media
            return name.includes('video') || 
                  name.includes('audio') || 
                  name.includes('media') ||
                  name.includes('mp') ||
                  format.includes('video') || 
                  format.includes('audio') ||
                  // These are common extensions
                  /\.(mp4|webm|mov|avi|mkv|ogv|mp3|ogg|wav|flac|m4a)$/i.test(name);
          });
          
          console.log("Fallback files:", fallbackFiles);
          
          if (fallbackFiles.length > 0) {
            setMediaFiles(fallbackFiles);
          } else {
            // Last resort: just take the first 5 files of any type
            setMediaFiles(files.slice(0, 5));
            
            toast({
              title: "Limited playback support",
              description: "We couldn't find optimal media files. Try viewing the content on Archive.org directly.",
              variant: "destructive"
            });
          }
        } else {
          setMediaFiles(suitableFiles);
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Failed to load media details. Please try again later.");
        toast({
          title: "Error loading media",
          description: "There was a problem loading the media. Please try another item.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDetails();
  }, [id, mediaType, toast]);
  
  useEffect(() => {
    // Set the initial active media file
    if (mediaFiles.length > 0 && !activeMediaUrl) {
      const mainFile = getMainMediaFile();
      if (mainFile) {
        let title = itemDetails?.title || "Media";
        
        // If we have multiple files that look like episodes, add episode info to title
        if (mediaFiles.length > 1 && hasEpisodePattern(mediaFiles)) {
          const episodeInfo = extractEpisodeInfo(mainFile.name);
          if (episodeInfo) {
            title = `${title} - ${episodeInfo}`;
          }
        }
        
        setActiveMediaUrl(`https://archive.org/download/${id}/${encodeURIComponent(mainFile.name)}`);
        setActiveMediaTitle(title);
      }
    }
  }, [mediaFiles, id, itemDetails]);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, we would also update this in a database or local storage
  };
  
  // Check if files appear to be episodes based on filenames
  const hasEpisodePattern = (files: any[]) => {
    // Check if multiple files with episode-like patterns in names
    const episodePatterns = [
      /EP\d+/i,                  // EP01, EP1
      /E\d+/i,                   // E01, E1
      /Episode[\s-_]?\d+/i,      // Episode 1, Episode-1
      /Part[\s-_]?\d+/i,         // Part 1, Part-1
      /\d+[\s-_]of[\s-_]\d+/i    // 1 of 5
    ];
    
    let episodeCount = 0;
    for (const file of files) {
      for (const pattern of episodePatterns) {
        if (pattern.test(file.name)) {
          episodeCount++;
          break;
        }
      }
    }
    
    // If more than one file matches episode patterns, consider it an episode collection
    return episodeCount > 1;
  };
  
  // Extract episode info from filename
  const extractEpisodeInfo = (filename: string) => {
    const episodePatterns = [
      { pattern: /EP(\d+)/i, prefix: "Episode" },                 // EP01, EP1
      { pattern: /E(\d+)/i, prefix: "Episode" },                  // E01, E1
      { pattern: /Episode[\s-_]?(\d+)/i, prefix: "Episode" },     // Episode 1, Episode-1
      { pattern: /Part[\s-_]?(\d+)/i, prefix: "Part" },           // Part 1, Part-1
      { pattern: /(\d+)[\s-_]of[\s-_]\d+/i, prefix: "Part" }      // 1 of 5
    ];
    
    for (const { pattern, prefix } of episodePatterns) {
      const match = filename.match(pattern);
      if (match && match[1]) {
        return `${prefix} ${match[1]}`;
      }
    }
    
    return null;
  };
  
  // Check if file is a valid media file for playback
  const isPlayableMedia = (file: any) => {
    if (!file || !file.name) return false;
    
    const name = file.name.toLowerCase();
    const format = (file.format || '').toLowerCase();
    
    if (mediaType === 'movies') {
      return (
        name.endsWith('.mp4') || 
        name.endsWith('.webm') || 
        name.endsWith('.mov') ||
        name.endsWith('.avi') ||
        name.endsWith('.mkv') ||
        name.endsWith('.ogv') ||
        name.endsWith('.m4v') ||
        format.includes('video')
      );
    } else if (mediaType === 'audio') {
      return (
        name.endsWith('.mp3') || 
        name.endsWith('.ogg') || 
        name.endsWith('.wav') || 
        name.endsWith('.flac') ||
        name.endsWith('.m4a') ||
        format.includes('audio')
      );
    }
    
    return false;
  };
  
  // Handle episode selection
  const handleEpisodeSelect = (url: string, title: string) => {
    console.log("Episode selected:", url, title);
    setActiveMediaUrl(url);
    setActiveMediaTitle(title);
  };
  
  // Prepare data for music player if needed
  const getAudioTracks = () => {
    if (!mediaFiles.length || mediaType !== 'audio') return [];
    
    return mediaFiles.map((file, index) => ({
      id: `${id}-track-${index}`,
      title: file.title || file.name.split('/').pop().split('.')[0] || `Track ${index + 1}`,
      artist: itemDetails?.creator || itemDetails?.artist || "Unknown Artist",
      src: `https://archive.org/download/${id}/${encodeURIComponent(file.name)}`,
      coverArt: `https://archive.org/services/img/${id}`,
    }));
  };
  
  // Get the main media file for the player with improved detection
  const getMainMediaFile = () => {
    if (!mediaFiles.length) return null;
    
    // First filter to only get playable media files
    const playableFiles = mediaFiles.filter(isPlayableMedia);
    
    if (playableFiles.length === 0) return null;
    
    if (mediaType === 'movies') {
      // First try to find a file with a standard video extension
      const standardVideo = playableFiles.find(file => 
        file.name.toLowerCase().match(/\.(mp4|webm|mov)$/i)
      );
      
      if (standardVideo) return standardVideo;
      
      // If no standard video found, sort by size (typically the largest file is the main movie)
      const sortedFiles = [...playableFiles].sort((a, b) => (b.size || 0) - (a.size || 0));
      
      return sortedFiles[0];
    } else if (mediaType === 'audio') {
      // For audio, prefer MP3 format
      const mp3File = playableFiles.find(file => 
        file.name.toLowerCase().endsWith('.mp3')
      );
      
      if (mp3File) return mp3File;
      
      // Otherwise take the first audio file
      return playableFiles[0];
    }
    
    return playableFiles[0];
  };
  
  const mainMediaFile = getMainMediaFile();
  const audioTracks = getAudioTracks();
  const hasMultipleEpisodes = mediaFiles.length > 1 && hasEpisodePattern(mediaFiles);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 pt-28 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-64 ml-4" />
          </div>
          
          <Skeleton className="w-full aspect-video rounded-xl mb-8" />
          
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-6 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  if (!itemDetails) {
    return (
      <div className="container mx-auto px-6 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No details found for this item.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-6 pt-28 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Back button and title */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to={mediaType === 'movies' ? '/movies' : '/music'}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          
          <h1 className="text-2xl font-medium text-center flex-1 mx-4 truncate">
            {activeMediaTitle || itemDetails?.title || "Media Player"}
          </h1>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isFavorite ? 'text-red-500' : ''}`}
            onClick={toggleFavorite}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
          </Button>
        </div>
        
        {/* Media Player */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {isLoading ? (
            <Skeleton className="w-full aspect-video rounded-xl" />
          ) : mediaType === 'movies' && activeMediaUrl ? (
            <MoviePlayer 
              src={activeMediaUrl}
              title={activeMediaTitle || itemDetails?.title || ""}
              poster={`https://archive.org/services/img/${id}`}
            />
          ) : mediaType === 'audio' && audioTracks.length > 0 ? (
            <MusicPlayer tracks={audioTracks} />
          ) : (
            <div className="w-full aspect-video bg-black/10 dark:bg-white/5 rounded-xl flex flex-col items-center justify-center p-6">
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
                No playable media found. The archive may not have streamable content.
              </p>
              <Button asChild variant="outline">
                <a 
                  href={`https://archive.org/details/${id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Archive.org
                </a>
              </Button>
            </div>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Panel - takes up 2/3 of space on desktop */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <Tabs defaultValue={hasMultipleEpisodes ? "episodes" : "about"}>
              <TabsList className="mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                {hasMultipleEpisodes && (
                  <TabsTrigger value="episodes" className="flex items-center gap-2">
                    <ListVideo className="w-4 h-4" />
                    Episodes
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="about" className="mt-0">
                <div className="bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-xl p-6">
                  <p className="mb-4">
                    {itemDetails.description || "No description available."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {itemDetails.creator && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Creator:</span>{" "}
                        {itemDetails.creator}
                      </div>
                    )}
                    
                    {itemDetails.date && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Date:</span>{" "}
                        {itemDetails.date}
                      </div>
                    )}
                    
                    {itemDetails.subject && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Subject:</span>{" "}
                        {Array.isArray(itemDetails.subject)
                          ? itemDetails.subject.join(", ")
                          : itemDetails.subject}
                      </div>
                    )}
                    
                    {itemDetails.language && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Language:</span>{" "}
                        {itemDetails.language}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://archive.org/details/${id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Archive.org
                      </a>
                    </Button>
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {hasMultipleEpisodes && (
                <TabsContent value="episodes" className="mt-0">
                  <EpisodeSelector 
                    episodeFiles={mediaFiles}
                    itemId={id || ""}
                    activeEpisode={activeMediaUrl}
                    onEpisodeSelect={handleEpisodeSelect}
                  />
                </TabsContent>
              )}
            </Tabs>
          </motion.div>
          
          {/* Episode Selector - shows on larger screens in sidebar */}
          {hasMultipleEpisodes && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:block h-[400px]"
            >
              <EpisodeSelector 
                episodeFiles={mediaFiles}
                itemId={id || ""}
                activeEpisode={activeMediaUrl}
                onEpisodeSelect={handleEpisodeSelect}
              />
            </motion.div>
          )}
        </div>
        
        {/* File list - only show when not showing episodes */}
        {mediaFiles.length > 0 && !hasMultipleEpisodes && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-medium mb-4">Files</h2>
            
            <div className="overflow-hidden bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-xl">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-black/10 dark:bg-white/5 sticky top-0 z-10">
                    <tr>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Type</th>
                      <th className="text-right p-3 font-medium">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediaFiles.map((file, index) => (
                      <tr 
                        key={index}
                        className="border-t border-white/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <td className="p-3">
                          <a 
                            href={`https://archive.org/download/${id}/${encodeURIComponent(file.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 dark:text-blue-400 hover:underline truncate block max-w-xs"
                          >
                            {file.name.split('/').pop()}
                          </a>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          {file.format || "Unknown"}
                        </td>
                        <td className="p-3 text-right">
                          {file.size ? formatBytes(file.size) : "Unknown"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Helper function to format bytes to human-readable format
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default PlayerPage;
