import { forwardRef } from "react";
import { Heart, ExternalLink, User, Trash2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <div ref={ref} style={style} {...props} className="mb-3">
        <Card className="group bg-background shadow-sm hover:shadow-md border overflow-hidden transition-shadow">
          <CardContent className="p-2 sm:p-3">
            <div className="flex flex-col gap-2 sm:gap-3">
              
              <div className="flex justify-between items-start gap-3">
                <div className="flex flex-1 items-start gap-3 min-w-0">
                  <div className="relative bg-muted border rounded-md w-20 sm:w-24 h-12 sm:h-14 overflow-hidden shrink-0">
                    {song.thumbnail ? (
                      <img 
                        src={song.thumbnail} 
                        alt={song.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'; 
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${song.thumbnail ? 'hidden' : 'flex'} h-full w-full items-center justify-center bg-muted text-muted-foreground`}>
                        <Music className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 justify-center py-0.5 min-w-0">
                    <a
                      href={song.ytLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-start gap-1 font-medium text-foreground hover:text-primary text-sm sm:text-base leading-tight transition-colors"
                    >
                      <span className="line-clamp-2">
                        {song.title || song.ytLink}
                      </span>
                      <ExternalLink className="opacity-0 group-hover/link:opacity-100 mt-0.5 ml-1 w-3 sm:w-3.5 h-3 sm:h-3.5 transition-opacity shrink-0" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/10 w-8 sm:w-9 h-8 sm:h-9 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(song.ytLink)}
                      title="Remove Song"
                    >
                      <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                    </Button>
                  )}

                  <div className="flex flex-col items-center gap-0.5 min-w-[36px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-transparent w-8 sm:w-9 h-8 sm:h-9"
                      onClick={() => onToggleLike(song.ytLink, !isLiked)}
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 sm:h-6 sm:w-6 ${
                          isLiked
                            ? "scale-110 fill-red-500 text-red-500"
                            : "text-muted-foreground hover:text-red-400"
                        }`}
                      />
                    </Button>
                    <span className="font-bold text-[10px] text-muted-foreground sm:text-xs">
                      {song.likes > 0 ? song.likes : "0"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-border/50 border-t">
                <Avatar className="w-5 sm:w-6 h-5 sm:h-6">
                  <AvatarImage src={song.avatar} />
                  <AvatarFallback className="text-[9px] sm:text-[10px]">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  Added by <span className="font-medium text-foreground">{song.name}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

SongCard.displayName = "SongCard";