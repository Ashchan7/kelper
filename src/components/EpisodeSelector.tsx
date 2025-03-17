
import { useState } from "react";
import { motion } from "framer-motion";
import { List, Play, FileVideo, FileAudio, Music, Grid, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  name: string;
  format?: string;
  size?: number;
  length?: string;
  height?: string;
  width?: string;
}

interface EpisodeSelectorProps {
  episodeFiles: MediaFile[];
  itemId: string;
  activeEpisode: string;
  onEpisodeSelect: (episodeUrl: string, episodeName: string, file?: MediaFile) => void;
}

// Check if file is a video file
const isVideoFile = (file: MediaFile) => {
  const name = file.name.toLowerCase();
  const format = (file.format || '').toLowerCase();
  
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
};

// Check if file is an audio file
const isAudioFile = (file: MediaFile) => {
  const name = file.name.toLowerCase();
  const format = (file.format || '').toLowerCase();
  
  return (
    name.endsWith('.mp3') || 
    name.endsWith('.ogg') || 
    name.endsWith('.wav') || 
    name.endsWith('.flac') ||
    name.endsWith('.m4a') ||
    name.endsWith('.aac') ||
    format.includes('audio')
  );
};

// Check if file is a valid media file for playback
const isPlayableMedia = (file: MediaFile) => {
  return isVideoFile(file) || isAudioFile(file);
};

