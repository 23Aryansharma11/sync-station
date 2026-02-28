import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateJamBtn } from "@/features/jam/components/create-jam-btn";
import { JamCard } from "@/features/jam/components/jam-card";
import { requireAuth } from "@/lib/auth-loader";
import { getJamQuery } from "@/features/jam/query/get-jam-query";

export const Route = createFileRoute("/(protected)/dashboard")({
    component: RouteComponent,
    beforeLoad: requireAuth,
    pendingComponent: PendingComponent,
    errorComponent: () => (
        <div className="flex flex-col justify-center items-center p-8 min-h-[60vh] text-center">
            <div className="flex justify-center items-center bg-destructive/10 mb-6 rounded-2xl w-16 h-16 text-destructive">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="mb-2 font-black text-foreground text-3xl uppercase tracking-tighter">
                Telemetry Failure
            </h2>
            <p className="mb-8 font-mono text-muted-foreground text-sm uppercase tracking-widest">
                ERR_INVALID_RESPONSE: EXPECTED ARRAY
            </p>
            <button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-xl font-bold text-primary-foreground uppercase tracking-widest transition-colors"
            >
                Re-initialize Connection
            </button>
        </div>
    ),
});

// --- RESPONSIVE LOADING STATE (SKELETON) --- //
function PendingComponent() {
    return (
        <div className="bg-background pb-24 w-full min-h-screen">
            {/* Command Center Header Skeleton */}
            <div className="bg-card/20 backdrop-blur-sm mb-12 px-4 sm:px-6 lg:px-8 pt-12 pb-8 border-border/30 border-b">
                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-6 mx-auto max-w-7xl container">
                    {/* Avatar Skeleton */}
                    <div className="bg-muted/50 shadow-xl rounded-full ring-4 ring-background w-20 sm:w-24 h-20 sm:h-24 animate-pulse" />
                    
                    {/* Text Details Skeleton */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-muted/50 rounded-lg w-48 sm:w-64 h-10 sm:h-12 animate-pulse" />
                            <div className="hidden sm:block bg-muted/50 rounded-full w-16 h-5 animate-pulse" />
                        </div>
                        <div className="bg-muted/50 rounded-md w-32 h-4 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Dashboard Content Grid Skeleton */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl container">
                {/* Section Header Skeleton */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-primary/30 rounded-full w-2 h-8 animate-pulse" />
                    <div className="bg-muted/50 rounded-md w-40 h-8 animate-pulse" />
                    <div className="bg-muted/50 ml-auto rounded-md w-24 h-4 animate-pulse" />
                </div>

                {/* Nodes Grid Skeleton */}
                <div className="flex flex-wrap justify-center sm:justify-start items-stretch gap-6 w-full">
                    
                    {/* Mocking 2 "Live Node" Card Skeletons */}
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col justify-between bg-card/30 shadow-sm p-6 border border-border/30 rounded-[2rem] w-full sm:w-64 h-[320px] animate-pulse">
                            <div className="flex justify-between items-center pb-4 border-border/30 border-b">
                                <div className="bg-muted/50 rounded w-20 h-3" />
                                <div className="bg-muted/50 rounded-full w-4 h-4" />
                            </div>
                            <div className="flex flex-col flex-1 justify-start space-y-4 py-4">
                                <div className="bg-muted/50 rounded w-16 h-2" />
                                <div className="bg-muted/50 rounded w-3/4 h-6" />
                                <div className="bg-muted/50 rounded w-full h-12" />
                            </div>
                            <div className="flex flex-col gap-3 pt-4 border-border/30 border-t">
                                <div className="bg-muted/50 rounded w-24 h-2" />
                                <div className="flex gap-2">
                                    <div className="bg-muted/50 rounded-xl w-full h-10" />
                                    <div className="bg-muted/50 rounded-xl w-10 h-10 shrink-0" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Station Button Skeleton */}
                    <div className="flex flex-col justify-center items-center gap-4 bg-muted/5 border-2 border-muted/50 border-dashed rounded-[2rem] w-full sm:w-64 h-[320px] animate-pulse">
                        <div className="bg-muted/50 rounded-full w-16 h-16" />
                        <div className="bg-muted/50 rounded w-32 h-6" />
                        <div className="bg-muted/50 mt-2 rounded w-24 h-3" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- ACTUAL ROUTE COMPONENT --- //
function RouteComponent() {
    const { session } = Route.useRouteContext();
    const { data } = useSuspenseQuery(getJamQuery);

    return (
        <div className="bg-background pb-24 w-full min-h-screen">
            
            {/* Command Center Header */}
            <div className="bg-card/50 backdrop-blur-sm mb-12 px-4 sm:px-6 lg:px-8 pt-12 pb-8 border-border/50 border-b">
                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-6 mx-auto max-w-7xl container">
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-linear-to-tr from-primary to-secondary opacity-50 group-hover:opacity-100 blur-xs rounded-full transition-opacity" />
                        <Avatar className="relative shadow-xl ring-4 ring-background w-20 sm:w-24 h-20 sm:h-24">
                            <AvatarImage src={session.user.image || ""} className="object-cover" />
                            <AvatarFallback className="bg-muted font-black text-muted-foreground text-2xl">
                                {session.user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="font-black text-foreground text-3xl sm:text-5xl italic uppercase leading-none tracking-tighter">
                                {session.user.name}
                            </h1>
                            <span className="hidden sm:inline-flex items-center bg-primary/10 px-2.5 py-0.5 border border-primary/20 rounded-full font-mono font-bold text-[10px] text-primary uppercase tracking-widest">
                                Operator
                            </span>
                        </div>
                        <p className="font-mono text-muted-foreground text-sm uppercase tracking-widest">
                            {session.user.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl container">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-primary rounded-full w-2 h-8" />
                    <h2 className="font-bold text-2xl uppercase tracking-tight">
                        Active Stations
                    </h2>
                    <span className="ml-auto font-mono text-muted-foreground text-xs uppercase tracking-widest">
                        {data?.length || 0} / 2 Nodes Deployed
                    </span>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start items-stretch gap-6 w-full">
                    {/* Render Existing Stations */}
                    {data && data.map((jam) => (
                        <JamCard key={jam.id} {...jam} />
                    ))}
                    
                    {/* Create New Station Button */}
                    <CreateJamBtn isAllowed={data.length < 2} />
                </div>
            </div>
        </div>
    );
}