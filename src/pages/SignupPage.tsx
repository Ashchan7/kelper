
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await signup(name, email, password);
      
      if (success) {
        toast({
          title: "Success",
          description: "Your account has been created",
        });
        navigate("/");
      } else {
        toast({
          title: "Error",
          description: "Failed to create account",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while signing up",
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
          <h1 className="text-3xl font-medium mt-6 mb-2">Create an account</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign up to get started</p>
        </div>
        
        <div className="bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-white/10 dark:bg-black/20 border-white/10 dark:border-white/5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white/10 dark:bg-black/20 border-white/10 dark:border-white/5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/10 dark:bg-black/20 border-white/10 dark:border-white/5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/10 dark:bg-black/20 border-white/10 dark:border-white/5"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full rounded-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-black dark:text-white hover:opacity-80 transition-opacity">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
