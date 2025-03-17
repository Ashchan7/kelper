
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Film, Music, Heart, Info, Search, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import ThemeToggle from "./ThemeToggle";

const SidebarNavigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isMobile = useIsMobile();

  // If on mobile, don't render the sidebar
  if (isMobile) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="floating" className="bg-white/70 dark:bg-black/70 backdrop-blur-xl">
        <SidebarHeader className="pb-2">
          <Link to="/" className="flex items-center px-2 py-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-medium relative flex items-center"
            >
              Kelper
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></span>
            </motion.div>
          </Link>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Home"
                    isActive={location.pathname === "/"}
                    asChild
                  >
                    <Link to="/">
                      <Home className="h-5 w-5" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Movies"
                    isActive={location.pathname === "/movies" || location.pathname.startsWith("/play/movies")}
                    asChild
                  >
                    <Link to="/movies">
                      <Film className="h-5 w-5" />
                      <span>Movies</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Music"
                    isActive={location.pathname === "/music" || location.pathname.startsWith("/play/music")}
                    asChild
                  >
                    <Link to="/music">
                      <Music className="h-5 w-5" />
                      <span>Music</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Favorites"
                    isActive={location.pathname === "/favorites"}
                    asChild
                  >
                    <Link to="/favorites">
                      <Heart className="h-5 w-5" />
                      <span>Favorites</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="About"
                    isActive={location.pathname === "/about"}
                    asChild
                  >
                    <Link to="/about">
                      <Info className="h-5 w-5" />
                      <span>About</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Search"
                    isActive={location.pathname === "/search"}
                    asChild
                  >
                    <Link to="/search">
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="mt-auto">
          <div className="flex items-center justify-between px-4 py-2">
            <ThemeToggle />
            <SidebarTrigger />
          </div>
          
          {isAuthenticated ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">{user?.name.charAt(0)}</span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" className="w-full" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </SidebarFooter>
        
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

export default SidebarNavigation;
