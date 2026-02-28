import { useState } from "react";
import QRCode from "react-qr-code";
import { motion } from "motion/react";
import {
    Copy,
    Check,
    Share2,
    RadioTower,
    ScanLine,
    ShieldAlert
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ShareJamBtn = () => {
    const [copied, setCopied] = useState(false);
    // Get current URL (safe for SSR)
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger render={<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    variant="outline"
                    className="gap-2 bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/50 rounded-xl font-bold text-primary text-xs uppercase tracking-widest transition-all"
                >
                    <Share2 className="w-4 h-4" />
                    Broadcast
                </Button>
            </motion.div>}>

            </DialogTrigger>

            <DialogContent className="bg-card/90 shadow-2xl backdrop-blur-xl border-border/50 border-t rounded-[2rem] sm:max-w-md overflow-hidden">

                {/* Ambient Glow */}
                <div className="top-0 left-1/2 absolute bg-primary/20 blur-[60px] rounded-full w-[300px] h-[100px] -translate-x-1/2 pointer-events-none" />

                <DialogHeader className="relative flex flex-col items-center px-2 pt-6 text-center">
                    <div className="flex justify-center items-center bg-primary/10 shadow-inner mb-4 border border-primary/20 rounded-2xl w-12 h-12 text-primary">
                        <RadioTower className="w-6 h-6 animate-pulse" />
                    </div>
                    <DialogTitle className="mb-2 font-black text-foreground text-3xl italic uppercase leading-none tracking-tighter">
                        Station Uplink
                    </DialogTitle>
                    <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
                        Transmit this frequency to invite operators.
                    </p>
                </DialogHeader>

                <div className="flex flex-col justify-center items-center py-6">
                    {/* High-Tech QR Code Container */}
                    <div className="group relative">
                        {/* Scanner Brackets */}
                        <div className="absolute -inset-4 opacity-50 group-hover:opacity-100 border-2 border-primary/30 group-hover:border-primary/60 rounded-3xl transition-all duration-500" />
                        <ScanLine className="-top-6 -left-6 absolute opacity-50 w-6 h-6 text-primary" />
                        <ScanLine className="-right-6 -bottom-6 absolute opacity-50 w-6 h-6 text-primary rotate-180" />

                        <div className="z-10 relative bg-white shadow-[0_0_30px_rgba(var(--primary),0.15)] p-4 rounded-2xl">
                            <QRCode
                                size={180}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={currentUrl}
                                viewBox={`0 0 256 256`}
                                // Using standard black for QR to ensure 100% scan reliability across all cameras
                                fgColor="#000000"
                                bgColor="#ffffff"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-destructive/10 mt-8 px-3 py-1.5 border border-destructive/20 rounded-lg text-destructive">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span className="font-mono font-bold text-[10px] uppercase tracking-widest">
                            Requires 1KM Physical Proximity
                        </span>
                    </div>
                </div>

                <div className="px-2 pb-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="link" className="ml-1 font-mono font-bold text-[10px] text-primary uppercase tracking-widest">
                            Direct Coordinate Link
                        </Label>
                        <div className="flex items-center bg-background/50 p-1 pl-4 border border-border/50 focus-within:border-primary rounded-xl focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden transition-all">
                            <Input
                                id="link"
                                defaultValue={currentUrl}
                                readOnly
                                className="bg-transparent p-0 border-none focus-visible:ring-0 h-10 font-mono text-muted-foreground text-xs"
                            />
                            <Button
                                type="button"
                                size="sm"
                                className={`ml-2 h-10 w-12 rounded-lg transition-all ${copied ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'}`}
                                onClick={handleCopy}
                            >
                                <span className="sr-only">Copy</span>
                                {copied ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};