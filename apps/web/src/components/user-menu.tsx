import { Link, useNavigate } from "@tanstack/react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { LogOut, User } from "lucide-react";

export default function UserMenu() {
    const navigate = useNavigate();
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <Skeleton className="border-2 border-muted rounded-full w-9 h-9 animate-pulse" />;
    }

    if (!session) {
        return (
            <Link to="/login">
                <Button size="sm" className="bg-primary hover:opacity-90 font-bold text-primary-foreground">
                    SIGN IN
                </Button>
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={
                <div className="group relative cursor-pointer">
                    <div className="absolute -inset-0.5 bg-linear-to-tr from-primary to-secondary opacity-0 group-hover:opacity-100 blur-[2px] rounded-full transition duration-300" />
                    <Avatar className="relative shadow-sm border-2 border-background w-9 h-9">
                        <AvatarImage
                            src={session.user.image || ""}
                            alt={session.user.name || ""}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-muted font-bold text-xs">
                            {session.user.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            } />

            <DropdownMenuContent align="end" className="bg-card shadow-2xl mt-2 p-2 border-border rounded-2xl w-56">
                
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-3 py-3">
                        <div className="flex flex-col space-y-1">
                            <p className="font-bold text-sm leading-none">{session.user.name}</p>
                            <p className="text-muted-foreground text-xs truncate italic leading-none">
                                {session.user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-border/50" />

                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem 
                        className="gap-2 focus:bg-primary/10 rounded-lg focus:text-primary cursor-pointer"
                        render={<Link to="/dashboard" />}
                    >
                        <User className="w-4 h-4" /> My Profile
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-border/50" />

                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem
                        className="gap-2 focus:bg-destructive/10 rounded-lg font-bold text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => {
                            authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => navigate({ to: "/" }),
                                },
                            });
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                
            </DropdownMenuContent>
        </DropdownMenu>
    );
}