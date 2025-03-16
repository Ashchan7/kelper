
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  
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
      video.play();
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
  
  // Handle metadata loaded
  const handleMetadataLoaded = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setDuration(video.duration);
  };
  
  // Skip forward/backward
  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.min(Math.max(video.currentTime + seconds, 0), duration);
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setShowControls(true);
  };
  
  return (
    <motion.div 
      ref={playerRef}
      className="relative w-full rounded-xl overflow-hidden bg-black aspect-video"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadataLoaded}
        onEnded={() => setIsPlaying(false)}
      />
      
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
          className="w-full h-1 mb-4 bg-white/30 rounded-full cursor-pointer"
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
