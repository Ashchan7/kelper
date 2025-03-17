import { useState, useEffect } from "react";

export interface ArchiveItem {
  identifier: string;
  title: string;
  description: string;
  mediatype: string;
  collection: string[];
  date: string;
  creator?: string;
  subject?: string[];
  thumb?: string;
  downloads?: number;
  year?: string;
  publicdate: string;
}

export interface SearchResponse {
  items: ArchiveItem[];
  count: number;
  totalResults: number;
}

export type MediaType = "movies" | "audio" | "all";

// Keep existing hooks and functions the same
export const useArchiveSearch = (
  query: string,
  mediaType: MediaType = "all",
  page: number = 1,
  rows: number = 20
) => {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build the Internet Archive search URL
        let searchQuery = query;
        
        // Add media type filter if specified
        if (mediaType !== "all") {
          searchQuery += ` AND mediatype:${mediaType}`;
        }
        
        const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
          searchQuery
        )}&output=json&rows=${rows}&page=${page}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate&sort[]=downloads desc`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const responseData = await response.json();
        
        const formattedData = {
          items: responseData.response.docs,
          count: responseData.response.docs.length,
          totalResults: responseData.response.numFound
        };
        
        setData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, mediaType, page, rows]);

  return { data, isLoading, error };
};

export const useFeaturedContent = (mediaType: MediaType = "all", limit: number = 10) => {
  const [data, setData] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let url;
        
        // Use the collection-based URL for movies
        if (mediaType === "movies") {
          url = `https://archive.org/advancedsearch.php?q=collection%3Amovies&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate`;
        } else if (mediaType === "audio") {
          url = `https://archive.org/advancedsearch.php?q=collection%3Aaudio&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate`;
        } else {
          // For "all" mediaType
          url = `https://archive.org/advancedsearch.php?q=mediatype:(audio OR movies)&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const responseData = await response.json();
        setData(responseData.response.docs);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedContent();
  }, [mediaType, limit]);

  return { data, isLoading, error };
};

export const searchArchive = async (query: string, mediaType?: string) => {
  if (!query) {
    return [];
  }

  try {
    // Build the Internet Archive search URL
    let searchQuery = query;
    
    // Add media type filter if specified
    if (mediaType) {
      searchQuery += ` AND mediatype:${mediaType}`;
    }
    
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
      searchQuery
    )}&output=json&rows=20&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate&sort[]=downloads desc`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const responseData = await response.json();
    return responseData.response.docs;
  } catch (err) {
    console.error("Error searching archive:", err);
    throw err;
  }
};

export const getItemDetails = async (identifier: string) => {
  try {
    console.log(`Fetching item details for: ${identifier}`);
    const metadataResponse = await fetch(`https://archive.org/metadata/${identifier}`);
    
    if (!metadataResponse.ok) {
      throw new Error("Failed to fetch item details");
    }
    
    const metadata = await metadataResponse.json();
    console.log("Metadata received:", metadata);
    
    // Add a thumbnailUrl property for easier access
    const thumbnailUrl = `https://archive.org/services/img/${identifier}`;
    
    // Pre-process files to identify playable media
    const files = metadata.files || [];
    console.log(`Found ${files.length} files in the item`);
    
    // Enhanced format detection for video and audio files
    const sortedFiles = [...files].sort((a, b) => {
      const aFormat = (a.format || '').toLowerCase();
      const bFormat = (b.format || '').toLowerCase();
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      
      // Check for known playable extensions first
      const isAPlayable = isPlayableMediaFile(a);
      const isBPlayable = isPlayableMediaFile(b);
      
      // Prioritize files with known playable formats
      if (isAPlayable && !isBPlayable) return -1;
      if (!isAPlayable && isBPlayable) return 1;
      
      // Then prioritize files with length property (duration)
      if (a.length && !b.length) return -1;
      if (!a.length && b.length) return 1;
      
      // Then prioritize mp4 files which have better browser compatibility
      if (aName.endsWith('.mp4') && !bName.endsWith('.mp4')) return -1;
      if (!aName.endsWith('.mp4') && bName.endsWith('.mp4')) return 1;
      
      // Then prioritize video and audio formats
      const aIsVideo = aFormat.includes('video') || videoExtensions.some(ext => aName.endsWith(ext));
      const bIsVideo = bFormat.includes('video') || videoExtensions.some(ext => bName.endsWith(ext));
      const aIsAudio = aFormat.includes('audio') || audioExtensions.some(ext => aName.endsWith(ext));
      const bIsAudio = bFormat.includes('audio') || audioExtensions.some(ext => bName.endsWith(ext));
      
      if (aIsVideo && !bIsVideo) return -1;
      if (!aIsVideo && bIsVideo) return 1;
      if (aIsAudio && !bIsAudio) return -1;
      if (!aIsAudio && bIsAudio) return 1;
      
      // Default to file size (bigger files might be higher quality)
      return (parseInt(b.size || '0', 10) - parseInt(a.size || '0', 10));
    });
    
    // Log the first playable file for debugging
    const firstPlayableFile = sortedFiles.find(isPlayableMediaFile);
    if (firstPlayableFile) {
      console.log("First playable file:", firstPlayableFile);
    } else {
      console.log("No playable files found!");
    }
    
    // Count playable episodes for debugging
    const playableEpisodes = sortedFiles.filter(isPlayableMediaFile).length;
    console.log(`Playable episodes found: ${playableEpisodes}`);
    
    // Format the data to be more consistent
    return {
      ...metadata.metadata,
      identifier: metadata.metadata.identifier,
      title: metadata.metadata.title,
      description: metadata.metadata.description,
      creator: metadata.metadata.creator,
      collection: Array.isArray(metadata.metadata.collection) 
                  ? metadata.metadata.collection 
                  : [metadata.metadata.collection],
      date: metadata.metadata.date,
      addedDate: metadata.metadata.publicdate,
      thumbnailUrl,
      downloads: parseInt(metadata.metadata.downloads || '0', 10),
      files: sortedFiles || [],
    };
  } catch (error) {
    console.error("Error fetching item details:", error);
    throw error;
  }
};

// Define common video and audio file extensions for better format detection
const videoExtensions = [
  '.mp4', '.webm', '.mkv', '.mov', '.avi', '.mpg', '.mpeg', '.ogv', '.m4v', '.3gp', '.flv'
];

const audioExtensions = [
  '.mp3', '.ogg', '.wav', '.flac', '.m4a', '.aac', '.opus'
];

// Helper function to check if a file is playable media
export const isPlayableMediaFile = (file: any) => {
  if (!file || !file.name) return false;
  
  const name = file.name.toLowerCase();
  const format = (file.format || '').toLowerCase();
  
  // Check if it has a length property (duration)
  if (file.length) {
    // Media type detection based on file attributes
    if (file.width && file.height) {
      console.log("Media type detected: video");
      return true; // Has dimensions, likely a video
    } else {
      return true; // Has length but no dimensions, likely audio
    }
  }
  
  // Check video formats
  if (videoExtensions.some(ext => name.endsWith(ext)) || 
      format.includes('video') || 
      format.includes('matroska') ||  // For MKV files
      format.includes('mpeg')) {
    return true;
  }
  
  // Check audio formats
  if (audioExtensions.some(ext => name.endsWith(ext)) || 
      format.includes('audio')) {
    return true;
  }
  
  return false;
};

export const getItemImageUrl = (identifier: string) => {
  return `https://archive.org/services/img/${identifier}`;
};

export const getItemPageUrl = (identifier: string) => {
  return `https://archive.org/details/${identifier}`;
};
