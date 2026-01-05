import { useLocation } from "@tanstack/react-router";
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
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchJamInput() {
    const location = useLocation();
    console.log(location.pathname === "/(protected)/dashboard"); // Fixed path match

    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" className="h-10 w-10 rounded-full p-0 sm:h-12 sm:w-12" />}>
                <Search className="h-5 w-5" />
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg p-6 sm:p-8 backdrop-blur-sm bg-card/60 border-border/50 shadow-2xl rounded">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                        Search Jam Sessions
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base leading-relaxed">
                        Sessions are location-bound. You can only join nearby jams.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="host-email" className="text-sm font-semibold">
                            Host Email
                        </Label>
                        <Input
                            id="host-email"
                            placeholder="johndoe@example.com"
                            className="h-12 text-base font-semibold rounded"
                            autoComplete="email"
                        />
                    </div>
                </form>

                <DialogFooter className="sm:gap-2 pt-4">
                    <DialogClose render={<Button type="button" variant="outline" className="flex-1 sm:flex-none rounded" />}>
                        Cancel
                    </DialogClose>
                    <Button type="submit" className="flex-1 sm:flex-none rounded">
                        Search Jams
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
