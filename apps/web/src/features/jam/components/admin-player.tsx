import { useState, useRef, useEffect } from "react";
import YouTube, { type YouTubeProps, type YouTubeEvent } from "react-youtube";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Radio, SkipForward, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Song } from "@/features/jam/hooks/use-socket"; 

interface AdminPlayerProps {
  currentSong?: Song;
  onSongEnd?: (ytLink: string) => void;
}

const getVideoId = (url: string) => {
  try {
    if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
    return "";
  } catch (e) {
    return "";
  }
};

export function AdminPlayer({ currentSong, onSongEnd }: AdminPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  const playerRef = useRef<any>(null);
  const videoId = currentSong ? getVideoId(currentSong.ytLink) : "";

  useEffect(() => {
    setIsPlaying(true); 
    setIsReady(false); 
  }, [videoId]);

  const togglePlay = () => {
    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
    setIsPlaying(!isPlaying);
  };

  const onPlayerReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    setIsReady(true);
    event.target.playVideo();
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    if (event.data === 1) setIsPlaying(true);
    if (event.data === 2) setIsPlaying(false);
  };

  const onPlayerEnd = () => {
    if (currentSong && onSongEnd) onSongEnd(currentSong.ytLink);
  };

  if (!currentSong || !videoId) {
    return (
      <Card className="bg-muted/30 mb-6 border-dashed">
        <CardContent className="flex flex-col justify-center items-center py-8 sm:py-12 text-muted-foreground text-center">
          <Radio className="opacity-50 mb-3 w-10 h-10" />
          <p className="text-sm">Waiting for requests...</p>
        </CardContent>
      </Card>
    );
  }

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1, 
      controls: 1,
      modestbranding: 1,
      rel: 0,
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    },
  };

  return (
    <Card className="bg-black shadow-xl mb-6 ring-2 ring-primary/20 overflow-hidden text-white">
      <div className="relative bg-black w-full aspect-video">
        
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          onEnd={onPlayerEnd}
          className="w-full h-full"
          iframeClassName="h-full w-full"
        />

        <div className="top-2 sm:top-3 left-2 sm:left-3 absolute flex items-center gap-1 bg-red-600 shadow-md px-2 sm:px-3 py-0.5 sm:py-1 rounded font-bold text-[10px] sm:text-xs uppercase tracking-wider">
          <Play className="fill-current w-3 sm:w-3.5 h-3 sm:h-3.5" />
          Now Playing
        </div>

        {!isReady && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/80">
            <Loader2 className="w-8 sm:w-10 h-8 sm:h-10 text-primary animate-spin" />
          </div>
        )}
      </div>

      <CardContent className="flex justify-between items-center gap-3 sm:gap-6 bg-zinc-900/90 backdrop-blur-sm p-3 sm:p-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm sm:text-base truncate">
            {currentSong.title || currentSong.ytLink}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm truncate">
            Added by {currentSong.name} • {currentSong.likes} Likes
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 rounded-full w-8 sm:w-10 h-8 sm:h-10 text-white hover:text-white"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="fill-current w-4 sm:w-5 h-4 sm:h-5" />
            ) : (
              <Play className="fill-current ml-0.5 w-4 sm:w-5 h-4 sm:h-5" />
            )}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 rounded-full w-8 sm:w-10 h-8 sm:h-10 text-white hover:text-white"
            onClick={() => onSongEnd?.(currentSong.ytLink)}
            title="Skip Song"
          >
            <SkipForward className="fill-current w-4 sm:w-5 h-4 sm:h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}