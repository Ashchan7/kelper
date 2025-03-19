
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Github, Twitter, Linkedin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [year] = useState(new Date().getFullYear());
  
  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-medium relative mr-1">
                Kelper
                <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-black dark:bg-white rounded-sm"></span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Explore a vast collection of movies, music, and more from the Internet Archive. 
              Discover, stream, and save your favorites.
            </p>
            <div className="flex mt-6 space-x-4">
              <motion.a 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-md p-2 border border-border/50 hover:bg-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-md p-2 border border-border/50 hover:bg-secondary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-md p-2 border border-border/50 hover:bg-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:col-span-2">
            <div>
              <h3 className="text-sm font-medium">Explore</h3>
              <div className="flex flex-col mt-4 space-y-2">
                <Link to="/movies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Movies</Link>
                <Link to="/music" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Music</Link>
                <Link to="/favorites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Favorites</Link>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium">Contact</h3>
              <div className="flex flex-col mt-4 space-y-2">
                <a href="mailto:thekelperzone@gmail.com" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  thekelperzone@gmail.com
                </a>
                <a href="tel:+918140174094" className="text-sm text-muted-foreground hover:text-foreground transition-colors">+91 8140174094</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            &copy; {year} Kelper. All rights reserved.
          </p>
          <div className="flex items-center flex-wrap justify-center mt-4 md:mt-0">
            <Button variant="link" className="text-xs text-muted-foreground px-2" asChild>
              <Link to="/privacy">Privacy Policy</Link>
            </Button>
            <Button variant="link" className="text-xs text-muted-foreground px-2" asChild>
              <Link to="/terms">Terms of Service</Link>
            </Button>
            <Button variant="link" className="text-xs text-muted-foreground px-2" asChild>
              <Link to="/dmca">DMCA Policy</Link>
            </Button>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-4 md:mt-0">
            Made with <Heart className="w-3 h-3 mx-1 text-red-500" /> using React
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
