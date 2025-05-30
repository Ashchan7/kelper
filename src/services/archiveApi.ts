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
  licenseurl?: string;
  rights?: string;
  license?: string;
}

export interface SearchResponse {
  items: ArchiveItem[];
  count: number;
  totalResults: number;
}

export type MediaType = "movies" | "audio" | "podcasts" | "all";

// Define license types
export const LicenseType = {
  MONETIZABLE: 'monetizable',
  NON_MONETIZABLE: 'non-monetizable',
  UNKNOWN: 'unknown'
};

// This function is kept but will always return true to allow all content
const isMonetizableLicense = (licenseUrl?: string, rights?: string, license?: string): boolean => {
  return true; // Allow all content by default
};

// Build an empty license query to avoid filtering
const buildLicenseQuery = () => {
  return ""; // No license filtering
};

// Extend the search query to include all content with no license filtering
export const useArchiveSearch = (
  query: string,
  mediaType: MediaType = "all",
  page: number = 1,
  rows: number = 20,
  monetizableOnly: boolean = false, // Set default to false to allow all content
  allowExtendedSearch: boolean = true
) => {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isExtendedSearchUsed, setIsExtendedSearchUsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build the Internet Archive search URL without license filtering
        let searchQuery = query;
        
        // Add media type filter if specified
        if (mediaType !== "all") {
          searchQuery += ` AND mediatype:${mediaType}`;
        }
        
        const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
          searchQuery
        )}&output=json&rows=${rows}&page=${page}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc,week desc`;

        console.log("Searching with URL:", url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const responseData = await response.json();
        let items = responseData.response?.docs || [];
        let totalResults = responseData.response?.numFound || 0;
        
        // No client-side filtering - keep all items
        
        // If results are empty, try a broader search
        if (items.length === 0 && allowExtendedSearch && !isExtendedSearchUsed) {
          setIsExtendedSearchUsed(true);
          
          // Try with a simpler search just based on mediatype
          const fallbackQuery = mediaType !== "all" ? 
            `mediatype:${mediaType}` : 
            "mediatype:(audio OR movies)";
          
          const fallbackUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
            fallbackQuery
          )}&output=json&rows=${rows}&page=${page}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc,week desc`;
          
          console.log("Fallback search with URL:", fallbackUrl);
          const fallbackResponse = await fetch(fallbackUrl);
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            items = fallbackData.response?.docs || [];
            totalResults = fallbackData.response?.numFound || 0;
          }
        }
        
        // Filter out duplicates
        const uniqueItems = Array.from(
          new Map(items.map((item: any) => [item.identifier, item])).values()
        ) as ArchiveItem[]; // Cast to ArchiveItem[] to fix TypeScript error
        
        const formattedData: SearchResponse = {
          items: uniqueItems,
          count: uniqueItems.length,
          totalResults: totalResults
        };
        
        setData(formattedData);
      } catch (err) {
        console.error("Error searching archive:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
        setIsExtendedSearchUsed(false);
      }
    };

    fetchData();
  }, [query, mediaType, page, rows, monetizableOnly, allowExtendedSearch]);

  return { data, isLoading, error, isExtendedSearchUsed };
};

export const useFeaturedContent = (mediaType: MediaType = "all", limit: number = 10, monetizableOnly: boolean = false) => {
  const [data, setData] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simple query without license filtering
        let url;
        if (mediaType === "movies") {
          url = `https://archive.org/advancedsearch.php?q=collection%3Amovies&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc,week desc`;
        } else if (mediaType === "audio") {
          url = `https://archive.org/advancedsearch.php?q=collection%3Aaudio&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc,week desc`;
        } else if (mediaType === "podcasts") {
          url = `https://archive.org/advancedsearch.php?q=collection%3Apodcasts&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc,week desc`;
        } else {
          // For "all" mediaType
          url = `https://archive.org/advancedsearch.php?q=mediatype:(audio OR movies)&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc,week desc`;
        }

        console.log("Fetching featured content with URL:", url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const responseData = await response.json();
        let items = responseData.response?.docs || [];
        
        // If no results, try a broader search
        if (items.length === 0) {
          console.log("No featured content found, fetching broader content");
          const fallbackMediaType = mediaType !== "all" ? 
            (mediaType === "movies" ? "collection:movies" : 
             mediaType === "audio" ? "collection:audio" : 
             mediaType === "podcasts" ? "collection:podcasts" : "mediatype:(audio OR movies)") : 
            "mediatype:(audio OR movies)";
            
          const fallbackUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
            fallbackMediaType
          )}&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=publicdate desc`;
          
          console.log("Fallback featured content search with URL:", fallbackUrl);
          const fallbackResponse = await fetch(fallbackUrl);
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            items = fallbackData.response?.docs || [];
          }
        }
        
        // Filter out duplicates
        const uniqueItems = Array.from(
          new Map(items.map((item: any) => [item.identifier, item])).values()
        ) as ArchiveItem[]; // Cast to ArchiveItem[] to fix TypeScript error
          
        setData(uniqueItems);
      } catch (err) {
        console.error("Error fetching featured content:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedContent();
  }, [mediaType, limit, monetizableOnly]);

  return { data, isLoading, error };
};

export const searchArchive = async (
  query: string, 
  mediaType?: string,
  monetizableOnly: boolean = false
) => {
  if (!query) {
    return [];
  }

  try {
    // Build the Internet Archive search URL without license filtering
    let searchQuery = query;
    
    // Add media type filter if specified
    if (mediaType) {
      searchQuery += ` AND mediatype:${mediaType}`;
    }
    
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
      searchQuery
    )}&output=json&rows=20&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc,week desc`;

    console.log("Direct search with URL:", url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const responseData = await response.json();
    let items = responseData.response?.docs || [];
    
    // If no results, try a more basic search
    if (items.length === 0) {
      console.log("No results found, fetching fallback content");
      const fallbackMediaType = mediaType || "audio OR movies";
      const fallbackQuery = `mediatype:(${fallbackMediaType})`;
      
      const fallbackUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
        fallbackQuery
      )}&output=json&rows=20&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=publicdate desc`;
      
      console.log("Fallback direct search with URL:", fallbackUrl);
      const fallbackResponse = await fetch(fallbackUrl);
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        items = fallbackData.response?.docs || [];
      }
    }
    
    // Filter out duplicates
    return Array.from(
      new Map(items.map((item: any) => [item.identifier, item])).values()
    ) as ArchiveItem[]; // Cast to ArchiveItem[] to fix TypeScript error
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
    
    // For license display purposes only, not for filtering
    const isLegallyMonetizable = true; // Always return true to allow all content
    
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
      license: metadata.metadata.license,
      licenseurl: metadata.metadata.licenseurl,
      rights: metadata.metadata.rights,
      isLegallyMonetizable: isLegallyMonetizable, // Always true
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

// Helper function to check the monetization status of a specific item
// Always returns true to allow all content
export const checkItemMonetizableStatus = async (identifier: string): Promise<boolean> => {
  return true; // Always allow all content
};

export const getItemImageUrl = (identifier: string) => {
  return `https://archive.org/services/img/${identifier}`;
};

export const getItemPageUrl = (identifier: string) => {
  return `https://archive.org/details/${identifier}`;
};
