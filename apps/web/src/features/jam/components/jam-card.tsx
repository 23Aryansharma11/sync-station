import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface JamCardProps {
    jamId: string;
    bgImage: string;
    name: string;
    isActive: boolean;
    description: string;
    createdAt: Date;
}

export function JamCard({ jamId, bgImage, name, isActive, description, createdAt }: JamCardProps) {
    return <Card className="bg-cover bg-center bg-no-repeat size-72 rounded-xl relative"
        style={{
            backgroundImage: `url(${bgImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
        }}>
        <CardContent
            className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-xs text-white p-2 flex flex-col justify-evenly items-center"
        >
            <h4 className="font-bold text-2xl">
                {name}
            </h4>
            <p className="text-balance text-center text-base truncate line-clamp-3">
                {description}
            </p>
            <div className="w-full flex justify-center items-center gap-4">
                {
                    isActive ? (
                        <Badge variant={"default"} className="rounded">
                            Active
                        </Badge>
                    ) : (
                        <Badge variant={"destructive"} className="rounded">
                            Inactive
                        </Badge>
                    )
                }
                <span className="flex justify-center items-center gap-2">
                    <Clock className="w-4" />
                    <span className="flex justify-center items-center gap-2">
                        {
                            createdAt.toDateString()
                        }
                    </span>
                </span>
            </div>
            {
                isActive ? <Button variant={"outline"} className="w-full rounded font-bold text-xl">
                    Join
                </Button> :
                    <Button variant={"destructive"} className="w-full rounded font-bold text-xl">
                        Delete
                    </Button>
            }
        </CardContent>
    </Card>
}