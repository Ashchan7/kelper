
import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import MusicPage from "./pages/MusicPage";
import AboutPage from "./pages/AboutPage";
import FavoritesPage from "./pages/FavoritesPage";
import PlayerPage from "./pages/PlayerPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SearchPage from "./pages/SearchPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

// Components & Layout
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/theme-provider";
import AuthProvider from "./providers/AuthProvider";
import { FavoritesProvider } from "./providers/FavoritesProvider";
import { Toaster } from "./components/ui/toaster";

// Initialize React Query
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/movies",
        element: <MoviesPage />,
      },
      {
        path: "/music",
        element: <MusicPage />,
      },
      {
        path: "/favorites",
        element: <FavoritesPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/play/:mediaType/:id",
        element: <PlayerPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/terms",
        element: <TermsPage />,
      },
      {
        path: "/privacy",
        element: <PrivacyPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  // Set page background color based on theme
  useEffect(() => {
    const updateBackgroundColor = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      document.body.style.backgroundColor = isDarkMode ? "#000000" : "#ffffff";
    };

    // Initial update
    updateBackgroundColor();

    // Create observer to detect theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          updateBackgroundColor();
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <FavoritesProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
          </QueryClientProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
