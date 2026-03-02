import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "motion/react";
import {
    Home,
    Unplug,
    Radio,
    AudioLines,
    Disc3,
    Plus
} from "lucide-react";

export const Route = createFileRoute("/$")({
    component: NotFoundPage,
});

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2,
        },
    },
};

const wordVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 15, stiffness: 100 },
    },
};

const floatingIcon = (delay: number, duration: number = 3): Variants => ({
    animate: {
        y: [0, -15, 0],
        opacity: [0.3, 0.6, 0.3],
        transition: {
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
        },
    },
});

const glitchVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        x: [-2, 2, -1, 1, 0],
        transition: { 
            duration: 0.4, 
            delay: 1,
            ease: "easeInOut"
        }
    }
};

const NotFoundHeading = () => {
    return (
        <div className="relative mx-auto mb-10 px-4 py-8 md:py-10 max-w-5xl">
            {/* Background Kinetic Icons - Adjusted for a "broken/lost" theme */}
            <motion.div
                variants={floatingIcon(0, 4)}
                animate="animate"
                className="top-0 md:-top-4 left-0 md:left-10 absolute text-primary/40"
            >
                <Unplug className="w-10 md:w-12 lg:w-14 h-10 md:h-12 lg:h-14 rotate-15" />
            </motion.div>

            <motion.div
                variants={floatingIcon(0.5, 3.5)}
                animate="animate"
                className="top-1/2 right-0 md:-right-4 lg:-right-8 absolute text-destructive/40"
            >
                <AudioLines className="opacity-50 w-10 md:w-14 lg:w-16 h-10 md:h-14 lg:h-16" />
            </motion.div>

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="-bottom-8 left-1/4 absolute opacity-20 text-muted-foreground"
            >
                <Disc3 className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12" />
            </motion.div>

            <motion.h1
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="z-10 relative font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-center italic uppercase leading-[0.9] tracking-tighter"
            >
                <motion.span variants={wordVariants} className="block text-foreground">
                    404
                </motion.span>

                <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-6 mt-2">
                    <motion.span variants={wordVariants} className="text-foreground">
                        Dead
                    </motion.span>
                    <motion.span
                        variants={glitchVariants}
                        className="bg-clip-text bg-linear-to-b from-destructive via-destructive/90 to-destructive/70 drop-shadow-sm text-transparent"
                    >
                        Air.
                    </motion.span>
                </div>
            </motion.h1>

            {/* Error Status Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex justify-center items-center gap-2 md:gap-4 mt-8 md:mt-10 font-mono font-bold text-[10px] text-destructive/80 md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em]"
            >
                <span className="flex bg-destructive rounded-full w-1.5 md:w-2 h-1.5 md:h-2 animate-pulse" />
                Connection Dropped
                <span className="text-destructive/50">///</span>
                Signal Lost
            </motion.div>
        </div>
    );
};

function NotFoundPage() {
    return (
        <div className="flex flex-col justify-center items-center bg-background selection:bg-primary/30 min-h-screen overflow-x-hidden font-sans text-foreground">
            
            {/* Ambient Background */}
            <div className="top-0 left-1/2 -z-10 absolute opacity-30 dark:opacity-20 w-full h-full -translate-x-1/2 pointer-events-none">
                <div className="top-1/4 left-1/4 absolute bg-destructive/20 blur-[100px] md:blur-[120px] rounded-full w-64 md:w-96 h-64 md:h-96 animate-pulse" />
                <div className="right-1/4 bottom-1/4 absolute bg-primary/20 blur-[100px] md:blur-[120px] rounded-full w-64 md:w-96 h-64 md:h-96" />
            </div>

            <main className="mx-auto px-4 md:px-6 w-full text-center container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-destructive/5 mx-auto mb-6 md:mb-8 px-4 py-1.5 border border-destructive/20 rounded-full font-bold text-[10px] text-destructive md:text-xs uppercase"
                >
                    <Radio className="w-3 h-3 animate-pulse" />
                    Station Out of Range
                </motion.div>

                <NotFoundHeading />

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mx-auto mb-10 md:mb-12 max-w-xl font-medium text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed"
                >
                    The jam session you're looking for doesn't exist, has ended, or you've drifted too far from the 1KM boundary. Let's get you back to the music.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex sm:flex-row flex-col justify-center items-center gap-4 md:gap-5 mx-auto w-full sm:max-w-none max-w-md"
                >
                    <Link to="/dashboard" className="flex justify-center items-center gap-2 bg-primary shadow-2xl shadow-primary/30 hover:shadow-primary/50 px-6 md:px-8 py-4 md:py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background w-full sm:w-auto font-bold text-primary-foreground text-base md:text-lg active:scale-95 transition-all">
                        <Home className="w-5 md:w-6 h-5 md:h-6" /> Return to Base
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}