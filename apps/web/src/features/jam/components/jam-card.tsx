import { toast } from "sonner";
import { Activity, Clock, Trash2, Radio, Terminal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getJamQuery } from "../query/get-jam-query";

interface JamCardProps {
    id: string;
    name: string;
    description?: string; // Added to fill the void of the image
    createdAt: Date | string; // Handled as string or Date
}

export function JamCard({ id, name, description, createdAt }: JamCardProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => api.jam({ id }).delete(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getJamQuery.queryKey,
                refetchType: "all",
            });
            toast.success("Station terminated successfully.");
        },
        onError: (error: any) => {
            if (error?.response?.data?.error) {
                toast.error(error.response.data.error);
            } else if (error.status === 403) {
                toast.error("Permission denied");
            } else if (error.status === 404) {
                toast.error("Station not found");
            } else {
                toast.error("Termination failed");
            }
        },
    });

    const deleteJam = () => deleteMutation.mutate();

    // Safely parse date for the mono display
    const dateObj = new Date(createdAt);
    const formattedDate = !isNaN(dateObj.getTime()) 
        ? dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : 'UNKNOWN DATE';

    return (
        <div className="group relative flex flex-col justify-between bg-card hover:bg-card/80 shadow-sm hover:shadow-primary/10 hover:shadow-xl p-6 border border-border/50 hover:border-primary/50 rounded-[2rem] w-full sm:w-64 h-[320px] overflow-hidden transition-all">
            
            {/* Top Bar: Status Indicator */}
            <div className="flex justify-between items-center pb-4 border-border/50 border-b">
                <div className="flex items-center gap-2 font-mono font-bold text-primary text-xs uppercase tracking-widest">
                    <span className="relative flex w-2 h-2">
                        <span className="inline-flex absolute bg-primary opacity-75 rounded-full w-full h-full animate-ping"></span>
                        <span className="inline-flex relative bg-primary rounded-full w-2 h-2"></span>
                    </span>
                    LIVE NODE
                </div>
                <Radio className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            {/* Middle: Station Details */}
            <div className="flex flex-col flex-1 justify-start py-4">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Terminal className="w-4 h-4" />
                    <span className="opacity-70 font-mono text-[10px] uppercase tracking-widest">
                        ID: {id.slice(0, 8)}
                    </span>
                </div>
                
                <h4 className="mb-3 font-black text-foreground text-2xl uppercase line-clamp-2 leading-none tracking-tighter">
                    {name}
                </h4>
                
                {description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {/* Bottom: Actions & Meta */}
            <div className="flex flex-col gap-3 pt-4 border-border/50 border-t">
                <div className="flex items-center gap-2 font-mono text-muted-foreground text-xs uppercase">
                    <Clock className="w-3 h-3" />
                    <span>Deployed: {formattedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Link to="/jam/join/$jamId" params={{ jamId: id }} className="flex-1">
                        <Button className="bg-primary hover:opacity-90 rounded-xl w-full font-bold text-primary-foreground active:scale-95 transition-all">
                            <Activity className="mr-2 w-4 h-4" />
                            CONNECT
                        </Button>
                    </Link>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={deleteJam}
                        disabled={deleteMutation.isPending}
                        className="hover:bg-destructive/10 border border-border hover:border-destructive/30 rounded-xl hover:text-destructive transition-all shrink-0"
                        title="Terminate Station"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}