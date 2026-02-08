import { useState } from "react";
import QRCode from "react-qr-code";
import { Copy, Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
            <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
                <Share2 className="w-4 h-4" />
                Share
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Jam Session</DialogTitle>
                    <DialogDescription>
                        Anyone with this link can join your queue and add songs.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col justify-center items-center space-y-6 py-4">
                    {/* QR Code Container */}
                    <div className="bg-white shadow-sm p-4 border rounded-xl">
                        <QRCode
                            size={180}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={currentUrl}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Scan to join immediately
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex-1 gap-2 grid">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={currentUrl}
                            readOnly
                            className="h-9"
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                        <span className="sr-only">Copy</span>
                        {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};