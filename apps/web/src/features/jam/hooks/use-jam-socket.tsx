import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";

type JamSocket = ReturnType<ReturnType<typeof api.ws.jam>['subscribe']>;

export const useJamSocket = (jamId: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);

    const socketRef = useRef<JamSocket | null>(null);

    useEffect(() => {
        const socket = api.ws.jam({ jamId }).subscribe();

        socketRef.current = socket;

        socket.on("open", () => {
            console.log("Eden WS Connected");
            setIsConnected(true);
        });

        socket.on("message", (event) => {
            console.log("New Message:", event.data);
            setLastMessage(event.data);
        });

        socket.on("close", () => {
            console.log("Eden WS Disconnected");
            setIsConnected(false);
        });

        return () => {
            socket.close();
        };
    }, [jamId]);

    const sendMessage = (data: any) => {
        if (socketRef.current && isConnected) {
            socketRef.current.send(data);
        }
    };

    return { isConnected, lastMessage, sendMessage };
};