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
import { api } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JamListItem } from "./jam-list-item";

export type TDebounceRes = {
	name: string;
	bgImage: string;
	id: string;
	author: {
		name: string;
		email: string
	};
}

export function SearchJamInput() {
	const location = useLocation();
	const show = location.href == "/dashboard";
	const [email, setEmail] = useState("");
	const debouncedEmail = useDebounce(email, 800);
	const [response, setResponse] = useState<TDebounceRes[]>([])


	useEffect(() => {
		if (!debouncedEmail) return;
		const fetchJam = async () => {
			const res = await api.jam.search.get({
				query: {
					email: debouncedEmail
				}
			})
			if (res.error) {
				toast.error("Unable to search")
				return
			}
			const data = res.data;
			setResponse(data)
		}
		fetchJam()
	}, [debouncedEmail])

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
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="johndoe@example.com"
							className="rounded h-12 font-semibold"
							autoComplete="email"
						/>
					</div>
				</form>

				<div className="h-20 min-h-28 overflow-x-hidden overflow-y-auto no-scrollbar">
					{
						response.length == 0 ?
							(<div className="flex justify-center items-center w-full h-full">
								<h3 className="text-sm md:text-base">
									{debouncedEmail.length === 0 ? "Start typing to search" : "No such session found"}
								</h3>
							</div>) :
							((<div className="space-y-2">
								{
									response.map((data, index) => (
										<JamListItem {...data} key={data.id} />
									))
								}
							</div>))
					}
				</div>

				<DialogFooter className="sm:gap-2 pt-4">
					<DialogClose
						render={
							<Button
								type="button"
								variant="outline"
								className="sm:flex-none rounded"
							/>
						}
					>
						Cancel
					</DialogClose>
					<Button type="submit" className="sm:flex-none rounded">
						Search Jams
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : null;
}
