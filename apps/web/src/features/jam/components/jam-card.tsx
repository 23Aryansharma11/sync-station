import { Clock, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";

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
	const router = useRouter()

	const deleteJam = async () => {
		const res = await api.jam({ id }).delete();
		if (res) {
			await router.invalidate()
		}
	}
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
			<CardContent className="absolute inset-0 flex flex-col justify-between items-center bg-black/50 backdrop-blur-xs p-2 w-full h-full text-white">
				<h4 className="font-bold text-2xl">{name}</h4>
				<p className="block w-full h-20 overflow-hidden text-base text-center line-clamp-3 text-balance leading-5">
					{description.slice(0, 40)}...
				</p>
				<div className="flex justify-center items-center gap-4 w-full">
					<span className="flex justify-center items-center gap-2">
						<Clock className="w-4" />
						<span className="flex justify-center items-center gap-2">
							{createdAt.toDateString()}
						</span>
					</span>
				</div>
				<div className="flex flex-col justify-center items-center gap-2 px-2 w-full">
					<Button
						variant={"default"}
						className="rounded w-full font-bold text-xl"
					>
						Join
					</Button>
					<Button
						onClick={deleteJam}
						variant={"destructive"}
						className="rounded w-full font-bold text-xl"
					>
						Delete
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
