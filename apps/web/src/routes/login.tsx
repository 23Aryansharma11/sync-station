import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { motion } from "motion/react";
import { Fingerprint, Radio, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
    component: LoginPage,
    beforeLoad: async () => {
        const { data } = await authClient.getSession();
        if (data) {
            throw redirect({
                to: "/dashboard",
                replace: true,
            });
        }
    },
});

function LoginPage() {
    const { theme } = useTheme();

    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: window.location.origin,
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/dashboard";
                },
            },
        });
    };

    return (
        <div className="relative flex flex-col justify-center items-center bg-background selection:bg-primary/30 p-4 min-h-screen overflow-hidden">
            
            {/* Ambient Background Effects */}
            <div className="top-1/2 left-1/2 absolute bg-primary/10 blur-[120px] rounded-full w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Top Logo Area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="top-8 left-8 absolute flex items-center gap-2 text-muted-foreground"
            >
                <Radio className="w-5 h-5 text-primary" />
                <span className="font-black text-lg italic uppercase tracking-tighter">Sync Station</span>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 relative w-full max-w-md"
            >
                <MagicCard
                    gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                    className="bg-card/80 shadow-2xl backdrop-blur-xl border border-border/50 rounded-[2rem] overflow-hidden"
                >
                    <div className="flex flex-col items-center p-8 sm:p-10 text-center">
                        
                        {/* Biometric/Auth Icon */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <div className="relative flex justify-center items-center bg-primary/10 shadow-inner border border-primary/20 rounded-3xl w-20 h-20 text-primary">
                                <Fingerprint className="w-10 h-10 animate-pulse" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <h1 className="mb-3 font-black text-foreground text-4xl italic uppercase leading-none tracking-tighter">
                            Access Terminal
                        </h1>
                        <p className="mb-10 max-w-[250px] font-mono text-muted-foreground text-xs uppercase leading-relaxed tracking-widest">
                            Establish secure connection to deploy local nodes.
                        </p>

                        {/* Action Area */}
                        <div className="space-y-4 w-full">
                            <Button
                                variant="outline"
                                className="group relative flex justify-center items-center bg-background/50 hover:bg-background border-border/50 hover:border-primary/50 rounded-xl w-full h-14 overflow-hidden transition-all"
                                onClick={handleLogin}
                            >
                                {/* Subtle hover gradient inside the button */}
                                <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 transition-transform translate-x-full group-hover:translate-x-full duration-1000" />
                                
                                <img src="/google.png" alt="Google logo" className="z-10 relative mr-3 w-5 h-5" />
                                <span className="z-10 relative font-bold text-base">
                                    Authenticate via Google
                                </span>
                            </Button>

                            <div className="flex justify-center items-center gap-2 opacity-50 pt-4">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="font-mono text-[10px] uppercase tracking-widest">
                                    End-to-End Encrypted Handshake
                                </span>
                            </div>
                        </div>
                    </div>
                </MagicCard>
            </motion.div>

            {/* Bottom Status Line */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bottom-8 absolute flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest"
            >
                <span className="flex bg-primary rounded-full w-2 h-2 animate-ping" />
                Awaiting Credentials...
            </motion.div>
        </div>
    );
}