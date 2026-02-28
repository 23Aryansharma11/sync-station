import { useEffect } from "react";
import FlipMove from "react-flip-move";
import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Radio, Activity, Signal, SignalZero, ListMusic, ShieldAlert, Users, PowerOff, Ban, Unlock } from "lucide-react";

import { api } from "@/lib/api";
import { requireAuth } from "@/lib/auth-loader";
import { authClient } from "@/lib/auth-client";
import { useJamQueue } from "@/features/jam/hooks/use-jam-queue";
import { getJamQuery } from "@/features/jam/query/get-jam-query";

import { AddMusicDrawer } from "@/features/jam/components/add-music-form";
import { SongCard } from "@/features/jam/components/song-card";
import { AdminPlayer } from "@/features/jam/components/admin-player";
import { NowPlaying } from "@/features/jam/components/now-playing";
import { ShareJamBtn } from "@/features/jam/components/share-jam-btn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

// --- COOKIE UTILS --- //
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
}

const clearCookie = (name: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  }
}

// --- ROUTE CONFIG --- //
export const Route = createFileRoute('/(protected)/jam/$jamId')({
  component: JamRoom,
  beforeLoad: requireAuth,
  loader: async ({ params }) => {
    if (typeof document === "undefined") return null;
    const token = getCookie('jamJoinToken');

    const redirectToJoin = () => {
      throw redirect({ to: "/jam/join/$jamId", params: { jamId: params.jamId }, replace: true });
    };

    if (!token) redirectToJoin();

    const { data: tokenData, error: tokenError } = await api.jam["verify-token"].post({ token: token! });
    if (tokenError || !tokenData?.valid) {
      clearCookie('jamJoinToken');
      redirectToJoin();
    }

    const { data: jamData, error: jamError } = await api.jam({ id: params.jamId }).get();
    if (jamError || !jamData) {
      throw redirect({ to: "/dashboard", replace: true });
    }

    return { jam: jamData };
  },
  pendingComponent: JamRoomPending,
  errorComponent: JamRoomError,
})

