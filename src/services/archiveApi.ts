
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

export type MediaType = "movies" | "audio" | "all";

// Define license types
export const LicenseType = {
  MONETIZABLE: 'monetizable',
  NON_MONETIZABLE: 'non-monetizable',
  UNKNOWN: 'unknown'
};

// Helper to check if a license is monetizable
const isMonetizableLicense = (licenseUrl?: string, rights?: string, license?: string): boolean => {
  // Return false if all license data is missing
  if (!licenseUrl && !rights && !license) return false;
  
  // Check for non-monetizable licenses
  const nonMonetizablePhrases = [
    'all rights reserved',
    'nc', 
    'non-commercial',
    'noncommercial',
    'no commercial',
    'no derivative',
    'nd',
    'sampling'
  ];
  
  // Arrays of license URLs and identifiers that are monetizable
  const monetizableLicenses = [
    'creativecommons.org/publicdomain/zero',  // CC0
    'creativecommons.org/licenses/by/',       // CC-BY
    'publicdomain',
    'cc-by',
    'cc0'
  ];
  
  // Combine all license information to a lowercase string for easier checking
  const licenseInfo = [
    licenseUrl, 
    rights, 
    license
  ].filter(Boolean).join(' ').toLowerCase();
  
  // First check for non-monetizable terms
  for (const phrase of nonMonetizablePhrases) {
    if (licenseInfo.includes(phrase)) return false;
  }
  
  // Then check for explicitly monetizable licenses
  for (const phrase of monetizableLicenses) {
    if (licenseInfo.includes(phrase)) return true;
  }
  
  // If it passed the non-monetizable check but didn't match any monetizable pattern,
  // we should be cautious and assume it's not monetizable
  return false;
};

// Extend the search query to include license filter
export const useArchiveSearch = (
  query: string,
  mediaType: MediaType = "all",
  page: number = 1,
  rows: number = 20,
  monetizableOnly: boolean = true
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
        
        // Add license filters for monetizable content
        if (monetizableOnly) {
          // Filter for Public Domain or CC-BY content
          // Note: This is an approximation as Internet Archive doesn't have perfect license metadata
          searchQuery += ` AND (licenseurl:(*publicdomain* OR *creativecommons.org/licenses/by/*) OR rights:(*publicdomain* OR *CC-BY*) OR license:(*publicdomain* OR *CC-BY*))`;
          // Exclude non-commercial licenses
          searchQuery += ` AND -licenseurl:(*nc* OR *noncommercial* OR *non-commercial*) AND -rights:(*nc* OR *noncommercial* OR *non-commercial*) AND -license:(*nc* OR *noncommercial* OR *non-commercial*)`;
          // Exclude no-derivatives licenses
          searchQuery += ` AND -licenseurl:*nd* AND -rights:*nd* AND -license:*nd*`;
        }
        
        const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
          searchQuery
        )}&output=json&rows=${rows}&page=${page}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const responseData = await response.json();
        
        // Apply additional client-side filtering for better accuracy
        const filteredItems = monetizableOnly 
          ? responseData.response.docs.filter((item: ArchiveItem) => 
              isMonetizableLicense(item.licenseurl, item.rights, item.license))
          : responseData.response.docs;
        
        const formattedData = {
          items: filteredItems,
          count: filteredItems.length,
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
  }, [query, mediaType, page, rows, monetizableOnly]);

  return { data, isLoading, error };
};

export const useFeaturedContent = (mediaType: MediaType = "all", limit: number = 10, monetizableOnly: boolean = true) => {
  const [data, setData] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let baseQuery = "";
        
        // Filter for monetizable content
        if (monetizableOnly) {
          // Filter for Public Domain or CC-BY content
          baseQuery += `(licenseurl:(*publicdomain* OR *creativecommons.org/licenses/by/*) OR rights:(*publicdomain* OR *CC-BY*) OR license:(*publicdomain* OR *CC-BY*))`;
          // Exclude non-commercial licenses
          baseQuery += ` AND -licenseurl:(*nc* OR *noncommercial* OR *non-commercial*) AND -rights:(*nc* OR *noncommercial* OR *non-commercial*) AND -license:(*nc* OR *noncommercial* OR *non-commercial*)`;
          // Exclude no-derivatives licenses
          baseQuery += ` AND -licenseurl:*nd* AND -rights:*nd* AND -license:*nd*`;
        }
        
        let url;
        // Use the collection-based URL for movies with license filters
        if (mediaType === "movies") {
          url = `https://archive.org/advancedsearch.php?q=collection%3Amovies ${baseQuery}&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license`;
        } else if (mediaType === "audio") {
          url = `https://archive.org/advancedsearch.php?q=collection%3Aaudio ${baseQuery}&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license`;
        } else {
          // For "all" mediaType
          url = `https://archive.org/advancedsearch.php?q=mediatype:(audio OR movies) ${baseQuery}&output=json&rows=${limit}&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const responseData = await response.json();
        
        // Apply additional client-side filtering for better accuracy
        const filteredItems = monetizableOnly 
          ? responseData.response.docs.filter((item: ArchiveItem) => 
              isMonetizableLicense(item.licenseurl, item.rights, item.license))
          : responseData.response.docs;
          
        setData(filteredItems);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedContent();
  }, [mediaType, limit, monetizableOnly]);

  return { data, isLoading, error };
};

export const searchArchive = async (query: string, mediaType?: string, monetizableOnly: boolean = true) => {
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
    
    // Add license filters for monetizable content
    if (monetizableOnly) {
      // Filter for Public Domain or CC-BY content
      searchQuery += ` AND (licenseurl:(*publicdomain* OR *creativecommons.org/licenses/by/*) OR rights:(*publicdomain* OR *CC-BY*) OR license:(*publicdomain* OR *CC-BY*))`;
      // Exclude non-commercial licenses
      searchQuery += ` AND -licenseurl:(*nc* OR *noncommercial* OR *non-commercial*) AND -rights:(*nc* OR *noncommercial* OR *non-commercial*) AND -license:(*nc* OR *noncommercial* OR *non-commercial*)`;
      // Exclude no-derivatives licenses
      searchQuery += ` AND -licenseurl:*nd* AND -rights:*nd* AND -license:*nd*`;
    }
    
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
      searchQuery
    )}&output=json&rows=20&fl[]=identifier,title,description,mediatype,collection,date,creator,subject,thumb,downloads,year,publicdate,licenseurl,rights,license&sort[]=downloads desc`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const responseData = await response.json();
    
    // Apply additional client-side filtering for better accuracy
    const filteredItems = monetizableOnly 
      ? responseData.response.docs.filter((item: ArchiveItem) => 
          isMonetizableLicense(item.licenseurl, item.rights, item.license))
      : responseData.response.docs;
      
    return filteredItems;
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
    
    // Check if this item is legally monetizable
    const isLegallyMonetizable = isMonetizableLicense(
      metadata.metadata.licenseurl,
      metadata.metadata.rights,
      metadata.metadata.license
    );
    
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
      isLegallyMonetizable: isLegallyMonetizable,
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
export const checkItemMonetizableStatus = async (identifier: string): Promise<boolean> => {
  try {
    const itemDetails = await getItemDetails(identifier);
    return itemDetails.isLegallyMonetizable;
  } catch (error) {
    console.error("Error checking monetization status:", error);
    return false;
  }
};

export const getItemImageUrl = (identifier: string) => {
  return `https://archive.org/services/img/${identifier}`;
};

export const getItemPageUrl = (identifier: string) => {
  return `https://archive.org/details/${identifier}`;
};
