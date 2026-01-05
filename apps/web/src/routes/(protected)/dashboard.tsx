import { createFileRoute } from "@tanstack/react-router";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { JamCard } from "@/features/jam/components/jam-card";
import { requireAuth } from "@/lib/auth-loader";

const jamData = [{
  jamId: "jam-1",
  bgImage: "https://plus.unsplash.com/premium_photo-1683121126477-17ef068309bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGFydHl8ZW58MHx8MHx8fDA%3D",
  name: "Retro Beats Night",
  isActive: true,
  description: "Live jazz fusion with 8 participants • 2h 15m synced",
  createdAt: new Date("2026-01-04T14:30:00Z"),
},
{
  jamId: "jam-2",
  bgImage: "https://plus.unsplash.com/premium_photo-1661301057249-bd008eebd06a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3ltfGVufDB8fDB8fHww",
  name: "Chill Lo-Fi Lounge",
  isActive: false,
  description: "Acoustic covers & coffee shop vibes • Paused 3 days ago",
  createdAt: new Date("2026-01-02T20:45:00Z"),
},]

export const Route = createFileRoute("/(protected)/dashboard")({
  component: RouteComponent,
  beforeLoad: requireAuth
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  return (
    <div className="min-h-screen bg-background/50 p-4 sm:p-6 lg:p-8 w-full flex flex-col items-start overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
          <Avatar className="h-14 w-14 sm:h-12 sm:w-12 shrink-0 ring-2 ring-background/80">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="text-sm font-semibold">
              {session.user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <p className="text-2xl sm:text-3xl font-bold text-foreground truncate">
              {session.user.name}
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground truncate max-w-xs">
              {session.user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center sm:justify-start items-center flex-wrap gap-6">
        {
          jamData.map(data => (
            <JamCard
              key={data.jamId}
              {...data}
            />
          ))
        }
        <Button variant={"ghost"} className="size-64 rounded-xl border-2 border-foreground flex justify-center items-center text-2xl cursor-not-allowed">
          <Plus className="w-8" />
          <span>
            Create New Room
          </span>
        </Button>
      </div>
    </div>
  );
}