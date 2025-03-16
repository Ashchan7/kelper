
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RepeatIcon, Shuffle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface Track {
  id: string;
  title: string;
  artist?: string;
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
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);
  
  const currentTrack = tracks[currentTrackIndex];
  
  // Format time (e.g., 125 seconds -> "2:05")
  const formatTime = (seconds: number) => {
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
      audio.play();
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
    
    // If there's a predefined duration in the track data, use that
    if (currentTrack?.duration) {
      setDuration(currentTrack.duration);
    }
  };
  
  // Handle track end
  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      // Repeat current track
      const audio = audioRef.current;
      if (!audio) return;
      
      audio.currentTime = 0;
      audio.play();
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
    
    // Play automatically when switching tracks
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing audio:", err));
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
    
    // Play automatically when switching tracks
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing audio:", err));
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
  
  // Handle track selection from playlist
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing audio:", err));
    }, 0);
  };
  
  // Update audio properties when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Set volume based on current volume state
    audio.volume = isMuted ? 0 : volume / 100;
    
    // If was playing, start playing the new track
    if (isPlaying) {
      audio.play().catch(err => console.error("Error playing audio:", err));
    }
  }, [currentTrackIndex]);
  
  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadataLoaded}
        onEnded={handleTrackEnd}
      />
      
      <motion.div 
        className="bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-xl overflow-hidden"
        layout
        transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Compact Player */}
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
                  <Music className="w-8 h-8" />
                </div>
              )}
            </div>
            
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{currentTrack.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {currentTrack.artist || "Unknown Artist"}
              </p>
              
              {/* Progress Slider (Mobile) */}
              <div className="mt-2 md:hidden">
                <Slider 
                  value={[Math.round((currentTime / duration) * 100) || 0]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
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
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="default" 
                size="icon"
                className="rounded-full w-10 h-10 bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform"
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
                className="rounded-full text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white/10"
                onClick={handleNext}
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
        
        {/* Playlist (only expanded on mobile, always shown on desktop) */}
        <motion.div 
          ref={playlistRef}
          className={`bg-black/5 dark:bg-white/5 ${isExpanded || 'md:block hidden'}`}
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          style={{ display: isExpanded ? 'block' : 'none' }}
        >
          <div className="p-4 border-t border-white/10 dark:border-white/5">
            <h4 className="font-medium mb-3">Playlist</h4>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={`w-full text-left p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-colors ${
                    index === currentTrackIndex ? "bg-white/10 dark:bg-black/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-sm text-gray-500">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {track.artist || "Unknown Artist"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {track.duration ? formatTime(track.duration) : "--:--"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Adding missing imports
import { Music } from "lucide-react";

export default MusicPlayer;
