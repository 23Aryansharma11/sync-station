import z from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CreateJamBtn() {
    return <Dialog>
        <DialogTrigger render={<Button variant={"ghost"} className="size-64 rounded-xl border-2 border-foreground flex justify-center items-center text-2xl cursor-not-allowed" />}>
            <Plus className="w-8" />
            <span>
                Create New Room
            </span>
        </DialogTrigger>

        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg p-6 sm:p-8 backdrop-blur-sm bg-card/60 border-border/50 shadow-2xl rounded">
            <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                    Create Jam Sessions
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base leading-relaxed">
                    Sessions are location-bound. Only people near you can join.
                </DialogDescription>
            </DialogHeader>

            <form action="">

            </form>


        </DialogContent>
    </Dialog>
}