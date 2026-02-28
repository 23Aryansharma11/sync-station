import { forwardRef } from "react";
import { ExternalLink, Trash2, Music, User, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Song } from "@/features/jam/hooks/use-jam-queue"; 

interface SongCardProps {
  song: Song;
  currentUserId: string;
  isAdmin: boolean;
  onToggleLike: (ytLink: string, isLiked: boolean) => void;
  onRemove: (ytLink: string) => void;
  style?: React.CSSProperties;
}

export const SongCard = forwardRef<HTMLDivElement, SongCardProps>(
  ({ song, currentUserId, isAdmin, onToggleLike, onRemove, style, ...props }, ref) => {
    
    const isLiked = song.likedBy.has(currentUserId);

    return (
      // The outermost div must receive the ref and style for react-flip-move to work
      <div ref={ref} style={style} {...props} className="block w-full">
        <div className="group relative bg-card/40 hover:bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300">
          
          {/* Subtle gradient hover effect */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
            
            {/* --- THUMBNAIL MODULE --- */}
            <div className="relative flex justify-center items-center bg-background border border-border/50 rounded-xl w-24 sm:w-32 h-16 sm:h-20 overflow-hidden shrink-0">
              {song.thumbnail ? (
                <>
                  <img 
                    src={song.thumbnail} 
                    alt={song.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none'; 
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* CRT/Scanline Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] opacity-20 bg-size-[100%_4px] pointer-events-none" />
                </>
              ) : null}
              <div className={`${song.thumbnail ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-muted text-muted-foreground`}>
                  <Music className="opacity-50 w-6 h-6" />
              </div>
            </div>

            {/* --- TRACK DATA --- */}
            <div className="flex flex-col flex-1 justify-center py-1 min-w-0">
              <a
                href={song.ytLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 mb-2 font-bold text-foreground hover:text-primary text-sm sm:text-base leading-tight transition-colors"
                title={song.title || song.ytLink}
              >
                <span className="uppercase line-clamp-2 tracking-tight">
                  {song.title || song.ytLink}
                </span>
                <ExternalLink className="opacity-0 group-hover:opacity-100 mt-0.5 w-3.5 h-3.5 text-primary transition-opacity shrink-0" />
              </a>

              {/* Submitter Telemetry */}
              <div className="flex items-center gap-2 mt-auto">
                <Avatar className="border border-border/50 w-5 h-5">
                  <AvatarImage src={song.avatar} />
                  <AvatarFallback className="bg-background text-[9px]">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-mono text-[10px] text-muted-foreground sm:text-xs uppercase tracking-widest">
                  REQ BY: <span className="font-bold text-foreground">{song.name}</span>
                </span>
              </div>
            </div>

            {/* --- CONTROLS SECTION --- */}
            <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-border/50 border-l shrink-0">
              
              {/* Upvote / Boost Button */}
              <div className="flex flex-col justify-center items-center min-w-[40px]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="group/btn relative hover:bg-transparent w-10 h-10"
                  onClick={() => onToggleLike(song.ytLink, !isLiked)}
                >
                  {/* Replaced generic Heart with a 'Flame' for a more energetic "Boost" feel */}
                  <Flame
                    className={`h-6 w-6 transition-all duration-300 ${
                      isLiked
                        ? "text-primary fill-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.6)] scale-110"
                        : "text-muted-foreground group-hover/btn:text-primary/50 group-hover/btn:scale-105"
                    }`}
                  />
                </Button>
                <span className={`font-mono font-black text-sm transition-colors ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}>
                  {song.likes > 0 ? song.likes : "0"}
                </span>
              </div>

              {/* Admin Override (Delete) */}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 rounded-xl w-10 h-10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  onClick={() => onRemove(song.ytLink)}
                  title="Override & Remove"
                >
                  <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }
);

SongCard.displayName = "SongCard";