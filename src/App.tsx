
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import MusicPage from "./pages/MusicPage";
import FavoritesPage from "./pages/FavoritesPage";
import AboutPage from "./pages/AboutPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import AuthProvider from "./providers/AuthProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="kelper-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="movies" element={<MoviesPage />} />
                <Route path="music" element={<MusicPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