// --- RESPONSIVE LOADING STATE (SKELETON) --- //
function JamRoomPending() {
  return (
    <div className="bg-background pb-24 w-full min-h-screen">
      <div className="top-0 left-1/2 -z-10 fixed bg-primary/5 blur-[120px] rounded-full w-full max-w-3xl h-[500px] -translate-x-1/2 pointer-events-none" />

      <div className="flex flex-col mx-auto px-4 py-8 max-w-3xl h-full container">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-end gap-6 mb-8 pb-6 border-border/30 border-b">
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-3">
              <div className="bg-muted/50 rounded-xl w-10 h-10 animate-pulse" />
              <div className="bg-muted/50 rounded-lg w-48 sm:w-64 h-10 animate-pulse" />
            </div>
            <div className="bg-muted/50 rounded-full w-32 h-6 animate-pulse" />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="bg-muted/50 rounded-xl w-full sm:w-32 h-10 animate-pulse" />
          </div>
        </div>

        <div className="mb-10 w-full">
          <div className="bg-card/30 border border-border/30 rounded-[2rem] w-full h-[250px] animate-pulse" />
        </div>

        <div className="flex flex-col flex-1 w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-muted/50 rounded-lg w-48 h-8 animate-pulse" />
            <div className="bg-muted/50 rounded-full w-20 h-6 animate-pulse" />
          </div>
          <div className="space-y-3 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card/30 border border-border/30 rounded-2xl w-full h-24 sm:h-28 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- RESPONSIVE ERROR STATE --- //
function JamRoomError({ error }: { error: any }) {
  return (
    <div className="flex flex-col justify-center items-center bg-background selection:bg-destructive/30 p-8 min-h-screen text-center">
      <div className="top-1/2 left-1/2 -z-10 absolute bg-destructive/5 blur-[120px] rounded-full w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="flex justify-center items-center bg-destructive/10 shadow-destructive/20 shadow-inner mb-6 border border-destructive/20 rounded-3xl w-20 h-20 text-destructive">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <h2 className="mb-2 font-black text-foreground text-4xl uppercase tracking-tighter">
        Signal Lost
      </h2>
      <p className="mb-8 font-mono text-muted-foreground text-sm uppercase tracking-widest">
        ERR_CONNECTION_DROPPED: {error?.message || "STATION UPLINK FAILED"}
      </p>

      <div className="flex sm:flex-row flex-col gap-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-xl font-bold text-primary-foreground uppercase tracking-widest active:scale-95 transition-colors"
        >
          Retry Connection
        </button>
        <Link
          to="/dashboard"
          className="bg-muted/50 hover:bg-muted px-8 py-4 border border-border/50 rounded-xl font-bold text-foreground uppercase tracking-widest active:scale-95 transition-colors"
        >
          Abort to Command Center
        </Link>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT --- //
function JamRoom() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { jam } = Route.useLoaderData() || { jam: null };
  const jamId = jam?.id || "";

  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id || "anon-user";

  const isAdmin = Boolean(currentUserId && jam && (jam as any).authorId === currentUserId);

  const { queue, activeUsers, bannedUsers, isConnected, sessionEnded, wasKicked, toggleLike, removeSong, endSession, kickUser, unblockUser } = useJamQueue(jamId, currentUserId);

  // Hard Redirects for Booted / Ended Sessions
  useEffect(() => {
    if (wasKicked) {
      clearCookie('jamJoinToken');
      toast.error("Uplink Severed", {
        description: "You have been blocked by the Operator.",
      });
      navigate({ to: "/dashboard", replace: true });
    } else if (sessionEnded && !isAdmin) {
      clearCookie('jamJoinToken');
      toast.error("Station Terminated by Operator.", {
        description: "You have been disconnected from the Jam.",
      });
      navigate({ to: "/dashboard", replace: true });
    }
  }, [sessionEnded, wasKicked, navigate, isAdmin]);

  useEffect(() => {
    const handleBeforeUnload = () => clearCookie('jamJoinToken');
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearCookie('jamJoinToken');
    };
  }, []);

  const deleteMutation = useMutation({
    mutationFn: () => api.jam({ id: jamId }).delete(),
    onSuccess: async () => {
      endSession();
      await queryClient.invalidateQueries({ queryKey: getJamQuery.queryKey });
      clearCookie('jamJoinToken');
      toast.success("Station terminated successfully.");
      navigate({ to: "/dashboard", replace: true });
    },
    onError: () => toast.error("Failed to terminate station from DB.")
  });

  const handleEndSession = () => {
    if (confirm("Are you sure you want to terminate this Station? Everyone will be disconnected.")) {
      deleteMutation.mutate();
    }
  };

  const currentSong = queue.length > 0 ? queue[0] : undefined;
  const upcomingQueue = queue.length > 0 ? queue.slice(1) : [];

  if (!jam) return null;

  return (
    <div className="bg-background selection:bg-primary/30 pb-24 min-h-screen text-foreground">

      {/* Ambient Glow */}
      <div className="top-0 left-1/2 -z-10 fixed bg-primary/5 blur-[120px] rounded-full w-full max-w-3xl h-[500px] -translate-x-1/2 pointer-events-none" />

      <div className="flex flex-col mx-auto px-4 py-8 max-w-3xl h-full container">

        {/* --- STATION HEADER --- */}
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-end gap-6 mb-8 pb-6 border-border/50 border-b">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex justify-center items-center bg-primary/20 shadow-inner rounded-xl w-10 h-10 text-primary shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="font-black text-4xl sm:text-5xl truncate italic uppercase leading-none tracking-tighter">
                  {jam.name}
                </h1>
              </div>
            </div>

            {jam.description && (
              <p className="mt-2 max-w-lg font-medium text-muted-foreground text-sm line-clamp-2">
                {jam.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-5 font-mono text-xs uppercase tracking-widest">
              {isConnected ? (
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 border border-primary/20 rounded-full text-primary">
                  <Signal className="w-3.5 h-3.5" />
                  <span className="flex bg-primary rounded-full w-1.5 h-1.5 animate-pulse" />
                  TX/RX ACTIVE
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-destructive/10 px-3 py-1.5 border border-destructive/20 rounded-full text-destructive">
                  <SignalZero className="w-3.5 h-3.5" />
                  <span className="flex bg-destructive rounded-full w-1.5 h-1.5" />
                  CARRIER LOST
                </div>
              )}
              <Dialog>
                <DialogTrigger render={<button className="flex items-center gap-2 bg-muted/50 hover:bg-muted/80 px-3 py-1.5 border border-border/50 rounded-full outline-none transition-colors cursor-pointer">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="mr-1 text-muted-foreground">Operators:</span>

                  <div className="flex -space-x-2 overflow-hidden">
                    {activeUsers?.slice(0, 4).map((user) => (
                      <Avatar key={user.id} className="inline-block border-2 border-background w-5 h-5">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/20 text-[8px] text-primary">
                          {user.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {activeUsers && activeUsers.length > 4 && (
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      +{activeUsers.length - 4}
                    </span>
                  )}
                </button>}>

                </DialogTrigger>
                <DialogContent className="bg-card/90 backdrop-blur-xl border-border/50 sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-black text-2xl uppercase tracking-tighter">
                      <Users className="w-5 h-5 text-primary" /> Active Operators
                    </DialogTitle>
                    <DialogDescription className="font-mono text-xs uppercase tracking-widest">
                      {activeUsers.length} Currently connected to node
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 mt-2 pr-2 max-h-[60vh] overflow-y-auto">

                    {/* ACTIVE LIST */}
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                        <Signal className="w-3 h-3 text-primary" /> Connected Users
                      </h4>
                      {activeUsers.map(user => (
                        <div key={user.id} className="flex justify-between items-center bg-background/50 p-3 border border-border/50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Avatar className="border border-border/50 w-10 h-10">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-muted font-bold text-xs">
                                {user.name?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{user.name}</span>
                              {user.id === (jam as any).authorId && (
                                <span className="font-mono text-[10px] text-primary uppercase tracking-widest">Station Operator</span>
                              )}
                            </div>
                          </div>

                          {/* Admin Block Action */}
                          {isAdmin && user.id !== currentUserId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Sever uplink for ${user.name}? They will be permanently blocked.`)) {
                                  kickUser(user.id);
                                }
                              }}
                              className="gap-2 hover:bg-destructive border-destructive/30 text-destructive hover:text-destructive-foreground transition-colors"
                            >
                              <Ban className="w-3 h-3" /> Block
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* BLOCKED LIST (ADMIN ONLY) */}
                    {isAdmin && bannedUsers.length > 0 && (
                      <div className="space-y-3 pt-4 border-border/50 border-t">
                        <h4 className="flex items-center gap-2 font-mono text-[10px] text-destructive uppercase tracking-widest">
                          <Ban className="w-3 h-3" /> Severed Uplinks
                        </h4>
                        {bannedUsers.map(user => (
                          <div key={user.id} className="flex justify-between items-center bg-destructive/5 opacity-80 p-3 border border-destructive/20 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Avatar className="grayscale border border-destructive/30 w-10 h-10">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="bg-muted font-bold text-xs">
                                  {user.name?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-bold text-muted-foreground text-sm line-through">{user.name}</span>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => unblockUser(user.id)}
                              className="gap-2 hover:bg-green-500/20 border-green-500/30 text-green-500 hover:text-green-400 transition-colors"
                            >
                              <Unlock className="w-3 h-3" /> Restore
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
            {session?.user && <AddMusicDrawer jamId={jamId} />}
            {isAdmin && <ShareJamBtn />}

            {/* Admin Delete Action */}
            {isAdmin && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleEndSession}
                disabled={deleteMutation.isPending}
                className="hover:bg-destructive border-destructive/20 rounded-full w-10 h-10 text-destructive hover:text-destructive-foreground transition-all"
                title="Terminate Station"
              >
                <PowerOff className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* --- CURRENT BROADCAST (PLAYER) --- */}
        <div className="group relative mb-10">
          <div className="absolute -inset-0.5 bg-linear-to-b from-primary/30 to-transparent opacity-50 group-hover:opacity-100 blur-sm rounded-[2rem] transition duration-500" />
          <div className="relative bg-card/80 backdrop-blur-xl p-1 border border-border/50 rounded-[calc(2rem-2px)]">

            {/* Player Header */}
            <div className="flex items-center gap-2 px-6 pt-5 pb-3 font-mono font-bold text-primary text-xs uppercase tracking-widest">
              <Activity className="w-4 h-4" />
              Current Broadcast
            </div>

            {/* The Actual Player Component */}
            <div className="px-2 pb-2">
              {isAdmin ? (
                <AdminPlayer
                  currentSong={currentSong}
                  onSongEnd={(link) => removeSong(link)}
                />
              ) : (
                <NowPlaying currentSong={currentSong} />
              )}
            </div>
          </div>
        </div>

        {/* --- TRANSMISSION QUEUE --- */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="flex items-center gap-3 font-bold text-2xl uppercase tracking-tight">
              <ListMusic className="w-6 h-6 text-muted-foreground" />
              Transmission Queue
            </h3>
            <span className="bg-muted px-3 py-1 rounded-full font-mono font-bold text-muted-foreground text-xs uppercase tracking-widest">
              {upcomingQueue.length} Tracks
            </span>
          </div>

          <div className="flex-1">
            {upcomingQueue.length === 0 ? (
              <div className="flex flex-col justify-center items-center bg-card/30 border-2 border-border/50 border-dashed rounded-[2rem] h-48 text-muted-foreground">
                <Radio className="opacity-20 mb-3 w-8 h-8" />
                <p className="font-mono text-sm uppercase tracking-widest">
                  {currentSong ? "Awaiting next transmission..." : "Uplink empty. Add a track."}
                </p>
              </div>
            ) : (
              <FlipMove
                typeName="div"
                className="space-y-3"
                duration={400}
                easing="cubic-bezier(0.25, 1, 0.5, 1)"
                staggerDurationBy={20}
                enterAnimation="fade"
                leaveAnimation="fade"
              >
                {upcomingQueue.map((song) => (
                  <div key={song.id} className="block">
                    <SongCard
                      song={song}
                      currentUserId={currentUserId}
                      isAdmin={Boolean(isAdmin)}
                      onToggleLike={toggleLike}
                      onRemove={removeSong}
                    />
                  </div>
                ))}
              </FlipMove>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}