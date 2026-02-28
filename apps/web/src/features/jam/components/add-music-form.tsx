import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { motion } from "motion/react"
import { 
    Plus, 
    Loader2, 
    Youtube, 
    Terminal, 
    Radio, 
    AlertTriangle 
} from "lucide-react"

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
        .url("ERR_INVALID_FORMAT: Must be a valid URL")
        .refine((val) => val.includes("youtube.com") || val.includes("youtu.be"), {
            message: "ERR_UNSUPPORTED_PROTOCOL: Only YouTube endpoints accepted",
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                        size="lg" 
                        className="gap-2 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] border border-primary/20 rounded-full font-black text-lg italic uppercase tracking-tighter transition-shadow"
                    >
                        <Plus className="w-6 h-6" />
                        Add Track
                    </Button>
                </motion.div>
            </DrawerTrigger>

            <DrawerContent className="bg-card/90 backdrop-blur-xl border-border/50 border-t">
                <div className="relative mx-auto pb-6 w-full max-w-md">
                    
                    {/* Ambient Drawer Glow */}
                    <div className="top-0 left-1/2 absolute bg-primary/20 blur-[60px] rounded-full w-[300px] h-[100px] -translate-x-1/2 pointer-events-none" />

                    <DrawerHeader className="relative pt-8 text-left sm:text-center">
                        <div className="flex justify-center items-center bg-primary/10 shadow-inner mx-auto mb-4 border border-primary/20 rounded-2xl w-12 h-12 text-primary">
                            <Radio className="w-6 h-6 animate-pulse" />
                        </div>
                        <DrawerTitle className="mb-2 font-black text-foreground text-3xl sm:text-4xl italic uppercase leading-none tracking-tighter">
                            Transmission Uplink
                        </DrawerTitle>
                        <DrawerDescription className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
                            Provide target YouTube coordinates for broadcast.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 px-6 pb-0">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                form.handleSubmit()
                            }}
                            className="space-y-6"
                        >
                            <form.Field
                                name="link"
                                children={(field) => {
                                    // isTouched will only become true when the submit button is clicked because we removed onBlur
                                    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                    
                                    // Extract only the very first error to show them one-by-one
                                    const firstError = field.state.meta.errors[0];
                                    const errorMessage = typeof firstError === 'string' ? firstError : firstError?.message || "INVALID DATA";

                                    return (
                                        <div className="space-y-3">
                                            <Label 
                                                htmlFor={field.name} 
                                                className="flex items-center gap-2 font-mono font-bold text-[10px] text-primary uppercase tracking-widest"
                                            >
                                                <Terminal className="w-3 h-3" /> Target URL
                                            </Label>
                                            
                                            <div className="group relative">
                                                <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                                    <Youtube className={`w-5 h-5 transition-colors ${isInvalid ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                                                </div>
                                                <Input
                                                    id={field.name}
                                                    placeholder="https://youtu.be/..."
                                                    className={`pl-10 h-14 bg-background/50 text-sm md:text-base font-medium rounded-xl transition-all ${
                                                        isInvalid 
                                                            ? "border-destructive/50 focus-visible:ring-destructive/20" 
                                                            : "border-border/50 focus-visible:border-primary focus-visible:ring-primary/20"
                                                    }`}
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    autoComplete="off"
                                                />
                                            </div>

                                            {/* Technical Error Readout - Now shows one at a time, only on submit */}
                                            {isInvalid && (
                                                <div className="flex items-start gap-1.5 bg-destructive/10 mt-2 p-2 border border-destructive/20 rounded-lg font-mono text-[10px] text-destructive uppercase tracking-widest">
                                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                                    <span className="mt-0.5 leading-tight">
                                                        {errorMessage}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }}
                            />

                            <form.Subscribe
                                selector={(state) => [state.isSubmitting]}
                                children={([isSubmitting]) => (
                                    <Button
                                        type="submit"
                                        className="shadow-lg hover:shadow-primary/20 rounded-xl w-full h-14 font-black text-lg italic uppercase tracking-tighter active:scale-95 transition-all"
                                        // Removed `!canSubmit` so the user can click the button to reveal errors
                                        disabled={!isConnected || isSubmitting}
                                    >
                                        {!isConnected ? (
                                            "AWAITING CARRIER..."
                                        ) : isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" /> TRANSMITTING...
                                            </span>
                                        ) : (
                                            "INITIATE TRANSFER"
                                        )}
                                    </Button>
                                )}
                            />
                        </form>
                    </div>

                    <DrawerFooter className="px-6 pt-4 pb-6">
                        <DrawerClose asChild>
                            <Button 
                                variant="outline" 
                                className="hover:bg-destructive/10 hover:border-destructive/30 rounded-xl h-12 font-bold text-muted-foreground hover:text-destructive uppercase tracking-widest transition-colors"
                            >
                                ABORT
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}