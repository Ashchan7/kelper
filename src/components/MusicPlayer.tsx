import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RepeatIcon, Shuffle, FileMusic } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Track {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  src: string;
  coverArt?: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  initialTrackIndex?: number;
}

const MusicPlayer = ({ tracks, initialTrackIndex = 0 }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Enhanced states for format support and fallbacks
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackSources, setFallbackSources] = useState<string[]>([]);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [attemptingFallback, setAttemptingFallback] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const currentTrack = tracks[currentTrackIndex];
  
  // Format time (e.g., 125 seconds -> "2:05")
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Generate fallback sources
  useEffect(() => {
    if (currentTrack?.src) {
      generateFallbackSources(currentTrack.src);
    }
  }, [currentTrack]);
  
  // Generate fallback sources for various formats
  const generateFallbackSources = (originalSrc: string) => {
    if (!originalSrc) return;
    
    try {
      const urlParts = originalSrc.split('/');
      const filename = urlParts.pop() || '';
      const basePath = urlParts.join('/');
      
      // Extract base filename without extension
      const baseFilename = filename.split('.').slice(0, -1).join('.');
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      
      // Create an array of possible fallback sources
      const possibleExtensions = ['mp3', 'ogg', 'wav', 'flac', 'm4a', 'aac', 'opus'];
      
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
      
      // Also try original/derivative versions
      if (!originalSrc.includes('.ia.')) {
        fallbacks.push(`${basePath}/${baseFilename}.ia.mp3`);
      }
      
      console.log("Generated audio fallback sources:", fallbacks);
      setFallbackSources(fallbacks);
      
    } catch (error) {
      console.error("Error generating fallback sources:", error);
    }
  };
  
  // Try next fallback source
  const tryNextSource = () => {
    if (currentSourceIndex < fallbackSources.length) {
      setAttemptingFallback(true);
      const nextSource = fallbackSources[currentSourceIndex];
      console.log(`Trying fallback audio source #${currentSourceIndex + 1}:`, nextSource);
      
      setCurrentSourceIndex(prevIndex => prevIndex + 1);
      
      // Reset audio element
      if (audioRef.current) {
        audioRef.current.src = nextSource;
        audioRef.current.load();
      }
    } else {
      // All fallbacks failed
      setAttemptingFallback(false);
      setLoadError("Unable to play this audio track. The format may not be supported by your browser.");
      console.error("All fallback sources failed");
    }
  };
  
  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error("Error playing audio:", err);
        
        // If it's a format issue, try fallbacks
        if (err.name === "NotSupportedError" && fallbackSources.length > 0) {
          tryNextSource();
        } else {
          toast({
            title: "Playback error",
            description: "Could not play this audio track.",
            variant: "destructive",
          });
        }
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle time update
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setCurrentTime(audio.currentTime);
  };
  
  // Handle metadata loaded
  const handleMetadataLoaded = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setDuration(audio.duration);
    setIsLoading(false);
    setLoadError(null);
    setAttemptingFallback(false);
    
    // If there's a predefined duration in the track data, use that
    if (currentTrack?.duration) {
      setDuration(currentTrack.duration);
    }
    
    // Dispatch a custom event to notify other components that media is ready
    const readyEvent = new CustomEvent('mediaready', { bubbles: true });
    audio.dispatchEvent(readyEvent);
    
    // If we were previously showing an error but fallback succeeded
    if (loadError) {
      toast({
        title: "Audio loaded",
        description: "Alternative format loaded successfully",
        duration: 2000,
      });
    }
  };
  
  // Handle track end
  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      // Repeat current track
      const audio = audioRef.current;
      if (!audio) return;
      
      audio.currentTime = 0;
      audio.play().catch(err => console.error("Error repeating track:", err));
    } else if (repeatMode === 'all' || currentTrackIndex < tracks.length - 1) {
      // Go to next track, or loop back to first track if in repeat all mode
      handleNext();
    } else {
      // End of playlist, not repeating
      setIsPlaying(false);
    }
  };
  
  // Handle next track
  const handleNext = () => {
    let nextIndex: number;
    
    if (isShuffled) {
      // Choose a random track that's not the current one
      const availableIndices = Array.from(
        { length: tracks.length },
        (_, i) => i
      ).filter(i => i !== currentTrackIndex);
      
      if (availableIndices.length === 0) return;
      
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Go to next track or loop to first if in repeat all mode
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    
    // Reset fallback system for new track
    setCurrentSourceIndex(0);
    setAttemptingFallback(false);
    
    // Play automatically when switching tracks
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error playing audio:", err);
          
          // If it's a format issue, try fallbacks
          if (err.name === "NotSupportedError" && fallbackSources.length > 0) {
            tryNextSource();
          }
        });
    }, 0);
  };
  
  // Handle previous track
  const handlePrevious = () => {
    // If we're more than 3 seconds into a track, go back to start of current track
    if (currentTime > 3) {
      const audio = audioRef.current;
      if (!audio) return;
      
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    
    let prevIndex: number;
    
    if (isShuffled) {
      // Choose a random track that's not the current one
      const availableIndices = Array.from(
        { length: tracks.length },
        (_, i) => i
      ).filter(i => i !== currentTrackIndex);
      
      if (availableIndices.length === 0) return;
      
      prevIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Go to previous track or loop to last if in repeat all mode
      prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    }
    
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    
    // Reset fallback system for new track
    setCurrentSourceIndex(0);
    setAttemptingFallback(false);
    
    // Play automatically when switching tracks
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error playing audio:", err);
          
          // If it's a format issue, try fallbacks
          if (err.name === "NotSupportedError" && fallbackSources.length > 0) {
            tryNextSource();
          }
        });
    }, 0);
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    audio.volume = volumeValue / 100;
    setIsMuted(volumeValue === 0);
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };
  
  // Handle seek
  const handleSeek = (newPosition: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const seekTime = (newPosition[0] / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  
  // Handle repeat mode
  const toggleRepeatMode = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };
  
  // Handle shuffle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };
  
  // Track selection from playlist (if implemented)
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    
    // Reset fallback system for new track
    setCurrentSourceIndex(0);
    setAttemptingFallback(false);
    
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error playing audio after track selection:", err);
          
          // If it's a format issue, try fallbacks
          if (err.name === "NotSupportedError" && fallbackSources.length > 0) {
            tryNextSource();
          }
        });
    }, 0);
  };
  
  // Enhanced error handling for audio loading
  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audio = e.currentTarget;
    console.error("Audio loading error:", audio.error);
    
    // Dispatch a custom event to notify loaders about the error
    const errorEvent = new CustomEvent('mediaerror', { bubbles: true });
    audio.dispatchEvent(errorEvent);
    
    // If we're already trying fallbacks
    if (attemptingFallback) {
      tryNextSource();
      return;
    }
    
    // First error, let's try fallbacks
    if (fallbackSources.length > 0) {
      console.log("Primary audio format failed, trying fallbacks...");
      tryNextSource();
    } else {
      // No fallbacks available
      setLoadError("Failed to load audio. The format may not be supported.");
      setIsPlaying(false);
      toast({
        title: "Audio Error",
        description: "Could not load the audio file. Please try another track.",
        variant: "destructive",
      });
    }
  };
  
  // Add a function to retry loading
  const retryLoading = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setLoadError(null);
    setIsLoading(true);
    setCurrentSourceIndex(0);
    setAttemptingFallback(false);
    
    // Reload with original source
    audio.src = currentTrack.src;
    audio.load();
    
    toast({
      title: "Retrying",
      description: "Attempting to reload the audio",
      duration: 2000,
    });
  };
  
  // Update when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    
    // Set volume based on current volume state
    audio.volume = isMuted ? 0 : volume / 100;
    
    // Reset error and loading states
    setLoadError(null);
    setIsLoading(true);
    setCurrentSourceIndex(0);
    setAttemptingFallback(false);
    
    // If was playing, attempt to start playing the new track
    if (isPlaying) {
      // Using a small timeout to ensure the audio has a chance to start loading
      setTimeout(() => {
        audio.play().catch(err => {
          console.error("Error playing audio after track change:", err);
          setIsPlaying(false);
          
          // Check if it's an autoplay policy error
          if (err.name === "NotAllowedError") {
            toast({
              title: "Autoplay Blocked",
              description: "Your browser blocked autoplay. Click play to start manually.",
              duration: 5000,
            });
          }
          // If it's a format issue, try fallbacks
          else if (err.name === "NotSupportedError" && fallbackSources.length > 0) {
            tryNextSource();
          }
        });
      }, 100);
    }
  }, [currentTrackIndex, currentTrack]);
  
  // Add an effect to handle successful playback start
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handlePlaybackStarted = () => {
      // This helps ensure the loader is definitely hidden when playback starts
      const playEvent = new CustomEvent('mediaplaybackstarted', { bubbles: true });
      audio.dispatchEvent(playEvent);
      
      // Also set our own loading state to false
      setIsLoading(false);
    };
    
    audio.addEventListener('playing', handlePlaybackStarted);
    
    return () => {
      audio.removeEventListener('playing', handlePlaybackStarted);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Enhanced audio element with fallback support */}
      <audio
        ref={audioRef}
        src={attemptingFallback && currentSourceIndex > 0 && currentSourceIndex <= fallbackSources.length 
          ? fallbackSources[currentSourceIndex - 1] 
          : currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadataLoaded}
        onEnded={handleTrackEnd}
        onError={handleAudioError}
        crossOrigin="anonymous"
        preload="metadata"
      />
      
      <motion.div 
        className="bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-xl overflow-hidden"
        layout
        transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
      >
        {loadError && !attemptingFallback ? (
          <div className="p-4 text-center">
            <div className="py-8">
              <div className="mb-4 text-red-500">
                <span className="block text-lg font-medium mb-2">Audio Playback Error</span>
                <p className="text-sm text-gray-400">{loadError}</p>
              </div>
              <Button onClick={retryLoading}>Retry</Button>
              {currentTrack?.src && (
                <Button variant="outline" className="ml-2" asChild>
                  <a 
                    href={currentTrack.src} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                  >
                    Open Audio Directly
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center gap-4">
              {/* Album Art */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                {currentTrack.coverArt ? (
                  <img 
                    src={currentTrack.coverArt} 
                    alt={currentTrack.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white/30">
                    <FileMusic className="w-8 h-8" />
                  </div>
                )}
              </div>
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{currentTrack.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {currentTrack.artist || "Unknown Artist"}
                </p>
                
                {/* Show loading indicator if attempting fallback */}
                {attemptingFallback && (
                  <p className="text-xs text-primary mt-1">
                    Trying alternative format...
                  </p>
                )}
                
                {/* Progress Slider (Mobile) */}
                <div className="mt-2 md:hidden">
                  <Slider 
                    value={[Math.round((currentTime / duration) * 100) || 0]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full"
                    disabled={isLoading || attemptingFallback}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
              
              {/* Main Controls */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white/10"
                  onClick={handlePrevious}
                  disabled={tracks.length <= 1}
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button 
                  variant="default" 
                  size="icon"
                  className="rounded-full w-10 h-10 bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform"
                  onClick={togglePlay}
                  disabled={isLoading && !attemptingFallback}
                >
                  {isLoading || attemptingFallback ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white/80 dark:border-black/30 dark:border-t-black/80 rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white/10"
                  onClick={handleNext}
                  disabled={tracks.length <= 1}
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Expand/Collapse Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Less" : "More"}
              </Button>
            </div>
            
            {/* Desktop Progress Bar */}
            <div className="hidden md:block mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider 
                value={[Math.round((currentTime / duration) * 100) || 0]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
                disabled={isLoading || attemptingFallback}
              />
            </div>
            
            {/* Additional Controls - Show on mobile when expanded, always on desktop */}
            <motion.div 
              className={`mt-4 gap-2 ${isExpanded || 'md:flex hidden'}`}
              initial={false}
              animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
              style={{ display: isExpanded ? 'flex' : 'none' }}
            >
              <Button 
                variant="ghost" 
                size="icon"
                className={`rounded-full ${
                  isShuffled ? "bg-black/10 dark:bg-white/10 text-black dark:text-white" : ""
                }`}
                onClick={toggleShuffle}
                disabled={tracks.length <= 1}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className={`rounded-full ${
                  repeatMode !== 'none' ? "bg-black/10 dark:bg-white/10 text-black dark:text-white" : ""
                }`}
                onClick={toggleRepeatMode}
              >
                <RepeatIcon className="w-4 h-4" />
                {repeatMode === 'one' && <span className="absolute text-[8px] font-bold">1</span>}
              </Button>
              
              <div className="flex items-center gap-2 ml-auto">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
