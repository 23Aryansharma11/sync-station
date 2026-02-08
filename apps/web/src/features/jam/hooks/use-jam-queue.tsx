import { useState, useEffect, useCallback } from "react";
import { useJamSocket } from "@/features/jam/hooks/use-jam-socket";

export interface Song {
  id: string;
  ytLink: string;
  name: string;
  avatar: string;
  title: string;
  thumbnail: string;
  likes: number;
  likedBy: Set<string>;
  addedAt: number;
}

const compareSongs = (a: Song, b: Song) => {
  if (b.likes !== a.likes) return b.likes - a.likes;
  return a.addedAt - b.addedAt;
};

const smartSort = (songs: Song[]) => {
  if (songs.length <= 1) return songs;
  const [head, ...tail] = songs;
  tail.sort(compareSongs);
  return [head, ...tail];
};

const fullSort = (songs: Song[]) => {
  return [...songs].sort(compareSongs);
};

export function useJamQueue(jamId: string, currentUserId: string) {
  const { isConnected, lastMessage, sendMessage } = useJamSocket(jamId);
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "add-music": {
        const { ytLink, name, avatar, title, thumbnail } = lastMessage.data;

        setQueue((prev) => {
          if (prev.some((s) => s.ytLink === ytLink)) return prev;

          const newSong: Song = {
            id: ytLink,
            ytLink,
            name,
            avatar,
            title: title || ytLink,     
            thumbnail: thumbnail || "", 
            likes: 0,
            likedBy: new Set(),
            addedAt: Date.now(),
          };
          return smartSort([...prev, newSong]);
        });
        break;
      }

      case "toggle-like": {
        const { ytLink, userId, isLiked } = lastMessage.data;
        setQueue((prev) => {
          const updated = prev.map((song) => {
            if (song.ytLink !== ytLink) return song;
            const newLikedBy = new Set(song.likedBy);
            isLiked ? newLikedBy.add(userId) : newLikedBy.delete(userId);
            return { ...song, likedBy: newLikedBy, likes: newLikedBy.size };
          });
          return smartSort(updated);
        });
        break;
      }

      case "remove-music": {
        const linkToRemove = lastMessage.data.ytLink;
        setQueue((prev) => {
          const filtered = prev.filter((song) => song.ytLink !== linkToRemove);
          return smartSort(filtered);
        });
        break;
      }

      case "initial-queue": {
        const loadedQueue = lastMessage.data.queue.map((s: any) => ({
          id: s.ytLink,
          ytLink: s.ytLink,
          name: s.name,
          avatar: s.avatar,
          title: s.title || s.ytLink,    
          thumbnail: s.thumbnail || "",  
          likes: s.likes,
          likedBy: new Set(s.likedBy),
          addedAt: s.addedAt || Date.now(),
        }));
        setQueue(fullSort(loadedQueue));
        break;
      }
    }
  }, [lastMessage]);

  const toggleLike = useCallback((ytLink: string, isLiked: boolean) => {
    if (!isConnected) return;
    setQueue((prev) => {
      const updated = prev.map((song) => {
        if (song.ytLink !== ytLink) return song;
        const newLikedBy = new Set(song.likedBy);
        isLiked ? newLikedBy.add(currentUserId) : newLikedBy.delete(currentUserId);
        return { ...song, likedBy: newLikedBy, likes: newLikedBy.size };
      });
      return smartSort(updated);
    });
    sendMessage({ type: "toggle-like", data: { ytLink, userId: currentUserId, isLiked } });
  }, [isConnected, sendMessage, currentUserId]);

  const removeSong = useCallback((ytLink: string) => {
    if (!isConnected) return;
    setQueue((prev) => {
      const filtered = prev.filter((song) => song.ytLink !== ytLink);
      return smartSort(filtered);
    });
    sendMessage({ type: "remove-music", data: { ytLink } });
  }, [isConnected, sendMessage]);

  return { queue, isConnected, toggleLike, removeSong };
}