import { Card, CardContent } from "@/components/ui/card";
import { Music, Radio, VolumeX } from "lucide-react";
import type { Song } from "@/features/jam/hooks/use-socket"; 

interface NowPlayingProps {
  currentSong?: Song;
}

export function NowPlaying({ currentSong }: NowPlayingProps) {
  if (!currentSong) {
    return (
      <Card className="bg-muted/30 mb-6 border-dashed">
        <CardContent className="flex flex-col justify-center items-center py-8 sm:py-12 text-muted-foreground text-center">
          <Radio className="opacity-50 mb-3 w-10 h-10" />
          <p className="font-medium text-sm">Why is it so quiet...</p>
          <p className="text-xs">Add a song to wake up the DJ!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background shadow-md mb-6 ring-border ring-1 overflow-hidden transition-all">
      <div className="relative bg-black w-full aspect-video">        
        {currentSong.thumbnail ? (
           <img 
             src={currentSong.thumbnail} 
             alt="Now Playing" 
             className="opacity-80 grayscale-[0.3] w-full h-full object-cover transition-all duration-700"
           />
        ) : (
            <div className="flex justify-center items-center bg-zinc-900 w-full h-full text-muted-foreground">
                <Music className="opacity-20 w-12 h-12" />
            </div>
        )}

        <div className="top-2 sm:top-3 left-2 sm:left-3 absolute flex items-center gap-1 bg-blue-600 shadow-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded font-bold text-[10px] text-white sm:text-xs uppercase tracking-wider">
          <Music className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          On Air
        </div>
      </div>

      <CardContent className="p-3 sm:p-4">
        <h3 className="pr-2 font-semibold text-foreground text-sm sm:text-base truncate">
          {currentSong.title}
        </h3>
        <div className="flex justify-between items-center gap-2 mt-1">
            <p className="text-muted-foreground text-xs sm:text-sm truncate">
              Requested by <span className="font-medium text-foreground">{currentSong.name}</span>
            </p>
            <div className="bg-primary/10 px-2 py-0.5 rounded-full font-medium text-[10px] text-primary sm:text-xs shrink-0">
                {currentSong.likes} Likes
            </div>
        </div>
      </CardContent>
    </Card>
  );
}