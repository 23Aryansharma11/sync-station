import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Plus, Music, Loader2 } from "lucide-react"

import { useJamSocket } from "@/features/jam/hooks/use-jam-socket"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

const musicSchema = z.object({
    link: z
        .string()
        .min(1, "Link is required")
        .url("Please enter a valid URL")
        .refine((val) => val.includes("youtube.com") || val.includes("youtu.be"), {
            message: "Only YouTube links are supported for now",
        }),
})

type MusicFormValues = z.infer<typeof musicSchema>

interface AddMusicDrawerProps {
    jamId: string
}

export function AddMusicDrawer({ jamId }: AddMusicDrawerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const { sendMessage, isConnected } = useJamSocket(jamId)

    const form = useForm({
        defaultValues: {
            link: "",
        } as MusicFormValues,
        validators: {
            onChange: musicSchema,
            onSubmit: musicSchema
        },
        onSubmit: async ({ value }) => {
            if (!isConnected) return
            sendMessage({
                type: "add-music",
                data: {
                    ytLink: value.link,
                },
            })
            form.reset()
            setIsOpen(false)
        },
    })

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button size="lg" className="gap-2 shadow-lg rounded-full">
                    <Plus className="w-5 h-5" />
                    Add Song
                </Button>
            </DrawerTrigger>

            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Add to Queue</DrawerTitle>
                        <DrawerDescription>
                            Paste a YouTube link to add it to the jam session.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 pb-0">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                form.handleSubmit()
                            }}
                            className="space-y-4"
                        >
                            <form.Field
                                name="link"
                                children={(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor={field.name} className="sr-only">
                                            YouTube Link
                                        </Label>
                                        <div className="relative">
                                            <Music className="top-3 left-3 absolute w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id={field.name}
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="pl-9"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            />

                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                                children={([canSubmit, isSubmitting]) => (
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={!canSubmit || !isConnected}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                        ) : (
                                            "Add to Queue"
                                        )}
                                    </Button>
                                )}
                            />
                        </form>
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}