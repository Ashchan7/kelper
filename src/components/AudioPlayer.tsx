import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RepeatIcon, Shuffle, Music, FileMusic, List } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Track {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  src: string;
  coverArt?: string;
  fileInfo?: any; // Original file info
}

interface AudioPlayerProps {
  tracks: Track[];
  initialTrackIndex?: number;
  onTrackChange?: (track: Track) => void;
}

const AudioPlayer = ({ tracks, initialTrackIndex = 0, onTrackChange }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [isQueueVisible, setIsQueueVisible] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const currentTrack = tracks[currentTrackIndex];
  
  // Format time (e.g., 125 seconds -> "2:05")
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
        toast({
          title: "Playback error",
          description: "There was a problem playing this track. Please try another.",
          variant: "destructive"
        });
      });
    }
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
    
    // If there's a predefined duration in the track data, use that
    if (currentTrack?.duration) {
      setDuration(currentTrack.duration);
    }
    
    setLoadingTrack(false);
    
    // Auto play when metadata is loaded
    if (!isPlaying && audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error auto-playing audio:", err);
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
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error repeating track:", err));
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
      nextIndex = currentTrackIndex + 1;
      if (nextIndex >= tracks.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return; // Don't proceed if we're at the end and not repeating
        }
      }
    }
    
    changeTrack(nextIndex);
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
      // Go to previous track or loop to last if at the beginning
      prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) {
        if (repeatMode === 'all') {
          prevIndex = tracks.length - 1;
        } else {
          return; // Don't proceed if we're at the beginning and not repeating
        }
      }
    }
    
    changeTrack(prevIndex);
  };
  
  // Helper to change track
  const changeTrack = (index: number) => {
    setLoadingTrack(true);
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    
    if (onTrackChange && tracks[index]) {
      onTrackChange(tracks[index]);
    }
    
    // Notify user
    if (tracks[index]) {
      toast({
        title: "Now playing",
        description: `${tracks[index].title}${tracks[index].artist ? ` • ${tracks[index].artist}` : ''}`,
        duration: 2000,
      });
    }
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
    
    toast({
      title: "Repeat mode",
      description: repeatMode === 'none' ? "Repeat all" : repeatMode === 'all' ? "Repeat one" : "Repeat off",
      duration: 1500,
    });
  };
  
  // Handle shuffle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    
    toast({
      title: isShuffled ? "Shuffle off" : "Shuffle on",
      duration: 1500,
    });
  };
  
  // Handle track selection from queue
  const selectTrack = (index: number) => {
    if (index === currentTrackIndex) {
      // If it's already the current track, just toggle play/pause
      togglePlay();
      return;
    }
    
    changeTrack(index);
  };
  
  // Play/pause state listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);
  
  // Update audio properties when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    
    // Set volume based on current volume state
    audio.volume = isMuted ? 0 : volume / 100;
    
    // If was playing, attempt to start playing the new track
    if (isPlaying) {
      audio.play().catch(err => {
        console.error("Error playing audio after track change:", err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, currentTrack]);
  
  // Keyboard listeners for common audio controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if this component is focused or has an active element
      if (!playerRef.current?.contains(document.activeElement)) return;
      
      switch(e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTrackIndex]);
  
  if (!currentTrack) {
    return (
      <div className="w-full p-6 text-center bg-black/5 dark:bg-white/5 rounded-xl">
        <Music className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">No audio tracks available</p>
      </div>
    );
  }
  
  return (
    <div className="w-full" ref={playerRef}>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadataLoaded}
        onEnded={handleTrackEnd}
        preload="metadata"
      />
      
      <motion.div 
        className="bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-xl overflow-hidden"
        layout
        transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
      >
        <Tabs defaultValue="player">
          <TabsList className="w-full justify-start p-2 bg-black/5 dark:bg-white/5">
            <TabsTrigger value="player" className="data-[state=active]:bg-white/10">Now Playing</TabsTrigger>
            <TabsTrigger value="queue" className="data-[state=active]:bg-white/10">Queue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="player" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="p-4">
              {/* Album Art and Track Info */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                  {currentTrack.coverArt ? (
                    <img 
                      src={currentTrack.coverArt} 
                      alt={currentTrack.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white/30">
                      <Music className="w-12 h-12" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 text-center md:text-left">
                  {loadingTrack ? (
                    <div className="animate-pulse">
                      <div className="h-7 bg-white/10 rounded w-3/4 mb-2"></div>
                      <div className="h-5 bg-white/10 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl md:text-2xl font-medium truncate mb-1">
                        {currentTrack.title}
                      </h3>
                      <p className="text-md text-gray-500 dark:text-gray-400 truncate mb-4">
                        {currentTrack.artist || "Unknown Artist"} {currentTrack.album ? `• ${currentTrack.album}` : ''}
                      </p>
                    </>
                  )}
                  
                  {/* Progress Slider */}
                  <div className="mt-4 mb-6">
                    <Slider 
                      value={[Math.round((currentTime / duration) * 100) || 0]}
                      min={0}
                      max={100}
                      step={0.1}
                      onValueChange={handleSeek}
                      disabled={loadingTrack}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  {/* Main Controls */}
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={`rounded-full text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white/10 ${
                        isShuffled ? "bg-black/10 dark:bg-white/10 text-black dark:text-white" : ""
                      }`}
                      onClick={toggleShuffle}
                      disabled={tracks.length <= 1}
                    >
                      <Shuffle className="w-5 h-5" />
                    </Button>
                    
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
                      className="rounded-full w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform flex items-center justify-center"
                      onClick={togglePlay}
                      disabled={loadingTrack}
                    >
                      {loadingTrack ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white/80 dark:border-black/30 dark:border-t-black/80 rounded-full animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
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
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={`rounded-full text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white/10 ${
                        repeatMode !== 'none' ? "bg-black/10 dark:bg-white/10 text-black dark:text-white" : ""
                      }`}
                      onClick={toggleRepeatMode}
                    >
                      <RepeatIcon className="w-5 h-5" />
                      {repeatMode === 'one' && <span className="absolute text-[8px] font-bold">1</span>}
                    </Button>
                  </div>
                  
                  {/* Volume Controls */}
                  <div className="flex items-center gap-2 justify-center md:justify-start mt-6">
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
                      className="w-24 md:w-32"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Queue Tab */}
          <TabsContent value="queue" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Up Next</h4>
                <span className="text-sm text-gray-500">{tracks.length} track{tracks.length !== 1 ? 's' : ''}</span>
              </div>
              
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-1">
                  {tracks.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => selectTrack(index)}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-colors flex items-center gap-3 ${
                        index === currentTrackIndex ? "bg-white/10 dark:bg-black/20" : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded overflow-hidden bg-black/20 flex-shrink-0 relative">
                        {track.coverArt ? (
                          <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white/30">
                            <FileMusic className="w-5 h-5" />
                          </div>
                        )}
                        
                        {index === currentTrackIndex && isPlaying && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex items-end h-4 space-x-0.5">
                              <div className="w-1 h-2 bg-white animate-[soundwave_0.5s_ease-in-out_infinite_alternate]"></div>
                              <div className="w-1 h-3 bg-white animate-[soundwave_0.5s_0.1s_ease-in-out_infinite_alternate]"></div>
                              <div className="w-1 h-4 bg-white animate-[soundwave_0.5s_0.2s_ease-in-out_infinite_alternate]"></div>
                              <div className="w-1 h-2 bg-white animate-[soundwave_0.5s_0.3s_ease-in-out_infinite_alternate]"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {track.artist || "Unknown Artist"}
                        </p>
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        {track.duration ? formatTime(track.duration) : "--:--"}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <style jsx="true">{`
        @keyframes soundwave {
          0% {
            height: 0.5rem;
          }
          100% {
            height: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;
