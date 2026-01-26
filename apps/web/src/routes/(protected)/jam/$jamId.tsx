import { api } from '@/lib/api'
import { requireAuth } from '@/lib/auth-loader'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Loader2, AlertCircle } from "lucide-react"

// --- Helper for cleaner code ---
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

const clearCookie = (name: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  }
}

export const Route = createFileRoute('/(protected)/jam/$jamId')({
  component: JamRoom,
  beforeLoad: requireAuth, // Check general login first
  
  // Clean Loader
  loader: async ({ params }) => {
    if (typeof document === "undefined") return null;

    const token = getCookie('jamJoinToken');
    
    const redirectToJoin = () => {
      throw redirect({
        to: "/jam/join/$jamId",
        params: { jamId: params.jamId },
        replace: true
      });
    };

    if (!token) redirectToJoin();

    const { data, error } = await api.jam["verify-token"].post({ token: token! });

    // 4. Handle Invalid Token
    if (error || !data?.valid) {
      clearCookie('jamJoinToken');
      redirectToJoin();
    }

    return { 
      jamId: data?.jamId, 
      token: token! 
    };
  },

  // UX: Show this while verifying token
  pendingComponent: () => (
    <div className="flex justify-center items-center w-full h-screen">
      <Loader2 className="w-8 h-8 text-neutral-500 animate-spin" />
      <span className="ml-2 text-neutral-500">Verifying access...</span>
    </div>
  ),

  // UX: Show this if API crashes
  errorComponent: () => (
    <div className="flex flex-col justify-center items-center gap-2 w-full h-screen text-red-500">
      <AlertCircle className="w-10 h-10" />
      <p>Failed to join Jam Session.</p>
    </div>
  )
})

function JamRoom() {
  const { jamId, token } = Route.useLoaderData() || {};

  // ---------------------------------------------------------
  // 🔌 WebSocket Hook Placeholder
  // You can now use the verified token to connect instantly
  // const socket = useJamSocket({ jamId, token });
  // ---------------------------------------------------------

  return (
    <div className="p-6">
      <h1 className="font-bold text-2xl">Jam Room: {jamId}</h1>
      <p className="text-muted-foreground text-sm">
        Authenticated with token: <code className="bg-neutral-100 p-1 rounded">{token?.slice(0, 10)}...</code>
      </p>
      
      {/* Your Music Player / Chat UI goes here */}
    </div>
  )
}