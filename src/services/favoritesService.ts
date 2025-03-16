
import { useEffect, useState } from "react";

// Define the favorite item type
export interface FavoriteItem {
  id: string;
  title: string;
  creator: string;
  description: string;
  mediaType: string;
  thumbnail: string;
  url: string;
  addedAt: number;
}

// Save a favorite item
export const addFavorite = (item: Omit<FavoriteItem, "addedAt">) => {
  try {
    const favorites = getFavorites();
    
    // Check if item already exists
    if (favorites.some(fav => fav.id === item.id)) {
      return false;
    }
    
    // Add item with timestamp
    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: Date.now()
    };
    
    favorites.push(newFavorite);
    localStorage.setItem("kelper_favorites", JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error("Error adding favorite:", error);
    return false;
  }
};

// Remove a favorite item
export const removeFavorite = (id: string) => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(item => item.id !== id);
    localStorage.setItem("kelper_favorites", JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
};

// Get all favorite items
export const getFavorites = (): FavoriteItem[] => {
  try {
    const favorites = localStorage.getItem("kelper_favorites");
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

// Check if an item is a favorite
export const isFavorite = (id: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(item => item.id === id);
};

// Custom hook to manage favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setFavorites(getFavorites());
    setIsLoading(false);
  }, []);
  
  const add = (item: Omit<FavoriteItem, "addedAt">) => {
    const success = addFavorite(item);
    if (success) {
      setFavorites(getFavorites());
    }
    return success;
  };
  
  const remove = (id: string) => {
    const success = removeFavorite(id);
    if (success) {
      setFavorites(getFavorites());
    }
    return success;
  };
  
  const check = (id: string) => {
    return isFavorite(id);
  };
  
  return {
    favorites,
    isLoading,
    add,
    remove,
    check
  };
};