const EpisodeSelector = ({ 
  episodeFiles, 
  itemId, 
  activeEpisode, 
  onEpisodeSelect 
}: EpisodeSelectorProps) => {
  const [view, setView] = useState<"list" | "grid">("list");
  const { toast } = useToast();
  
  // Determine if these are video episodes or audio tracks
  const firstPlayableFile = episodeFiles.find(isPlayableMedia);
  const mediaType = firstPlayableFile && isVideoFile(firstPlayableFile) ? 'video' : 'audio';
  
  // Extract episode number and name from filename
  const getEpisodeInfo = (filename: string) => {
    // Common patterns for episode naming
    const epPatterns = [
      /EP(\d+)/i,                    // EP01, EP1
      /E(\d+)/i,                     // E01, E1
      /Episode[\s-_]?(\d+)/i,        // Episode 1, Episode-1
      /Part[\s-_]?(\d+)/i,           // Part 1, Part-1
      /(\d+)[\s-_]of[\s-_]\d+/i,     // 1 of 5
      /Track[\s-_]?(\d+)/i,          // Track 1, Track-1
      /\b(\d+)\b/                    // Just look for any number if nothing else matches
    ];
    
    let episodeNumber = "";
    let episodeName = filename;
    
    // Try to extract episode number
    for (const pattern of epPatterns) {
      const match = filename.match(pattern);
      if (match && match[1]) {
        episodeNumber = match[1];
        break;
      }
    }
    
    // Clean up the name
    episodeName = filename
      .replace(/\.(mp4|webm|mov|avi|mkv|ogv|m4v|mp3|ogg|wav|flac|m4a)$/i, "")  // Remove extension
      .replace(/[\._]/g, " ")                              // Replace dots and underscores with spaces
      .replace(/\b(EP|E|Episode|Part|Track)\s*\d+\b/i, "")       // Remove episode markers
      .trim();
    
    // Add prefix based on media type
    const prefix = mediaType === 'video' ? 'Episode' : 'Track';
    
    // Add "Episode X:" or "Track X:" prefix if we found a number
    const displayName = episodeNumber
      ? `${prefix} ${episodeNumber}${episodeName ? `: ${episodeName}` : ''}`
      : episodeName;
    
    return {
      number: episodeNumber ? parseInt(episodeNumber, 10) : null,
      displayName: displayName
    };
  };
  
  // Sort episodes by episode number
  const sortedEpisodes = [...episodeFiles].sort((a, b) => {
    const epA = getEpisodeInfo(a.name);
    const epB = getEpisodeInfo(b.name);
    
    // If both have numbers, sort by number
    if (epA.number !== null && epB.number !== null) {
      return epA.number - epB.number;
    }
    
    // Otherwise sort by name
    return a.name.localeCompare(b.name);
  });
  
  // Format duration from seconds to MM:SS or HH:MM:SS
  const formatDuration = (seconds: string | undefined) => {
    if (!seconds) return "Unknown";
    
    const totalSeconds = parseFloat(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };
  
  // Check if file is a video file
  const isVideoFile = (file: MediaFile) => {
    const name = file.name.toLowerCase();
    const format = (file.format || '').toLowerCase();
    
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
  };
  
  // Check if file is an audio file
  const isAudioFile = (file: MediaFile) => {
    const name = file.name.toLowerCase();
    const format = (file.format || '').toLowerCase();
    
    return (
      name.endsWith('.mp3') || 
      name.endsWith('.ogg') || 
      name.endsWith('.wav') || 
      name.endsWith('.flac') ||
      name.endsWith('.m4a') ||
      name.endsWith('.aac') ||
      format.includes('audio')
    );
  };
  
  // Check if file is a valid media file for playback
  const isPlayableMedia = (file: MediaFile) => {
    return isVideoFile(file) || isAudioFile(file);
  };
  
  const handleEpisodeSelect = (file: MediaFile) => {
    // Only proceed if this is a valid media file
    if (isPlayableMedia(file)) {
      const episodeUrl = `https://archive.org/download/${itemId}/${encodeURIComponent(file.name)}`;
      onEpisodeSelect(episodeUrl, getEpisodeInfo(file.name).displayName, file);
      
      toast({
        title: mediaType === 'video' ? "Playing episode" : "Playing track",
        description: getEpisodeInfo(file.name).displayName,
        duration: 2000,
      });
    } else {
      toast({
        title: "Cannot play this file",
        description: "This file format is not supported for playback.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // Filter for only playable media files
  const playableEpisodes = sortedEpisodes.filter(isPlayableMedia);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-black/10 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden h-full flex flex-col"
    >
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{mediaType === 'video' ? 'Episodes' : 'Tracks'}</h3>
          <div className="flex gap-1">
            <Button 
              variant={view === "list" ? "default" : "ghost"} 
              size="icon"
              className="h-8 w-8"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant={view === "grid" ? "default" : "ghost"} 
              size="icon"
              className="h-8 w-8"
              onClick={() => setView("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          {playableEpisodes.length} {mediaType === 'video' ? 
            `episode${playableEpisodes.length !== 1 ? 's' : ''}` : 
            `track${playableEpisodes.length !== 1 ? 's' : ''}`} available
        </p>
      </div>
      
      <ScrollArea className="flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
        <div className="p-2">
          {playableEpisodes.length > 0 ? (
            view === "list" ? (
              // List View
              playableEpisodes.map((file, index) => (
                <motion.div 
                  key={file.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    activeEpisode.includes(encodeURIComponent(file.name)) 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                  onClick={() => handleEpisodeSelect(file)}
                >
                  <div className="mr-4 relative">
                    <div className="w-28 h-16 bg-black/30 rounded flex items-center justify-center overflow-hidden">
                      {mediaType === 'video' ? (
                        <FileVideo className="w-8 h-8 text-gray-400" />
                      ) : (
                        <FileAudio className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    {activeEpisode.includes(encodeURIComponent(file.name)) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                        <Play className="w-8 h-8 text-white" fill="white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {getEpisodeInfo(file.name).displayName}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      {file.length && (
                        <span className="mr-3">{formatDuration(file.length)}</span>
                      )}
                      {mediaType === 'video' && file.height && file.width && (
                        <span className="mr-3">{file.height}p</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEpisodeSelect(file);
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))
            ) : (
              // Grid View
              <div className="grid grid-cols-2 gap-2">
                {playableEpisodes.map((file, index) => (
                  <motion.div 
                    key={file.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      activeEpisode.includes(encodeURIComponent(file.name)) 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                    onClick={() => handleEpisodeSelect(file)}
                  >
                    <div className="relative mb-2">
                      <div className="aspect-video bg-black/30 rounded flex items-center justify-center overflow-hidden">
                        {mediaType === 'video' ? (
                          <FileVideo className="w-8 h-8 text-gray-400" />
                        ) : (
                          <Disc3 className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      {activeEpisode.includes(encodeURIComponent(file.name)) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                          <Play className="w-8 h-8 text-white" fill="white" />
                        </div>
                      )}
                      <Button 
                        variant="default" 
                        size="icon"
                        className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEpisodeSelect(file);
                        }}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs truncate">
                        {getEpisodeInfo(file.name).displayName}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        {file.length && (
                          <span className="mr-2">{formatDuration(file.length)}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            <div className="p-4 text-center text-gray-400">
              No playable {mediaType === 'video' ? 'episodes' : 'tracks'} found. Try viewing the content on Archive.org directly.
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default EpisodeSelector;
