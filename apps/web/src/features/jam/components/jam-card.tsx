import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface JamCardProps {
	id: string;
	bgImage: string;
	name: string;
	description: string;
	createdAt: Date;
}

export function JamCard({
	id,
	bgImage,
	name,
	description,
	createdAt,
}: JamCardProps) {
	return (
		<Card
			className={cn(
				"relative bg-cover bg-no-repeat bg-center border-2 rounded-xl size-64",
			)}
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundPosition: "center",
				backgroundSize: "cover",
			}}
		>
			<CardContent className="absolute inset-0 flex flex-col justify-evenly items-center bg-black/50 backdrop-blur-xs p-2 w-full h-full text-white">
				<h4 className="font-bold text-2xl">{name}</h4>
				<p className="text-base text-center truncate line-clamp-3 text-balance">
					{description}
				</p>
				<div className="flex justify-center items-center gap-4 w-full">
					<span className="flex justify-center items-center gap-2">
						<Clock className="w-4" />
						<span className="flex justify-center items-center gap-2">
							{createdAt.toDateString()}
						</span>
					</span>
				</div>
				<Button
					variant={"default"}
					className="rounded w-full font-bold text-xl"
				>
					Join
				</Button>
			</CardContent>
		</Card>
	);
}
