import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import z from "zod";
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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

const formSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be atleast 3 characters")
		.max(20, "Name must be atmost 20 characters"),
	description: z
		.string()
		.min(3, "Description must be atleast 3 characters")
		.max(100, "Description must be atmost 100 characters"),
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
		onSubmit: async ({ value }) => {
			const res = await api.jam.post({ ...value });
			if (res.status == 200) {
				alert("Jam created")
			}
			setOpen(false)
			router.invalidate()
		},
	});
	const [open, setOpen] = useState(false)
	const router = useRouter()
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						variant={"ghost"}
						className="flex justify-center items-center disabled:opacity-25 border-2 border-foreground rounded-xl size-64 text-2xl cursor-not-allowed disabled:cursor-not-allowed"
						disabled={!isAllowed}
					/>
				}
			>
				<Plus className="w-8" />
				<div className="flex flex-col">
					<span>Create New Room</span>
					<span className="text-sm">{!isAllowed && "Max 2 rooms allowed for free tier"}</span>
				</div>
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

				<form
					id="create-jam-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<FieldGroup>
						<form.Field
							name="name"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="">
										<FieldLabel htmlFor={field.name} className="">
											Name
										</FieldLabel>
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
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>

						{/* description */}
						<form.Field
							name="description"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

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
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>

					{/* Image */}
					<form.Field
						name="bgImage"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<FieldSet data-invalid={isInvalid}>
									<FieldLegend>
										<FieldTitle>Background Image</FieldTitle>
										<FieldDescription>
											Choose a theme for your jam session
										</FieldDescription>
									</FieldLegend>
									<RadioGroup
										name={field.name}
										value={field.state.value}
										onValueChange={(value) =>
											field.handleChange(value as string)
										}
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
						<Button type="submit" className="sm:flex-none md:flex-1 rounded">
							Create Jams
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
