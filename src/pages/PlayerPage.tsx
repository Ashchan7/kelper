import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import MoviePlayer from "@/components/MoviePlayer";
import MusicPlayer from "@/components/MusicPlayer";
import { getItemDetails } from "@/services/archiveApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Heart, ExternalLink, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const PlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [itemDetails, setItemDetails] = useState<any | null>(null);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
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
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, we would also update this in a database or local storage
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
  
  // Get the main video file for the movie player with improved detection
  const getMainVideoFile = () => {
    if (!mediaFiles.length || mediaType !== 'movies') return null;
    
    // First try to find a file with a standard video extension
    const standardVideo = mediaFiles.find(file => 
      file.name.toLowerCase().match(/\.(mp4|webm|mov)$/i)
    );
    
    if (standardVideo) return standardVideo;
    
    // If no standard video found, sort by size (typically the largest file is the main movie)
    const sortedFiles = [...mediaFiles].sort((a, b) => (b.size || 0) - (a.size || 0));
    
    return sortedFiles[0];
  };
  
  const mainVideoFile = getMainVideoFile();
  const audioTracks = getAudioTracks();
  
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
      <div className="max-w-4xl mx-auto">
        {/* Back button and title */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to={mediaType === 'movies' ? '/movies' : '/music'}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          
          <h1 className="text-2xl font-medium text-center flex-1 mx-4">
            {itemDetails?.title || "Media Player"}
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
          ) : mediaType === 'movies' && mainVideoFile ? (
            <MoviePlayer 
              src={`https://archive.org/download/${id}/${encodeURIComponent(mainVideoFile.name)}`}
              title={itemDetails?.title || ""}
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
        
        {/* Metadata */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-medium mb-4">About</h2>
          
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
        </motion.div>
        
        {/* File list (for debugging/power users) */}
        {mediaFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-medium mb-4">Files</h2>
            
            <div className="overflow-hidden bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-xl">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-black/10 dark:bg-white/5">
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
