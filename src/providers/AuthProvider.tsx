
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("kelper_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login process
      // In a real app, you would make an API call to your backend
      setIsLoading(true);
      
      // For demo purposes, we'll just accept any credentials
      const mockUser = {
        id: crypto.randomUUID(),
        name: email.split('@')[0],
        email
      };
      
      setUser(mockUser);
      localStorage.setItem("kelper_user", JSON.stringify(mockUser));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Mock signup process
      setIsLoading(true);
      
      // For demo purposes, we'll just create a user
      const mockUser = {
        id: crypto.randomUUID(),
        name,
        email
      };
      
      setUser(mockUser);
      localStorage.setItem("kelper_user", JSON.stringify(mockUser));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error("Signup failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kelper_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
