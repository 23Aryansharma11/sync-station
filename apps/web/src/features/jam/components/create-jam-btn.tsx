import { z } from "zod";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Plus, Radio, MapPin, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
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
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";
import { getJamQuery } from "../query/get-jam-query";
import { useGeoLocation } from "@/hooks/use-geo-location";

const formSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(30, "Name must be at most 30 characters"),
	description: z
		.string()
		.min(3, "Description must be at least 3 characters")
		.max(100, "Description must be at most 100 characters"),
});

export function CreateJamBtn({ isAllowed }: { isAllowed: boolean }) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const locationData = useGeoLocation();

	const mutation = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!locationData.lat || !locationData.lon) {
				return toast.error("Location access required to anchor the station.");
			}
			const createJamData = {
				...values,
				bgImage: "", // Passed as empty string per requirement
				latitude: locationData.lat,
				longitude: locationData.lon,
				accuracy: 120,
			};

			const res = await api.jam.post(createJamData);
			form.reset();
			return res.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: getJamQuery.queryKey,
				refetchType: "all",
			});
			toast.success("Station successfully deployed in your vicinity.");
			setOpen(false);
		},
		onError: (err: any) =>
			toast.error(err.message || "Failed to initialize station. Try again."),
	});

	const form = useForm({
		validators: {
			onSubmit: formSchema,
			onChange: formSchema,
		},
		defaultValues: {
			name: "",
			description: "",
		},
		onSubmit: ({ value }) => mutation.mutate(value),
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<motion.button
				whileHover={isAllowed ? { scale: 0.98 } : {}}
				whileTap={isAllowed ? { scale: 0.95 } : {}}
				disabled={!isAllowed}
				className={`relative flex flex-col justify-center items-center gap-4 rounded-[2rem] w-full sm:w-64 h-[320px] transition-all border-2 border-dashed ${isAllowed
						? "border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary cursor-pointer text-primary"
						: "border-muted bg-muted/10 text-muted-foreground cursor-not-allowed opacity-50"
					}`}
			>
				<div className={`p-4 rounded-full ${isAllowed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
					<Plus className="w-8 h-8" />
				</div>
				<div className="flex flex-col items-center px-4 text-center">
					<span className="font-black text-foreground text-2xl italic uppercase tracking-tighter">
						Deploy Station
					</span>
					{!isAllowed ? (
						<span className="bg-destructive/10 mt-2 px-2 py-1 rounded font-mono font-bold text-destructive text-xs">
							LIMIT: 2 NODES (FREE TIER)
						</span>
					) : (
						<span className="flex items-center gap-1 mt-2 font-mono font-bold text-muted-foreground text-xs uppercase tracking-widest">
							<MapPin className="w-3 h-3" /> Anchored to location
						</span>
					)}
				</div>
			</motion.button>}>

			</DialogTrigger>

			<DialogContent className="bg-card/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8 border border-border/50 rounded-[2rem] w-[95vw] max-w-md sm:max-w-lg">
				<DialogHeader className="mb-4">
					<div className="flex justify-center items-center bg-primary shadow-lg shadow-primary/20 mb-4 rounded-2xl w-12 h-12 text-primary-foreground">
						<Radio className="w-6 h-6 animate-pulse" />
					</div>
					<DialogTitle className="font-black text-3xl sm:text-4xl italic uppercase leading-tight tracking-tighter">
						Initialize Jam
					</DialogTitle>
					<DialogDescription className="flex items-center gap-2 mt-2 font-mono text-muted-foreground text-xs uppercase tracking-widest">
						<span className="flex bg-primary rounded-full w-2 h-2 animate-ping" />
						Awaiting coordinate lock...
					</DialogDescription>
				</DialogHeader>

				<form
					id="create-jam-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-6"
				>
					<FieldGroup className="space-y-4">
						<form.Field
							name="name"
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} className="font-bold text-sm uppercase tracking-tight">
											Station Designation
										</FieldLabel>
										<Input
											className="bg-background/50 border-border/50 focus:border-primary rounded-xl focus:ring-primary/20 h-12 text-sm md:text-base transition-all"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="e.g., Downtown Cafe Vibes"
											autoComplete="off"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>

						<form.Field
							name="description"
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} className="font-bold text-sm uppercase tracking-tight">
											Vibe Parameters (Description)
										</FieldLabel>
										<InputGroup className="bg-background/50 border-border/50 focus-within:border-primary rounded-xl focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden transition-all">
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="What's the mood for this session?"
												rows={4}
												className="bg-transparent border-none focus:ring-0 min-h-[100px] text-sm md:text-base resize-none"
												aria-invalid={isInvalid}
											/>
											<InputGroupAddon align="block-end" className="bg-transparent py-2 border-border/50 border-t">
												<InputGroupText className="justify-end pr-3 w-full font-mono tabular-nums text-muted-foreground text-xs">
													{field.state.value.length}/100
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
					</FieldGroup>

					<DialogFooter className="gap-3 sm:gap-4 pt-6 border-border/50 border-t">
						<DialogClose render={<Button
							type="button"
							variant="outline"
							className="sm:flex-none md:flex-1 hover:bg-destructive/10 hover:border-destructive/30 rounded-xl h-12 font-bold hover:text-destructive transition-colors"
						>
							ABORT
						</Button>}>

						</DialogClose>
						<Button
							type="submit"
							className="sm:flex-none md:flex-1 shadow-lg shadow-primary/20 hover:shadow-primary/40 rounded-xl h-12 font-bold text-base active:scale-95 transition-all"
							disabled={mutation.isPending}
						>
							{mutation.isPending ? (
								<span className="flex items-center gap-2">
									<Loader2 className="w-5 h-5 animate-spin" /> ESTABLISHING LINK...
								</span>
							) : (
								"LAUNCH STATION"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}