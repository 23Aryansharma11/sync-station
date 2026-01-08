import { createFileRoute } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateJamBtn } from "@/features/jam/components/create-jam-btn";
import { JamCard } from "@/features/jam/components/jam-card";
import { requireAuth } from "@/lib/auth-loader";
import { getJamQuery } from "@/features/jam/query/get-jam-query";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/(protected)/dashboard")({
	component: RouteComponent,
	beforeLoad: requireAuth,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();
	const { data } = useSuspenseQuery(getJamQuery);

	return (
		<div className="flex flex-col items-start bg-background/50 p-4 sm:p-6 lg:p-8 w-full min-h-screen overflow-x-hidden">
			{/* Header */}
			<div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-6 mb-8">
				<div className="flex flex-1 items-start sm:items-center gap-4 min-w-0">
					<Avatar className="ring-2 ring-background/80 w-14 sm:w-12 h-14 sm:h-12 shrink-0">
						<AvatarImage src={session.user.image || ""} />
						<AvatarFallback className="font-semibold text-sm">
							{session.user.name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="space-y-1 min-w-0">
						<p className="font-bold text-foreground text-2xl sm:text-3xl truncate">
							{session.user.name}
						</p>
						<p className="max-w-xs text-muted-foreground text-lg sm:text-xl truncate">
							{session.user.email}
						</p>
					</div>
				</div>
			</div>
			<div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 w-full">
				{data && data.map((d) => (
					<JamCard key={d.id} {...d} />
				))}
				<CreateJamBtn isAllowed={data.length < 2} />
			</div>
		</div>
	);
}
