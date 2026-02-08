import FlipMove from "react-flip-move";
import { api } from "@/lib/api";
import { requireAuth } from "@/lib/auth-loader";
import { Music, Radio, Wifi, WifiOff } from "lucide-react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { AddMusicDrawer } from "@/features/jam/components/add-music-form";
import { authClient } from "@/lib/auth-client";
import { SongCard } from "@/features/jam/components/song-card";
import { useJamQueue } from "@/features/jam/hooks/use-jam-queue";
import { useQuery } from "@tanstack/react-query";
import { isAdminQuery } from "@/features/jam/query/get-is-admin";

// --- Cookie Helpers ---
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
}

const clearCookie = (name: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  }
}

// --- Route Definition ---
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
    const { data, error } = await api.jam["verify-token"].post({ token: token! });

    if (error || !data?.valid) {
      clearCookie('jamJoinToken');
      redirectToJoin();
    }
    return { jamId: data?.jamId };
  },
})

function JamRoom() {
  const { jamId } = Route.useLoaderData() || { jamId: "" };
  const { data: session } = authClient.useSession();

  const currentUserId = session?.user?.id || "anon-user";

  const { data: isAdmin } = useQuery(isAdminQuery(String(jamId)))

  // 2. GET REMOVE FUNCTION FROM HOOK
  const { queue, isConnected, toggleLike, removeSong } = useJamQueue(String(jamId), currentUserId);

  return (
    <div className="flex flex-col items-center bg-background px-4 py-8 min-h-screen text-foreground">
      <div className="flex flex-col w-full max-w-xl h-full">

        {/* --- Header --- */}
        <div className="flex justify-between items-end mb-8 pb-4 border-b">
          <div>
            <h1 className="font-extrabold text-3xl tracking-tight">Jam Session</h1>
            <div className="flex items-center gap-2 mt-2">
              {isConnected ? (
                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full font-medium text-green-600 text-xs">
                  <Wifi className="w-3 h-3" />
                  <span>Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full font-medium text-red-600 text-xs">
                  <WifiOff className="w-3 h-3" />
                  <span>Reconnecting...</span>
                </div>
              )}
            </div>
          </div>

          {session?.user && (
            <AddMusicDrawer jamId={String(jamId)} />
          )}
        </div>

        <div className="flex-1 min-h-[50vh] overflow-y-auto">
          {queue.length === 0 ? (
            <EmptyState />
          ) : (
            <FlipMove
              typeName="div"
              duration={400}
              easing="cubic-bezier(0.25, 1, 0.5, 1)"
              staggerDurationBy={20}
              enterAnimation="accordionVertical"
              leaveAnimation="accordionVertical"
            >
              {queue.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  currentUserId={currentUserId}
                  isAdmin={Boolean(isAdmin)}
                  onToggleLike={toggleLike}
                  onRemove={removeSong}
                />
              ))}
            </FlipMove>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col justify-center items-center bg-muted/5 border-2 border-muted-foreground/20 border-dashed rounded-xl h-64 text-muted-foreground text-center animate-in duration-300 fade-in zoom-in">
      <div className="bg-background shadow-sm mb-4 p-4 rounded-full">
        <Radio className="opacity-50 w-8 h-8 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground text-lg">Queue is empty</h3>
      <p className="max-w-[250px] text-sm">
        Be the DJ! Add the first song to start the jam session.
      </p>
    </div>
  );
}