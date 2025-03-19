import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface MoviePlayerProps {
  src: string;
  title: string;
  poster?: string;
}

const MoviePlayer = ({ src, title, poster }: MoviePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [qualityLevel, setQualityLevel] = useState("auto");
  const [lastTapTime, setLastTapTime] = useState(0);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Enhanced state for format support and fallbacks
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<string | null>(null);
  const [fallbackSources, setFallbackSources] = useState<string[]>([]);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [attemptingFallback, setAttemptingFallback] = useState(false);
  
  // Reset state when source changes
  useEffect(() => {
    if (!src) return;
    
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLoadError(null);
    setCurrentSourceIndex(0);
    setAttemptingFallback(false);
    
    // Generate fallback sources if available
    generateFallbackSources(src);
    
    // This helps ensure the video element reloads properly
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);
  
  // Generate fallback sources for various formats
  const generateFallbackSources = (originalSrc: string) => {
    if (!originalSrc) return;
    
    try {
      const urlParts = originalSrc.split('/');
      const filename = urlParts.pop() || '';
      const basePath = urlParts.join('/');
      const itemId = basePath.split('/').pop();
      
      // Extract base filename without extension
      const baseFilename = filename.split('.').slice(0, -1).join('.');
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      
      // Create an array of possible fallback sources
      const possibleExtensions = ['mp4', 'webm', 'ogv', 'mov'];
      
      // Only add extensions different from the current one
      const fallbacks = possibleExtensions
        .filter(ext => ext !== extension)
        .map(ext => {
          // Check for derivatives or other versions
          if (originalSrc.includes('.ia.')) {
            // Archive.org derivative format
            return `${basePath}/${baseFilename}.ia.${ext}`;
          } else {
            // Regular format
            return `${basePath}/${baseFilename}.${ext}`;
          }
        });
      
      // Also add possible derivatives
      if (!originalSrc.includes('.ia.')) {
        fallbacks.push(`${basePath}/${baseFilename}.ia.mp4`);
      }
      
      console.log("Generated fallback sources:", fallbacks);
      setFallbackSources(fallbacks);
      
      // Determine current source format
      detectSourceFormat(extension);
      
    } catch (error) {
      console.error("Error generating fallback sources:", error);
    }
  };
  
  // Detect source format based on extension or URL
  const detectSourceFormat = (extension: string) => {
    const format = extension.toLowerCase();
    let mimeType = 'video/mp4'; // Default
    
    switch (format) {
      case 'mp4':
      case 'm4v':
        mimeType = 'video/mp4';
        break;
      case 'webm':
        mimeType = 'video/webm';
        break;
      case 'ogv':
      case 'ogg':
        mimeType = 'video/ogg';
        break;
      case 'mov':
        mimeType = 'video/quicktime';
        break;
      case 'avi':
        mimeType = 'video/x-msvideo';
        break;
      case 'wmv':
        mimeType = 'video/x-ms-wmv';
        break;
      case 'flv':
        mimeType = 'video/x-flv';
        break;
      case 'mkv':
        mimeType = 'video/x-matroska';
        break;
      case 'ts':
        mimeType = 'video/mp2t';
        break;
      default:
        mimeType = 'video/mp4'; // Default to MP4
    }
    
    console.log(`Detected format: ${format}, MIME type: ${mimeType}`);
    setSourceType(mimeType);
  };
  
  // Try next fallback source
  const tryNextSource = () => {
    if (currentSourceIndex < fallbackSources.length) {
      setAttemptingFallback(true);
      const nextSource = fallbackSources[currentSourceIndex];
      console.log(`Trying fallback source #${currentSourceIndex + 1}:`, nextSource);
      
      // Determine format for the new source
      const extension = nextSource.split('.').pop()?.toLowerCase() || '';
      detectSourceFormat(extension);
      
      setCurrentSourceIndex(prevIndex => prevIndex + 1);
      
      // Reset video element
      if (videoRef.current) {
        videoRef.current.load();
      }
    } else {
      // All fallbacks failed
      setAttemptingFallback(false);
      setLoadError("Unable to play this video. None of the available formats are supported by your browser.");
      console.error("All fallback sources failed");
    }
  };
  
  // Control visibility timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, showControls]);
  
  // Format time (e.g., 125 seconds -> "2:05")
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Handle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error("Error playing video:", err);
        // If autoplay was blocked, inform the user
        if (err.name === "NotAllowedError") {
          toast({
            title: "Autoplay blocked",
            description: "Click the play button to start playback",
            duration: 3000,
          });
        }
      });
    }
    
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    video.volume = volumeValue / 100;
    setIsMuted(volumeValue === 0);
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.volume = volume / 100;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };
  
  // Handle time update
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setCurrentTime(video.currentTime);
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    
    if (!isFullscreen) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    if (!video || !progressBar) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Enhanced error handling for video loading
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    console.error("Video loading error:", video.error?.code, video.error?.message);
    
    // If we're already trying fallbacks and still getting errors
    if (attemptingFallback) {
      tryNextSource(); // Try next source
      return;
    }
    
    // First error, let's try fallbacks
    if (fallbackSources.length > 0) {
      console.log("Primary format failed, trying fallbacks...");
      tryNextSource();
    } else {
      // No fallbacks available, show error
      let errorMessage = "Unable to play this video format.";
      if (video.error) {
        switch (video.error.code) {
          case 1: // MEDIA_ERR_ABORTED
            errorMessage = "Video playback was aborted.";
            break;
          case 2: // MEDIA_ERR_NETWORK
            errorMessage = "Network error occurred while loading the video.";
            break;
          case 3: // MEDIA_ERR_DECODE
            errorMessage = "Video format is not supported by your browser.";
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            errorMessage = "This video format is not supported by your browser.";
            break;
          default:
            errorMessage = `Video error: ${video.error.message}`;
        }
      }
      
      setLoadError(errorMessage);
      toast({
        title: "Video Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  // Modify metadata loaded handler to clear errors and set state
  const handleMetadataLoaded = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setDuration(video.duration);
    setLoadError(null);
    setAttemptingFallback(false);
    
    console.log("Video metadata loaded successfully");
    
    // If we were previously showing an error but fallback succeeded
    if (loadError) {
      toast({
        title: "Video loaded",
        description: "Alternative format loaded successfully",
        duration: 2000,
      });
    }
  };
  
  // Add a function to retry loading the video
  const retryLoading = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setLoadError(null);
    setCurrentSourceIndex(0); // Start from the first source again
    setAttemptingFallback(false);
    
    // Reload current source
    video.load();
    
    toast({
      title: "Retrying playback",
      description: "Attempting to reload the video",
      duration: 2000,
    });
  };
  
  // Skip forward/backward
  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.min(Math.max(video.currentTime + seconds, 0), duration);
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setShowControls(true);
    
    toast({
      title: seconds > 0 ? "Fast Forward" : "Rewind",
      description: `${Math.abs(seconds)} seconds`,
      duration: 1500,
    });
  };
  
  // Handle playback speed change
  const handlePlaybackSpeedChange = (speed: string) => {
    const video = videoRef.current;
    if (!video) return;
    
    const speedValue = parseFloat(speed);
    video.playbackRate = speedValue;
    setPlaybackSpeed(speedValue);
    
    toast({
      title: "Playback Speed",
      description: `${speed}x`,
      duration: 1500,
    });
  };
  
  // Handle quality change (simulated as Archive.org doesn't support multiple qualities)
  const handleQualityChange = (quality: string) => {
    setQualityLevel(quality);
    
    toast({
      title: "Video Quality",
      description: quality === "auto" ? "Auto (Best quality)" : quality,
      duration: 1500,
    });
    
    // In a real implementation, this would switch video sources
    // Since we can't actually change quality on archive.org videos, this is just UI feedback
  };
  
  // Handle double tap gesture
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime;
    const player = playerRef.current;
    
    if (!player) return;
    
    // Detect if it's a double tap (300ms threshold)
    if (timeSinceLastTap < 300) {
      const rect = player.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const playerWidth = rect.width;
      
      // Determine if tap is on left or right side
      if (x < playerWidth / 2) {
        // Left side - rewind
        skip(-10);
      } else {
        // Right side - fast forward
        skip(10);
      }
    }
    
    setLastTapTime(now);
    setTapPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Determine current source URL to use
  const getCurrentSource = () => {
    if (attemptingFallback && currentSourceIndex > 0 && currentSourceIndex <= fallbackSources.length) {
      return fallbackSources[currentSourceIndex - 1];
    }
    return src;
  };
  
  return (
    <motion.div 
      ref={playerRef}
      className="relative w-full rounded-xl overflow-hidden bg-black aspect-video"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseMove={() => setShowControls(true)}
      onClick={handleTap}
    >
      {loadError && !attemptingFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white">
          <div className="text-center p-4">
            <h3 className="text-xl font-medium mb-2">Video Playback Error</h3>
            <p className="mb-4 text-gray-400">{loadError}</p>
            <Button onClick={retryLoading}>Retry</Button>
            {src && (
              <Button variant="outline" className="ml-2" asChild>
                <a 
                  href={src} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Open Video Directly
                </a>
              </Button>
            )}
          </div>
        </div>
      ) : null}
      
      {/* Updated video element with multiple source options */}
      {getCurrentSource() ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleMetadataLoaded}
          onError={handleVideoError}
          onEnded={() => setIsPlaying(false)}
          poster={poster}
          preload="metadata"
          key={getCurrentSource()} // Important: Add key to force video element to re-render when src changes
        >
          {/* Primary source */}
          <source src={getCurrentSource()} type={sourceType || undefined} />
          
          {/* Show loading message while attempting fallbacks */}
          {attemptingFallback && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <p>Trying alternative format...</p>
            </div>
          )}
          
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 text-white">
          <p>No video source provided</p>
        </div>
      )}
      
      {/* Overlay for title */}
      {showControls && (
        <motion.div 
          className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/70 to-transparent text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-medium">{title}</h3>
        </motion.div>
      )}
      
      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Button 
            variant="outline" 
            size="icon"
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-white/40 backdrop-blur-sm"
            onClick={togglePlay}
          >
            <Play className="w-8 h-8 text-white" />
          </Button>
        </div>
      )}
      
      {/* Controls */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full px-4 pb-4 pt-10 bg-gradient-to-t from-black/70 to-transparent text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress bar */}
        <div 
          className="w-full h-1.5 mb-4 bg-white/30 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/80 hover:text-white"
              onClick={() => skip(-10)}
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/80 hover:text-white"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/80 hover:text-white"
              onClick={() => skip(10)}
            >
              <SkipForward className="w-5 h-5" />
            </Button>
            
            <span className="text-sm text-white/70">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 w-24">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white/80 hover:text-white"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
            
            {/* Playback Speed Control */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white/80 hover:text-white hidden sm:flex"
                >
                  {playbackSpeed}x
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-1">
                  <h4 className="font-medium mb-2">Playback Speed</h4>
                  <div className="grid grid-cols-3 gap-1">
                    {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((speed) => (
                      <Button 
                        key={speed} 
                        variant={playbackSpeed === speed ? "default" : "outline"}
                        className="text-sm" 
                        size="sm"
                        onClick={() => handlePlaybackSpeedChange(speed.toString())}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Quality Selection */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white/80 hover:text-white hidden sm:flex"
                  size="icon"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div>
                  <h4 className="font-medium mb-2">Video Quality</h4>
                  <Select 
                    value={qualityLevel} 
                    onValueChange={handleQualityChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Recommended)</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="360p">360p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/80 hover:text-white"
              onClick={toggleFullscreen}
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MoviePlayer;
