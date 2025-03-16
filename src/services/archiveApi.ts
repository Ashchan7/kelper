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

export const getItemDetails = async (identifier: string): Promise<any> => {
  try {
    const response = await fetch(`https://archive.org/metadata/${identifier}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch item details");
    }
    
    return await response.json();
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
