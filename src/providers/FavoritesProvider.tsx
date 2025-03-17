
import { createContext, useContext, ReactNode } from "react";
import { useFavorites, FavoriteItem } from "@/services/favoritesService";

interface FavoritesContextProps {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "addedAt" | "userId">) => Promise<boolean>;
  removeFavorite: (id: string) => Promise<boolean>;
  isFavorite: (id: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { favorites, add, remove, check, isLoading } = useFavorites();

  const addFavorite = async (item: Omit<FavoriteItem, "addedAt" | "userId">) => {
    return await add(item);
  };

  const removeFavorite = async (id: string) => {
    return await remove(id);
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, isLoading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
export { useFavorites };
