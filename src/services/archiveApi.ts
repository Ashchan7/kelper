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
    
    // Sort files by format priority (video/audio first)
    const sortedFiles = [...files].sort((a, b) => {
      const aFormat = (a.format || '').toLowerCase();
      const bFormat = (b.format || '').toLowerCase();
      
      // Prioritize files with length property (duration)
      if (a.length && !b.length) return -1;
      if (!a.length && b.length) return 1;
      
      // Then prioritize video and audio formats
      const aIsMedia = aFormat.includes('video') || aFormat.includes('audio');
      const bIsMedia = bFormat.includes('video') || bFormat.includes('audio');
      
      if (aIsMedia && !bIsMedia) return -1;
      if (!aIsMedia && bIsMedia) return 1;
      
      // Default to name comparison
      return (a.name || '').localeCompare(b.name || '');
    });
    
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

export const getItemImageUrl = (identifier: string) => {
  return `https://archive.org/services/img/${identifier}`;
};

export const getItemPageUrl = (identifier: string) => {
  return `https://archive.org/details/${identifier}`;
};
