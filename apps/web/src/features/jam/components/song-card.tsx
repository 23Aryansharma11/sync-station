import { forwardRef } from "react";
import { Heart, Music, ExternalLink, User, Trash2 } from "lucide-react"; // Import Trash2
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Song {
  id: string; 
  ytLink: string;
  name: string;
  avatar: string;
  likes: number;
  likedBy: Set<string>;
}

interface SongCardProps {
  song: Song;
  currentUserId: string;
  isAdmin: boolean; // <--- New Prop
  onToggleLike: (ytLink: string, isLiked: boolean) => void;
  onRemove: (ytLink: string) => void; // <--- New Prop
  style?: React.CSSProperties; 
}

export const SongCard = forwardRef<HTMLDivElement, SongCardProps>(
  ({ song, currentUserId, isAdmin, onToggleLike, onRemove, style, ...props }, ref) => {
    
    const isLiked = song.likedBy.has(currentUserId);

    return (
      <div ref={ref} style={style} {...props} className="mb-3">
        <Card className="group bg-background shadow-sm hover:shadow-md border transition-shadow">
          <CardContent className="p-3">
            <div className="flex flex-col gap-3">
              
              <div className="flex justify-between items-start gap-3">
                
                {/* Left Side: Icon & Link */}
                <div className="flex flex-1 items-start gap-3 min-w-0">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-red-600 dark:text-red-400 shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pt-1 min-w-0">
                    <a
                      href={song.ytLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline truncate"
                    >
                      <span className="truncate">{song.ytLink}</span>
                      <ExternalLink className="opacity-0 group-hover:opacity-100 w-3 h-3 transition-opacity" />
                    </a>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-1">
                  
                  {/* DELETE BUTTON (Admin Only) */}
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/10 w-8 h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(song.ytLink)}
                      title="Remove Song"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}

                  {/* LIKE BUTTON */}
                  <div className="flex flex-col items-center gap-0.5 ml-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-transparent w-8 h-8"
                      onClick={() => onToggleLike(song.ytLink, !isLiked)}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-300 ${
                          isLiked
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-muted-foreground hover:text-red-400"
                        }`}
                      />
                    </Button>
                    <span className="font-bold text-[10px] text-muted-foreground">
                      {song.likes > 0 ? song.likes : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: User Info */}
              <div className="flex items-center gap-2 pt-2 border-border/50 border-t">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={song.avatar} />
                  <AvatarFallback className="text-[9px]">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-xs">
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