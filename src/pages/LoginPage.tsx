
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FaGoogle } from 'react-icons/fa';

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    
    try {
      const success = await loginWithGoogle();
      
      if (success) {
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        navigate("/");
      } else {
        toast({
          title: "Error",
          description: "Login failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging in",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h2 className="text-2xl font-medium relative">
              Kelper
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></span>
            </h2>
          </Link>
          <h1 className="text-3xl font-medium mt-6 mb-2">Welcome to Kelper</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in with your Google account</p>
        </div>
        
        <div className="bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-2xl p-8">
          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-6 rounded-xl flex items-center justify-center gap-2"
            >
              <FaGoogle className="h-5 w-5" />
              {isSubmitting ? "Signing in..." : "Sign in with Google"}
            </Button>
            
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-black dark:hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-black dark:hover:text-white">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
