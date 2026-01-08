import z from "zod";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Plus, MapPin, RefreshCw } from "lucide-react";
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
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { api } from "@/lib/api";
import { getJamQuery } from "../query/get-jam-query";
import { useCurrentLocation } from "@/hooks/use-current-location";

const formSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(20, "Name must be at most 20 characters"),
	description: z
		.string()
		.min(3, "Description must be at least 3 characters")
		.max(100, "Description must be at most 100 characters"),
	bgImage: z.string(),
});

const bgImageOptions = [
	{
		src: "https://plus.unsplash.com/premium_photo-1683121126477-17ef068309bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGFydHl8ZW58MHx8MHx8fDA%3D",
		label: "Party",
	},
	{
		src: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29ya3xlbnwwfHwwfHx8MA%3D%3D",
		label: "Work",
	},
	{
		src: "https://plus.unsplash.com/premium_photo-1661301057249-bd008eebd06a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3ltfGVufDB8fDB8fHww",
		label: "Gym",
	},
	{
		src: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFuZ291dHxlbnwwfHwwfHx8MA%3D%3D",
		label: "Hangout",
	},
];

export function CreateJamBtn({ isAllowed }: { isAllowed: boolean }) {
	const queryClient = useQueryClient();

	const {
		location,
		loading,
		error,
		supported,
		permission,
		requestLocation,
	} = useCurrentLocation();

	const [open, setOpen] = useState(false);

	const mutation = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			if (!location) {
				toast.error("Location is required");
				return;
			}

			const createJamData = {
				...values,
				latitude: location.latitude,
				longitude: location.longitude,
				accuracy: location.accuracy,
			};

			const res = await api.jam.post(createJamData);
			form.reset();
			return res.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: getJamQuery.queryKey,
				refetchType: "all"
			});
			toast.success("Jam created");
			setOpen(false);
		},
		onError: (err: any) =>
			toast.error(err.message || "Something went wrong, try again later"),
	});

	const form = useForm({
		validators: {
			onSubmit: formSchema,
			onChange: formSchema,
		},
		defaultValues: {
			name: "",
			description: "",
			bgImage: "",
		},
		onSubmit: ({ value }) => mutation.mutate(value),
	});

	// Auto-request location when dialog opens
	useEffect(() => {
		if (open && supported && !location && !loading) {
			requestLocation();
		}
	}, [open, supported, location, loading, requestLocation]);

	const hasLocation = !!location;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<motion.div whileHover={{ scale: 0.98 }}>
						<Button
							variant="ghost"
							className="flex justify-center items-center disabled:opacity-25 border-2 border-foreground rounded-xl w-64 h-80 text-2xl cursor-not-allowed disabled:cursor-not-allowed"
							disabled={!isAllowed}
						>
							<Plus className="w-8" />
							<div className="flex flex-col">
								<span>Create New Room</span>
								<span className="text-sm">
									{!isAllowed && "Max 2 rooms allowed for free tier"}
								</span>
							</div>
						</Button>
					</motion.div>
				}
			>
			</DialogTrigger>

			<DialogContent className="bg-card shadow-2xl backdrop-blur-sm p-6 sm:p-8 border-border/50 rounded w-[95vw] max-w-md sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="font-bold text-xl sm:text-2xl lg:text-3xl leading-tight">
						Create Jam Sessions
					</DialogTitle>
					<DialogDescription className="text-sm sm:text-base leading-relaxed">
						Sessions are location-bound. Only people near you can join.
					</DialogDescription>
				</DialogHeader>

				{!supported && (
					<div className="py-8 text-muted-foreground text-center">
						<p>Your browser does not support location services.</p>
					</div>
				)}

				{supported && !loading && error && (
					<div className="space-y-2 py-8 text-center">
						<p className="font-medium text-destructive text-sm">{error}</p>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => requestLocation()}
							className="gap-2"
						>
							<RefreshCw className="w-4 h-4 animate-spin" />
							Retry Location
						</Button>
					</div>
				)}

				{supported && loading && (
					<div className="py-8 text-center">
						<RefreshCw className="mx-auto mb-2 w-8 h-8 text-muted-foreground animate-spin" />
						<p className="text-muted-foreground text-sm">Getting your location...</p>
					</div>
				)}

				{supported &&
					!loading &&
					!error &&
					!hasLocation &&
					permission === "denied" && (
						<div className="space-y-2 py-8 text-muted-foreground text-center">
							<p>Location access is required to create sessions.</p>
							<p className="text-xs">Please enable location in your browser settings.</p>
						</div>
					)}

				{hasLocation && (
					<form
						id="create-jam-form"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<FieldSet>
							<FieldLegend>
								<FieldTitle className="flex items-center gap-2">
									<MapPin className="w-4 h-4" />
									Your Location
								</FieldTitle>
								<FieldDescription>
									{location?.accuracy < 50
										? "High accuracy"
										: "Moderate accuracy"
									}
								</FieldDescription>
							</FieldLegend>
							<div className="space-y-1 bg-muted/50 p-3 rounded-lg text-xs">
								<div className="flex justify-between">
									<span>Latitude:</span>
									<span className="font-mono">
										{location!.latitude.toFixed(6)}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Longitude:</span>
									<span className="font-mono">
										{location!.longitude.toFixed(6)}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Accuracy:</span>
									<span>{location!.accuracy.toFixed(0)}m</span>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="mt-2 py-1 w-full h-auto text-xs"
									onClick={() => requestLocation()}
								>
									<RefreshCw className="mr-1 w-3 h-3" />
									Update Location
								</Button>
							</div>
						</FieldSet>

						<FieldGroup>
							<form.Field
								name="name"
								children={(field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Name</FieldLabel>
											<Input
												className="text-sm md:text-base"
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="New year party"
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
											<FieldLabel htmlFor={field.name}>Description</FieldLabel>
											<InputGroup>
												<InputGroupTextarea
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="New year party at my home"
													rows={6}
													className="min-h-24 text-sm md:text-base resize-none"
													aria-invalid={isInvalid}
												/>
												<InputGroupAddon align="block-end">
													<InputGroupText className="tabular-nums">
														{field.state.value.length}/100 characters
													</InputGroupText>
												</InputGroupAddon>
											</InputGroup>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							/>
						</FieldGroup>
						<form.Field
							name="bgImage"
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<FieldSet data-invalid={isInvalid}>
										<FieldLegend>
											<FieldTitle>Background Image</FieldTitle>
											<FieldDescription>Choose a theme for your jam session</FieldDescription>
										</FieldLegend>
										<RadioGroup
											name={field.name}
											value={field.state.value}
											onValueChange={(value) => field.handleChange(value as string)}
											className="gap-3 grid grid-cols-2 md:grid-cols-4 pt-2"
										>
											{bgImageOptions.map((option) => (
												<Field key={option.src} className="group">
													<FieldLabel
														htmlFor={`bg-${option.label}`}
														className="gap-2 grid data-[state=checked]:bg-primary/10 hover:bg-accent/30 p-1 border-2 border-border data-[state=checked]:border-primary hover:border-border/50 rounded-xl data-[state=checked]:ring-2 data-[state=checked]:ring-ring/20 transition-all cursor-pointer"
													>
														<FieldContent>
															<img
																src={option.src}
																alt={option.label}
																className="rounded-lg w-full size-20 md:size-24 object-center object-cover"
															/>
														</FieldContent>
														<RadioGroupItem
															id={`bg-${option.label}`}
															value={option.src}
															className="sr-only hidden"
														/>
													</FieldLabel>
												</Field>
											))}
										</RadioGroup>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</FieldSet>
								);
							}}
						/>

						<DialogFooter className="sm:gap-2 pt-4">
							<DialogClose
								render={
									<Button
										type="button"
										variant="outline"
										className="sm:flex-none md:flex-1 rounded"
									/>
								}
							>
								Cancel
							</DialogClose>
							<Button
								type="submit"
								className="sm:flex-none md:flex-1 rounded"
								disabled={mutation.isPending}
							>
								{mutation.isPending ? "Creating..." : "Create Jam"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
