import { useState } from "react";
import { motion } from "framer-motion";
import { List, Play, FileVideo } from "lucide-react";
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
  onEpisodeSelect: (episodeUrl: string, episodeName: string) => void;
}

const EpisodeSelector = ({ 
  episodeFiles, 
  itemId, 
  activeEpisode, 
  onEpisodeSelect 
}: EpisodeSelectorProps) => {
  const [view, setView] = useState<"list" | "grid">("list");
  const { toast } = useToast();
  
  // Extract episode number and name from filename
  const getEpisodeInfo = (filename: string) => {
    // Common patterns for episode naming
    const epPatterns = [
      /EP(\d+)/i,                    // EP01, EP1
      /E(\d+)/i,                     // E01, E1
      /Episode[\s-_]?(\d+)/i,        // Episode 1, Episode-1
      /Part[\s-_]?(\d+)/i,           // Part 1, Part-1
      /(\d+)[\s-_]of[\s-_]\d+/i,     // 1 of 5
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
      .replace(/\.(mp4|webm|mov|avi|mkv|ogv|m4v)$/i, "")  // Remove extension
      .replace(/[\._]/g, " ")                              // Replace dots and underscores with spaces
      .replace(/\b(EP|E|Episode|Part)\s*\d+\b/i, "")       // Remove episode markers
      .trim();
    
    // Add "Episode X:" prefix if we found a number
    const displayName = episodeNumber
      ? `Episode ${episodeNumber}: ${episodeName}`
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
  
  const handleEpisodeSelect = (file: MediaFile) => {
    const episodeUrl = `https://archive.org/download/${itemId}/${encodeURIComponent(file.name)}`;
    onEpisodeSelect(episodeUrl, getEpisodeInfo(file.name).displayName);
    
    toast({
      title: "Playing episode",
      description: getEpisodeInfo(file.name).displayName,
      duration: 2000,
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-black/10 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Episodes</h3>
          <div className="flex gap-1">
            <Button 
              variant={view === "list" ? "default" : "ghost"} 
              size="icon"
              className="h-8 w-8"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-400">{episodeFiles.length} episode{episodeFiles.length !== 1 ? 's' : ''} available</p>
      </div>
      
      <ScrollArea className="h-[380px] max-h-[50vh]">
        <div className="p-2">
          {sortedEpisodes.map((file, index) => (
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
                  <FileVideo className="w-8 h-8 text-gray-400" />
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
                  {file.height && file.width && (
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
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default EpisodeSelector;
