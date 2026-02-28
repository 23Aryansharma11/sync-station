import { useState, useEffect } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { 
    Radio, 
    MapPin, 
    MapPinOff, 
    Fingerprint, 
    Loader2, 
    ShieldAlert, 
    ArrowRight, 
    LockKeyholeOpen,
    Ban 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getJamTokenQuery } from "@/features/jam/query/get-jam-token-query";
import { useGeoLocation } from "@/hooks/use-geo-location";
import { api } from "@/lib/api";
import { requireAuth } from "@/lib/auth-loader";
import { isWithinDistanceKm } from "@/lib/utils";

export const Route = createFileRoute("/(protected)/jam/join/$jamId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    await requireAuth();
    const res = await api.jam({ id: params.jamId }).get();
    if (!res.data) throw redirect({ to: "/dashboard", replace: true });
    return res.data;
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const locData = useGeoLocation();
  const { jamId } = Route.useParams();
  const jamDetails = Route.useLoaderData();

  // --- PERSISTENT RATE LIMITING STATE --- //
  const lockKey = `sync_station_lock_${jamId}`;

  // 1. Initialize cooldown by checking LocalStorage first
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(lockKey);
        if (stored) {
            const expiry = parseInt(stored, 10);
            if (expiry > Date.now()) return expiry;
            localStorage.removeItem(lockKey);
        }
    }
    return null;
  });

  const [attempts, setAttempts] = useState(() => (cooldownUntil ? 3 : 0));
  const [timeLeft, setTimeLeft] = useState(0);

  // --- Cooldown Timer Effect ---
  useEffect(() => {
    if (!cooldownUntil) return;

    setTimeLeft(Math.ceil((cooldownUntil - Date.now()) / 1000));

    const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil((cooldownUntil - now) / 1000);
        
        if (remaining <= 0) {
            setCooldownUntil(null);
            setTimeLeft(0);
            setAttempts(0); 
            localStorage.removeItem(lockKey); 
        } else {
            setTimeLeft(remaining);
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownUntil, lockKey]);

  if (!jamDetails) return null;

  const hasLocation = !!locData.lat && !!locData.lon && !!jamDetails.latitude && !!jamDetails?.longitude;
  
  const isNearby = hasLocation && isWithinDistanceKm(
      jamDetails.latitude,
      jamDetails.longitude,
      locData.lat!,
      locData.lon!,
      1.0 
  );

  const { data: token, refetch, isFetching, isError, error } = useQuery(
    getJamTokenQuery(jamId, locData.lat!, locData.lon!)
  );

  const errorMessage = error instanceof Error ? error.message : String(error || "");
  
  // FIX APPLIED HERE: It now checks if the query failed OR if the local timer is active
  const isBlocked = (isError && errorMessage.toLowerCase().includes("blocked")) || cooldownUntil !== null;

  // --- Handle Override Attempt ---
  const handleRetryOverride = () => {
    if (cooldownUntil && cooldownUntil > Date.now()) return; 
    if (attempts >= 3) return; 

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (nextAttempts >= 3) {
        const expiryTime = Date.now() + 60 * 1000;
        setCooldownUntil(expiryTime);
        setTimeLeft(60);
        localStorage.setItem(lockKey, expiryTime.toString());
    }
    
    refetch(); 
  };

  // --- Dynamic UI State Configuration ---
  let statusConfig = {
      icon: <RadarSpinner />,
      title: "AWAITING TELEMETRY",
      description: "Acquiring GPS coordinates to verify station proximity.",
      color: "text-primary",
      bg: "bg-primary/10",
      borderColor: "border-primary/30"
  };

  if (isBlocked) {
      statusConfig = {
          icon: <Ban className="w-12 h-12 text-destructive animate-pulse" />,
          title: "UPLINK SEVERED",
          description: "Access denied. You have been blocked from this station.",
          color: "text-destructive",
          bg: "bg-destructive/10",
          borderColor: "border-destructive/30"
      };
  } else if (!hasLocation) {
      statusConfig = {
          icon: <MapPin className="w-12 h-12 text-secondary animate-bounce" />,
          title: "LOCATION REQUIRED",
          description: "Please allow location access in your browser to verify proximity.",
          color: "text-secondary",
          bg: "bg-secondary/10",
          borderColor: "border-secondary/30"
      };
  } else if (!isNearby) {
      statusConfig = {
          icon: <MapPinOff className="w-12 h-12 text-destructive" />,
          title: "OUT OF BOUNDS",
          description: "Signal lost. You must be within 1.0KM of the station epicenter to join.",
          color: "text-destructive",
          bg: "bg-destructive/10",
          borderColor: "border-destructive/30"
      };
  } else if (isNearby) {
      statusConfig = {
          icon: <Fingerprint className="w-12 h-12 text-green-500" />,
          title: "PROXIMITY VERIFIED",
          description: "You are within the active sync zone. Ready for secure handshake.",
          color: "text-green-500",
          bg: "bg-green-500/10",
          borderColor: "border-green-500/30"
      };
  }

  return (
    <div className={`relative flex justify-center items-center bg-background selection:bg-primary/30 p-4 min-h-screen overflow-hidden transition-colors duration-700 ${isBlocked ? 'bg-destructive/5' : ''}`}>
        
        <div className={`top-1/2 left-1/2 absolute blur-[100px] rounded-full w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-700 ${isBlocked ? 'bg-destructive/10' : 'bg-primary/5'}`} />

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`z-10 relative bg-card/80 shadow-2xl backdrop-blur-xl border rounded-[2rem] w-full max-w-md overflow-hidden transition-colors duration-700 ${isBlocked ? 'border-destructive/50' : 'border-border/50'}`}
        >
            <div className={`flex items-center gap-4 p-6 border-b transition-colors duration-700 ${isBlocked ? 'bg-destructive/10 border-destructive/20' : 'bg-primary/5 border-primary/10'}`}>
                <div className={`flex justify-center items-center shadow-inner rounded-2xl w-12 h-12 transition-colors duration-700 ${isBlocked ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                    {isBlocked ? <ShieldAlert className="w-6 h-6" /> : <Radio className="w-6 h-6 animate-pulse" />}
                </div>
                <div>
                    <h2 className={`font-black text-2xl italic uppercase leading-none tracking-tighter transition-colors duration-700 ${isBlocked ? 'text-destructive' : 'text-foreground'}`}>
                        {isBlocked ? "Lockdown Protocol" : "Connection Gateway"}
                    </h2>
                    <p className="mt-1 font-mono text-muted-foreground text-xs uppercase tracking-widest">
                        Target Node: <span className={isBlocked ? "text-destructive font-bold" : "text-primary"}>{jamId.slice(0,8)}</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center p-8 text-center">
                <div className={`relative flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed ${statusConfig.borderColor} ${statusConfig.bg} mb-6 transition-colors duration-500`}>
                    <div className={`absolute inset-2 rounded-full border border-current opacity-20 ${statusConfig.color}`} />
                    <div className={statusConfig.color}>
                        {statusConfig.icon}
                    </div>
                </div>

                <h3 className={`font-black text-2xl uppercase tracking-tighter mb-2 ${statusConfig.color}`}>
                    {statusConfig.title}
                </h3>
                <p className="max-w-[280px] font-medium text-muted-foreground text-sm leading-relaxed">
                    {statusConfig.description}
                </p>

                {hasLocation && (
                    <div className={`flex gap-4 bg-background mt-6 px-4 py-2 border rounded-lg font-mono text-[10px] uppercase tracking-widest transition-colors duration-700 ${isBlocked ? 'border-destructive/30 text-destructive/70' : 'border-border/50 text-muted-foreground'}`}>
                        <span>LAT: {locData.lat?.toFixed(4)}</span>
                        <span>LON: {locData.lon?.toFixed(4)}</span>
                    </div>
                )}
            </div>

            <div className={`p-6 border-t transition-colors duration-700 ${isBlocked ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/10 border-border/50'}`}>
                
                {isBlocked && (
                    <>
                        {cooldownUntil && timeLeft > 0 ? (
                            <Button disabled className="bg-destructive/20 opacity-100 border border-destructive/50 rounded-xl w-full h-14 font-black text-destructive text-lg italic uppercase tracking-tighter">
                                <Ban className="mr-2 w-5 h-5" /> SYSTEM LOCKED ({timeLeft}S)
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleRetryOverride}
                                disabled={isFetching}
                                className="bg-destructive hover:bg-destructive/90 shadow-[0_0_20px_rgba(220,38,38,0.4)] rounded-xl w-full h-14 font-black text-destructive-foreground text-lg italic uppercase tracking-tighter active:scale-95 transition-all"
                            >
                                {isFetching ? (
                                    <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> VERIFYING...</>
                                ) : (
                                    <><ShieldAlert className="mr-2 w-5 h-5" /> REQUEST OVERRIDE ({3 - attempts})</>
                                )}
                            </Button>
                        )}
                    </>
                )}

                {!isBlocked && (
                    <>
                        {!hasLocation && (
                            <div className="flex justify-center items-center gap-2 p-3 font-mono text-muted-foreground text-xs uppercase tracking-widest">
                                <Loader2 className="w-4 h-4 animate-spin" /> Waiting for browser permission...
                            </div>
                        )}

                        {hasLocation && !isNearby && (
                            <Button disabled className="bg-muted rounded-xl w-full h-14 font-bold text-muted-foreground uppercase tracking-widest">
                                <ShieldAlert className="mr-2 w-5 h-5" /> Connection Blocked
                            </Button>
                        )}

                        {hasLocation && isNearby && !token && (
                            <Button 
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="bg-primary hover:shadow-lg hover:shadow-primary/20 rounded-xl w-full h-14 font-bold text-primary-foreground uppercase tracking-widest active:scale-95 transition-all"
                            >
                                {isFetching ? (
                                    <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> NEGOTIATING...</>
                                ) : (
                                    <><LockKeyholeOpen className="mr-2 w-5 h-5" /> REQUEST HANDSHAKE</>
                                )}
                            </Button>
                        )}

                        {hasLocation && isNearby && token && (
                            <Button 
                                onClick={() => {
                                    document.cookie = `jamJoinToken=${token}; path=/; max-age=3600; Secure; SameSite=Strict`;
                                    navigate({ to: "/jam/$jamId", params: { jamId } });
                                }}
                                className="bg-foreground hover:bg-foreground/90 rounded-xl w-full h-14 font-black text-background text-lg italic uppercase tracking-tighter active:scale-95 transition-all"
                            >
                                ENTER STATION <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    </div>
  );
}

function RadarSpinner() {
    return (
        <div className="relative flex justify-center items-center w-12 h-12 text-primary">
            <Radio className="z-10 absolute w-6 h-6" />
            <motion.div 
                animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute border-2 border-primary rounded-full w-full h-full"
            />
            <motion.div 
                animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className="absolute border-2 border-primary rounded-full w-full h-full"
            />
        </div>
    )
}