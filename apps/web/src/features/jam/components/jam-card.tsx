import { toast } from "sonner";
import { Clock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { api } from "@/lib/api";
import { getJamQuery } from "../query/get-jam-query";
import { Link } from "@tanstack/react-router";
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
	createdAt,
}: JamCardProps) {

	const queryClient = useQueryClient()

	const deleteMutation = useMutation({
		mutationFn: () => api.jam({ id }).delete(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getJamQuery.queryKey, refetchType: "all" })
			toast.success('Jam deleted')
		},
		onError: (error: any) => {
			if (error?.response?.data?.error) {
				toast.error(error.response.data.error)
			} else if (error.status === 403) {
				toast.error('Permission denied')
			} else if (error.status === 404) {
				toast.error('Jam not found')
			} else {
				toast.error('Delete failed')
			}
		}
	})
	const deleteJam = () => deleteMutation.mutate();
	return (
		<Card
			className="bg-card shadow-sm hover:shadow-xl border border-border rounded-2xl w-64 h-80 overflow-hidden"
		>
			<div className="border-b w-full h-36">
				<img
					src={bgImage}
					alt={name}
					className="w-full h-full object-center object-cover"
				/>
			</div>
			<CardContent className="flex flex-col justify-between p-4 h-[calc(100%-9rem)]">
				{/* Top */}
				<div className="space-y-1">
					<h4 className="font-bold text-lg capitalize line-clamp-1 leading-tight">
						{name}
					</h4>

					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<Clock className="w-4 h-4" />
						<span>{createdAt.toDateString()}</span>
					</div>
				</div>

				<div className="space-y-2">
					<Link to="/jam/join/$jamId" params={{ jamId: id }}>
						<Button className="rounded-lg w-full font-semibold">
							Join
						</Button>
					</Link>

					<button
						onClick={deleteJam}
						disabled={deleteMutation.isPending}
						className="disabled:opacity-50 w-full font-medium text-destructive text-xs hover:underline transition"
					>
						{deleteMutation.isPending ? "Deleting…" : "Delete"}
					</button>
				</div>
			</CardContent>
		</Card>


	);
}
