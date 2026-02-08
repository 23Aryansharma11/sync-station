import { useState, useEffect, useCallback } from "react";
import { type Song } from "@/features/jam/components/song-card";
import { useJamSocket } from "@/features/jam/hooks/use-jam-socket";

const sortQueue = (songs: Song[]) => {
  return [...songs].sort((a, b) => {
    if (b.likes !== a.likes) return b.likes - a.likes;
    return 0;
  });
};

export function useJamQueue(jamId: string, currentUserId: string) {
  const { isConnected, lastMessage, sendMessage } = useJamSocket(jamId);
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === "add-music") {
      setQueue((prev) => {
        const exists = prev.some(s => s.ytLink === lastMessage.data.ytLink);
        if (exists) return prev;

        const newSong: Song = {
          id: lastMessage.data.ytLink,
          ytLink: lastMessage.data.ytLink,
          name: lastMessage.data.name,
          avatar: lastMessage.data.avatar,
          likes: 0,
          likedBy: new Set(),
        };
        return sortQueue([newSong, ...prev]);
      });
    }

    if (lastMessage.type === "toggle-like") {
      const { ytLink, userId, isLiked } = lastMessage.data; // Look for ytLink

      setQueue((prev) => {
        const updated = prev.map((song) => {
          // Compare Links instead of IDs
          if (song.ytLink !== ytLink) return song;

          const newLikedBy = new Set(song.likedBy);
          if (isLiked) newLikedBy.add(userId);
          else newLikedBy.delete(userId);

          return { ...song, likedBy: newLikedBy, likes: newLikedBy.size };
        });
        return sortQueue(updated);
      });
    }

    if (lastMessage.type === "remove-music") {
      const linkToRemove = lastMessage.data.ytLink;
      setQueue((prev) => prev.filter((song) => song.ytLink !== linkToRemove));
    }

    if (lastMessage.type === "initial-queue") {
      const loadedQueue = lastMessage.data.queue.map((s: any) => ({
        id: s.ytLink,
        ytLink: s.ytLink,
        name: s.name,
        avatar: s.avatar,
        likes: s.likes,
        likedBy: new Set(s.likedBy),
      }));

      setQueue(sortQueue(loadedQueue));
    }

  }, [lastMessage]);


  const toggleLike = useCallback((ytLink: string, isLiked: boolean) => {
    if (!isConnected) return;

    // Optimistic Update
    setQueue((prev) => {
      const updated = prev.map((song) => {
        if (song.ytLink !== ytLink) return song;

        const newLikedBy = new Set(song.likedBy);
        if (isLiked) newLikedBy.add(currentUserId);
        else newLikedBy.delete(currentUserId);

        return { ...song, likedBy: newLikedBy, likes: newLikedBy.size };
      });
      return sortQueue(updated);
    });

    // Send Link to Server
    sendMessage({
      type: "toggle-like",
      data: {
        ytLink, // Send the link identifier
        userId: currentUserId,
        isLiked,
      },
    });
  }, [isConnected, sendMessage, currentUserId]);

  const removeSong = useCallback((ytLink: string) => {
    if (!isConnected) return;

    // 1. Optimistic Update (Remove instantly from UI)
    setQueue((prev) => prev.filter((song) => song.ytLink !== ytLink));

    // 2. Send to Server
    sendMessage({
      type: "remove-music",
      data: { ytLink }
    });
  }, [isConnected, sendMessage]);

  return { queue, isConnected, toggleLike, removeSong };
}