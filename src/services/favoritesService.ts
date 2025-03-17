
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Get Firestore instance
const db = getFirestore();

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
  userId: string; // Add userId to associate favorites with specific users
}

// Add a favorite item to Firestore
export const addFavorite = async (item: Omit<FavoriteItem, "addedAt" | "userId">): Promise<boolean> => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      console.error("User not authenticated");
      return false;
    }
    
    // Check if item already exists for this user
    const favorites = await getFavorites();
    if (favorites.some(fav => fav.id === item.id)) {
      return false;
    }
    
    // Add item with timestamp and userId
    const newFavorite: FavoriteItem = {
      ...item,
      userId,
      addedAt: Date.now()
    };
    
    // Save to Firestore
    const favoritesCollection = collection(db, "favorites");
    const docRef = doc(favoritesCollection, `${userId}_${item.id}`);
    await setDoc(docRef, newFavorite);
    
    return true;
  } catch (error) {
    console.error("Error adding favorite:", error);
    return false;
  }
};

// Remove a favorite item from Firestore
export const removeFavorite = async (id: string): Promise<boolean> => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      console.error("User not authenticated");
      return false;
    }
    
    // Delete from Firestore
    const docRef = doc(db, "favorites", `${userId}_${id}`);
    await deleteDoc(docRef);
    
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
};

// Get all favorite items for the current user from Firestore
export const getFavorites = async (): Promise<FavoriteItem[]> => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      return [];
    }
    
    // Query Firestore for user's favorites
    const favoritesCollection = collection(db, "favorites");
    const q = query(favoritesCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const favorites: FavoriteItem[] = [];
    querySnapshot.forEach((doc) => {
      favorites.push(doc.data() as FavoriteItem);
    });
    
    return favorites;
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

// Check if an item is a favorite
export const isFavorite = async (id: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some(item => item.id === id);
};

// Custom hook to manage favorites with real-time updates
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    // Set up real-time listener for favorites
    const favoritesCollection = collection(db, "favorites");
    const q = query(favoritesCollection, where("userId", "==", user.id));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favoritesData: FavoriteItem[] = [];
      snapshot.forEach((doc) => {
        favoritesData.push(doc.data() as FavoriteItem);
      });
      
      setFavorites(favoritesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error listening to favorites:", error);
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);
  
  const add = async (item: Omit<FavoriteItem, "addedAt" | "userId">) => {
    return await addFavorite(item);
  };
  
  const remove = async (id: string) => {
    return await removeFavorite(id);
  };
  
  const check = async (id: string) => {
    return favorites.some(item => item.id === id);
  };
  
  return {
    favorites,
    isLoading,
    add,
    remove,
    check
  };
};
