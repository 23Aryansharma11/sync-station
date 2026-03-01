import { useState, useEffect, useCallback, useRef } from "react";
import { useJamSocket } from "./use-jam-socket";

export type Song = {
  id: string;
  ytLink: string;
  name: string;
  avatar: string;
  title: string;
  thumbnail: string;
  likes: number;
  likedBy: Set<string>;
  addedAt: number;
};

export type ActiveUser = {
  id: string;
  name: string;
  avatar: string;
};

export function useSocket(jamId: string, currentUserId: string) {
  const { isConnected, lastMessage, sendMessage } = useJamSocket(jamId);
  const [queue, setQueue] = useState<Song[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [bannedUsers, setBannedUsers] = useState<ActiveUser[]>([]);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [wasKicked, setWasKicked] = useState(false);

  const playingSongIdRef = useRef<string | null>(null);

  const stableSort = useCallback((unsortedQueue: Song[]) => {
      if (unsortedQueue.length === 0) {
          playingSongIdRef.current = null;
          return [];
      }
      const normalSort = [...unsortedQueue].sort((a, b) => b.likes - a.likes || a.addedAt - b.addedAt);

      if (!playingSongIdRef.current) {
          playingSongIdRef.current = normalSort[0].id;
          return normalSort;
      }

      const lockedSong = unsortedQueue.find(s => s.id === playingSongIdRef.current);

      if (!lockedSong) {
          playingSongIdRef.current = normalSort[0].id;
          return normalSort;
      }

      const others = unsortedQueue.filter(s => s.id !== playingSongIdRef.current);
      others.sort((a, b) => b.likes - a.likes || a.addedAt - b.addedAt);

      return [lockedSong, ...others];
  }, []);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
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
        setQueue(stableSort(loadedQueue));
        setActiveUsers(lastMessage.data.users || []); 
        setBannedUsers(lastMessage.data.bannedUsers || []); 
        break;
      }

      case "join": {
        setActiveUsers((prev) => {
            if (prev.some(u => u.id === lastMessage.data.joineeId)) return prev;
            return [...prev, { 
                id: lastMessage.data.joineeId, 
                name: lastMessage.data.username, 
                avatar: lastMessage.data.avatar 
            }];
        });
        break;
      }

      case "leave": {
        setActiveUsers((prev) => prev.filter(u => u.id !== lastMessage.data.userId));
        break;
      }

      case "user-kicked": {
        const kickedId = lastMessage.data.userId;
        if (kickedId === currentUserId) {
            setWasKicked(true); 
        } else {
            setActiveUsers((prev) => {
                const kickedUser = prev.find(u => u.id === kickedId);
                if (kickedUser) {
                    setBannedUsers(b => [...b, kickedUser]);
                }
                return prev.filter(u => u.id !== kickedId);
            });
        }
        break;
      }

      case "user-unblocked": {
        const unblockedId = lastMessage.data.userId;
        setBannedUsers((prev) => prev.filter(u => u.id !== unblockedId));
        break;
      }

      case "add-music": {
        const { ytLink, name, avatar, title, thumbnail } = lastMessage.data;
        setQueue((prev) => {
          if (prev.some((s) => s.ytLink === ytLink)) return prev;
          const newSong: Song = {
            id: ytLink, ytLink, name, avatar, title: title || ytLink,     
            thumbnail: thumbnail || "", likes: 0, likedBy: new Set(), addedAt: Date.now(),
          };
          return stableSort([...prev, newSong]);
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
          return stableSort(updated);
        });
        break;
      }

      case "remove-music": {
        const linkToRemove = lastMessage.data.ytLink;
        setQueue((prev) => {
          const filtered = prev.filter((song) => song.ytLink !== linkToRemove);
          return stableSort(filtered);
        });
        break;
      }

      case "session-ended": {
        setSessionEnded(true);
        break;
      }
    }
  }, [lastMessage, currentUserId, stableSort]);

  const toggleLike = useCallback((ytLink: string, isLiked: boolean) => {
    if (!isConnected) return;
    setQueue((prev) => {
      const updated = prev.map((song) => {
        if (song.ytLink !== ytLink) return song;
        const newLikedBy = new Set(song.likedBy);
        isLiked ? newLikedBy.add(currentUserId) : newLikedBy.delete(currentUserId);
        return { ...song, likedBy: newLikedBy, likes: newLikedBy.size };
      });
      return stableSort(updated);
    });
    sendMessage({ type: "toggle-like", data: { ytLink, userId: currentUserId, isLiked } });
  }, [isConnected, sendMessage, currentUserId, stableSort]);

  const removeSong = useCallback((ytLink: string) => {
    if (!isConnected) return;
    setQueue((prev) => {
      const filtered = prev.filter((song) => song.ytLink !== ytLink);
      return stableSort(filtered);
    });
    sendMessage({ type: "remove-music", data: { ytLink } });
  }, [isConnected, sendMessage, stableSort]);

  const endSession = useCallback(() => {
    if (!isConnected) return;
    sendMessage({ type: "end-session", data: {} });
  }, [isConnected, sendMessage]);

  const kickUser = useCallback((userId: string) => {
    if (!isConnected) return;
    sendMessage({ type: "kick-user", data: { userId } });
  }, [isConnected, sendMessage]);

  const unblockUser = useCallback((userId: string) => {
    if (!isConnected) return;
    sendMessage({ type: "unblock-user", data: { userId } });
  }, [isConnected, sendMessage]);

  return { queue, activeUsers, bannedUsers, isConnected, sessionEnded, wasKicked, toggleLike, removeSong, endSession, kickUser, unblockUser };
}