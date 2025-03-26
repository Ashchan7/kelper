
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

export default function UploadPage() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ image, title, description });
    // Here you would typically handle the actual upload
    // For now we'll just log the data
  };

  return (
    <div className="container mx-auto px-6 pt-28 pb-20">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Upload className="w-10 h-10 mb-3 mx-auto opacity-50" />
          <h1 className="text-3xl md:text-4xl font-medium mb-4">Upload Content</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Share your creative works with the Kelper community. Upload your content following the guidelines below.
          </p>
        </motion.div>
        
        <div className="bg-black/10 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit}>
            {image ? (
              <div className="relative mb-4">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-48 sm:h-64 object-cover rounded-xl"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setImage(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="w-full h-48 sm:h-64 bg-gray-800/30 dark:bg-gray-800/50 rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 mb-4 border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Upload className="w-10 h-10 mb-2 opacity-50" />
                <p>Click to select an image</p>
                <p className="text-xs mt-2">Supports JPG, PNG, GIF up to 10MB</p>
              </div>
            )}
            
            <div className="grid gap-4">
              <div>
                <label htmlFor="file-upload" className="sr-only">Choose file</label>
                <Input 
                  id="file-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Give your upload a title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  id="description"
                  placeholder="Add a description to your upload"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 min-h-[120px]"
                />
              </div>
              
              <div className="mt-2">
                <Button 
                  type="submit" 
                  className="w-full"
                >
                  Upload Content
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
