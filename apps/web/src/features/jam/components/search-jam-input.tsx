import { useLocation } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SearchJamInput() {
	const location = useLocation();
	const show = location.href == "/dashboard";
	return show ? (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						className="p-2 rounded-full"
					/>
				}
			>
				<Search className="w-5 h-5" />
			</DialogTrigger>
			<DialogContent className="bg-card shadow-2xl backdrop-blur-sm p-6 sm:p-8 border-border/50 rounded w-[95vw] max-w-md sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="font-bold text-xl sm:text-2xl lg:text-3xl leading-tight">
						Search Jam Sessions
					</DialogTitle>
					<DialogDescription className="text-sm sm:text-base leading-relaxed">
						Sessions are location-bound. You can only join nearby jams.
					</DialogDescription>
				</DialogHeader>

				<form className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="host-email" className="font-semibold text-sm">
							Host Email
						</Label>
						<Input
							id="host-email"
							placeholder="johndoe@example.com"
							className="rounded h-12 font-semibold text-base"
							autoComplete="email"
						/>
					</div>
				</form>

				<DialogFooter className="sm:gap-2 pt-4">
					<DialogClose
						render={
							<Button
								type="button"
								variant="outline"
								className="flex-1 sm:flex-none rounded"
							/>
						}
					>
						Cancel
					</DialogClose>
					<Button type="submit" className="flex-1 sm:flex-none rounded">
						Search Jams
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : null;
}
