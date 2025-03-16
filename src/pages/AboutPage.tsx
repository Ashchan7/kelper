
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Film, Music, Heart, Search, Moon, Sun } from "lucide-react";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-6 pt-28 pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-medium mb-6 text-center"
        >
          About Kelper
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-400 mb-10 text-center"
        >
          Discover the vast collections of the Internet Archive in a beautiful, modern interface.
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="prose dark:prose-invert max-w-none"
        >
          <h2>Our Mission</h2>
          <p>
            Kelper was created to provide a beautiful, intuitive interface for exploring the vast collections of the Internet Archive. We believe that digital archives are an invaluable resource for education, research, and entertainment, and we want to make these resources as accessible as possible.
          </p>
          
          <h2>Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
            <FeatureCard 
              icon={<Search className="w-6 h-6" />}
              title="Powerful Search"
              description="Find exactly what you're looking for with our advanced search capabilities."
            />
            <FeatureCard 
              icon={<Film className="w-6 h-6" />}
              title="Movies Collection"
              description="Explore thousands of classic films, documentaries, and more."
            />
            <FeatureCard 
              icon={<Music className="w-6 h-6" />}
              title="Music Library"
              description="Discover a rich collection of audio recordings from various genres and eras."
            />
            <FeatureCard 
              icon={<Heart className="w-6 h-6" />}
              title="Personal Favorites"
              description="Save your favorite items to your personal collection for easy access."
            />
            <FeatureCard 
              icon={<Sun className="w-6 h-6 dark:hidden" />}
              icon2={<Moon className="w-6 h-6 hidden dark:block" />}
              title="Light & Dark Mode"
              description="Choose the theme that's easiest on your eyes, day or night."
            />
            <FeatureCard 
              icon={<div className="flex items-center justify-center w-6 h-6 text-xs font-bold">Aa</div>}
              title="Minimalist Design"
              description="Clean, uncluttered interface inspired by Apple's design principles."
            />
          </div>
          
          <h2>About the Internet Archive</h2>
          <p>
            The Internet Archive is a non-profit digital library with the stated mission of "universal access to all knowledge." It provides free public access to collections of digitized materials, including websites, software applications, games, music, movies, videos, and millions of books.
          </p>
          <p>
            Founded in 1996, the Internet Archive has been archiving the web since 1996, and now contains billions of pages saved over time. Their collections also include the Wayback Machine, which allows people to visit archived versions of websites.
          </p>
          <p>
            Kelper is not affiliated with the Internet Archive but was created as a modern interface to explore their publicly available content. We encourage users to support the Internet Archive directly through donations and contributions.
          </p>
          
          <div className="flex justify-center mt-10">
            <Link 
              to="/"
              className="bg-black text-white dark:bg-white dark:text-black py-3 px-6 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Start Exploring
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  icon2, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  icon2?: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-xl p-5 transition-all duration-300 hover:border-white/20 dark:hover:border-white/10">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          {icon}
          {icon2}
        </div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
