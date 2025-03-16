
import React, { useState } from 'react';
import { Play, Pause, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPreviewProps {
  videoId?: string;
  onClose: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoId, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Simulate loading time
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden bg-black/80 animate-fade-in my-4 relative">
      <div className="absolute top-2 right-2 z-10">
        <button 
          onClick={onClose}
          className="p-1 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-white">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="text-sm">Loading video preview...</p>
        </div>
      ) : (
        <div className="relative">
          <div className="h-64 bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center">
            {/* This would be the actual video player in a real implementation */}
            <div className="text-white text-center">
              <p className="mb-2">Sample Video</p>
              <p className="text-xs text-gray-400">Video ID: {videoId || 'demo-video'}</p>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 flex items-center">
            <button
              onClick={handlePlayPause}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white mr-2"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
              <div className={cn(
                "h-full bg-primary transition-all duration-500",
                isPlaying ? "w-[45%]" : "w-0"
              )} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
