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

export default function UserMenu() {
	const navigate = useNavigate();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="size-9 animate-pulse rounded-full" />;
	}

	if (!session) {
		return (
			<Link to="/login">
				<Button variant="outline">Sign In</Button>
			</Link>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Avatar className="h-9 w-9 cursor-pointer ring-2 ring-background transition-all hover:ring-accent/50" />
				}
			>
				<AvatarImage
					src={session.user.image || ""}
					alt={session.user.name || ""}
					className="object-cover"
				/>
				<AvatarFallback className="bg-linear-to-br from-primary/20 to-secondary/20 font-semibold text-primary-foreground text-xs">
					{session.user.name?.slice(0, 2).toUpperCase()}
				</AvatarFallback>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40 rounded-xl bg-card">
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="line-clamp-1 w-full truncate">
						{session.user.email}
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => {
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										navigate({
											to: "/",
										});
									},
								},
							});
						}}
					>
						Sign Out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
