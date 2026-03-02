import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "motion/react";
import {
    Music,
    MapPin,
    Radio,
    Zap,
    ChevronRight,
    Plus,
    Github,
    AudioLines,
    Disc,
    Book,
} from "lucide-react";

export const Route = createFileRoute("/")({
    component: HomePage,
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

const floatingIcon = (delay: number): Variants => ({
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
        },
    },
});

const CORE_FEATURES = [
    {
        tag: "SYS.01",
        title: "Collaborative Queue",
        description: "Add songs together and build the perfect vibe. Everyone in the room can contribute, so the music never stops.",
        icon: Music,
        colorText: "text-primary",
        colorBg: "bg-primary/10",
        colorGlow: "bg-primary/20",
        colorBorder: "group-hover:border-primary/50",
    },
    {
        tag: "SYS.02",
        title: "1KM Boundary",
        description: "Keep the session local and exclusive. Only people nearby can join the jam, making every room feel personal.",
        icon: MapPin,
        colorText: "text-secondary",
        colorBg: "bg-secondary/10",
        colorGlow: "bg-secondary/20",
        colorBorder: "group-hover:border-secondary/50",
    },
    {
        tag: "SYS.03",
        title: "Instant Sync",
        description: "No delays, no latency. Your music queue stays perfectly in-sync across the whole room in real-time.",
        icon: Zap,
        colorText: "text-accent",
        colorBg: "bg-accent/10",
        colorGlow: "bg-accent/20",
        colorBorder: "group-hover:border-accent/50",
    }
];


const HeroHeading = () => {
    return (
        <div className="relative mx-auto mb-12 px-4 py-8 md:py-10 max-w-5xl">
            {/* Background Kinetic Icons */}
            <motion.div
                variants={floatingIcon(0)}
                animate="animate"
                className="top-0 md:-top-4 left-0 md:left-10 absolute opacity-30 md:opacity-100 text-primary"
            >
                <Music className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 rotate-[-15deg]" />
            </motion.div>

            <motion.div
                variants={floatingIcon(0.5)}
                animate="animate"
                className="top-1/2 right-0 md:-right-4 lg:-right-8 absolute opacity-30 md:opacity-80 text-primary/60"
            >
                <AudioLines className="w-10 md:w-14 lg:w-16 h-10 md:h-14 lg:h-16" />
            </motion.div>

            <motion.div
                variants={floatingIcon(1)}
                animate="animate"
                className="-bottom-8 left-1/4 absolute opacity-20 md:opacity-40 text-primary/40"
            >
                <Disc className="w-6 md:w-8 lg:w-10 h-6 md:h-8 lg:h-10 animate-spin-slow" />
            </motion.div>

            <motion.h1
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="z-10 relative font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center italic uppercase leading-[0.9] tracking-tighter"
            >
                <motion.span variants={wordVariants} className="block text-foreground">
                    The Jukebox
                </motion.span>

                <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-6">
                    <motion.span variants={wordVariants} className="text-foreground">
                        For
                    </motion.span>
                    <motion.span
                        variants={wordVariants}
                        className="bg-clip-text bg-linear-to-b from-primary via-primary/90 to-primary/70 drop-shadow-sm text-transparent"
                    >
                        Your Local
                    </motion.span>
                </div>

                <motion.span
                    variants={wordVariants}
                    className="inline-block relative text-foreground"
                >
                    Crowd.
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="-bottom-1 md:-bottom-2 left-0 absolute bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] blur-[1px] rounded-full h-1.5 md:h-2"
                    />
                </motion.span>
            </motion.h1>

            {/* Status Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex justify-center items-center gap-2 md:gap-4 mt-8 md:mt-10 font-mono font-bold text-[10px] text-muted-foreground md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em]"
            >
                <span className="flex bg-primary rounded-full w-1.5 md:w-2 h-1.5 md:h-2 animate-pulse" />
                Synchronizing State
                <span className="text-primary/50">///</span>
                Edge Node: Active
            </motion.div>
        </div>
    );
};


function HomePage() {
    return (
        <div className="bg-background selection:bg-primary/30 min-h-screen overflow-x-hidden font-sans text-foreground">
            {/* HERO SECTION */}
            <section className="relative pt-16 md:pt-20 pb-20 md:pb-32 overflow-hidden">
                <div className="top-0 left-1/2 -z-10 absolute opacity-30 dark:opacity-20 w-full h-full -translate-x-1/2 pointer-events-none">
                    <div className="top-0 left-1/4 absolute bg-primary/40 blur-[100px] md:blur-[120px] rounded-full w-64 md:w-96 h-64 md:h-96 animate-pulse" />
                    <div className="right-1/4 bottom-0 absolute bg-secondary/40 blur-[100px] md:blur-[120px] rounded-full w-64 md:w-96 h-64 md:h-96" />
                </div>

                <div className="mx-auto px-4 md:px-6 text-center container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-primary/5 mb-6 md:mb-8 px-4 py-1.5 border border-primary/20 rounded-full font-bold text-[10px] text-primary md:text-xs uppercase"
                    >
                        <span className="relative flex w-2 h-2">
                            <span className="inline-flex absolute bg-primary opacity-75 rounded-full w-full h-full animate-ping" />
                            <span className="inline-flex relative bg-primary rounded-full w-2 h-2" />
                        </span>
                        Live in your city
                    </motion.div>

                    <HeroHeading />

                    <p className="mx-auto mb-10 md:mb-12 max-w-2xl font-medium text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed">
                        Create location-locked music rooms. Add YouTube tracks, vote on the queue,
                        and jam with everyone within 1km. No apps, just sync.
                    </p>

                    <div className="flex sm:flex-row flex-col justify-center items-center gap-4 md:gap-5 mx-auto w-full sm:max-w-none max-w-md">
                        <Link to="/dashboard" className="flex justify-center items-center gap-2 bg-primary shadow-2xl shadow-primary/30 hover:shadow-primary/50 px-6 md:px-8 py-4 md:py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background w-full sm:w-auto font-bold text-primary-foreground text-base md:text-lg active:scale-95 transition-all">
                            <Plus className="w-5 md:w-6 h-5 md:h-6" /> Start a Jam Session
                        </Link>
                        <Link to="/about" className="flex justify-center items-center gap-2 bg-card/50 hover:bg-card backdrop-blur-sm px-6 md:px-8 py-4 md:py-5 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background w-full sm:w-auto font-bold text-base md:text-lg active:scale-95 transition-all">
                            <Book className="w-4 md:w-5 h-4 md:h-5 text-secondary" /> Read More About Us
                        </Link>
                    </div>
                </div>
            </section>
            <section id="features" className="relative bg-muted/30 py-20 md:py-32 overflow-hidden">
                <div className="mx-auto px-4 md:px-6 container">
                    <div className="gap-6 lg:gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {CORE_FEATURES.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                                // The magic responsive class for the 3rd item on tablets
                                className={`group relative bg-card/40 hover:bg-card/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 border border-border/50 ${feature.colorBorder} rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}
                            >
                                <div className={`absolute -top-12 -right-12 w-32 md:w-48 h-32 md:h-48 ${feature.colorGlow} rounded-full blur-2xl md:blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                                <div className={`font-mono text-[10px] mb-5 md:mb-6 font-bold uppercase tracking-[0.2em] ${feature.colorText} opacity-80`}>
                                    [{feature.tag}]
                                </div>

                                <div className={`relative flex justify-center items-center ${feature.colorBg} mb-6 md:mb-8 rounded-4xl w-14 md:w-16 h-14 md:h-16 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-inner`}>
                                    <div className={`absolute inset-0 border-2 border-current opacity-10 rounded-4xl ${feature.colorText}`} />
                                    <feature.icon className={`w-6 md:w-8 h-6 md:h-8 ${feature.colorText}`} />
                                </div>

                                <h3 className="mb-3 md:mb-4 font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tighter">
                                    {feature.title}
                                </h3>
                                <p className="mx-auto md:mx-0 md:max-w-none max-w-md font-medium text-muted-foreground text-sm sm:text-base leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className={`absolute bottom-0 left-8 md:left-10 right-8 md:right-10 h-[3px] bg-linear-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 ${feature.colorText} transition-opacity duration-500`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto px-4 md:px-6 py-16 md:py-24 text-center container">
                <div className="relative bg-primary p-8 sm:p-12 md:p-16 lg:p-24 rounded-[2rem] md:rounded-[3rem] overflow-hidden text-primary-foreground">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
                    <div className="z-10 relative">
                        <h2 className="mb-6 md:mb-8 font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic uppercase tracking-tighter">
                            Start Your Station
                        </h2>
                        <p className="mx-auto mb-8 md:mb-12 max-w-xl font-medium text-primary-foreground/80 text-base sm:text-lg md:text-xl">
                            Host a jam at your cafe, gym, or house party. One link, infinite vibes.
                        </p>
                        <Link to="/dashboard">
                            <button className="flex items-center gap-2 md:gap-3 bg-background shadow-2xl mx-auto px-8 md:px-10 py-4 md:py-5 rounded-full focus:outline-none focus:ring-4 focus:ring-background/50 font-black text-foreground text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all">
                                CREATE JAM <ChevronRight className="w-5 md:w-6 h-5 md:h-6" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-muted/20 py-8 md:py-12 border-border border-t">
                <div className="mx-auto px-4 md:px-6 container">
                    <div className="flex md:flex-row flex-col justify-between items-center gap-6 md:gap-8">
                        <div className="flex items-center gap-2">
                            <Radio className="w-5 md:w-6 h-5 md:h-6 text-primary" />
                            <span className="font-bold text-base md:text-lg italic uppercase tracking-tighter">Sync Station</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-semibold text-muted-foreground text-xs md:text-sm">
                            <a href="https://github.com/23Aryansharma11/sync-station" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <Github className="w-4 h-4" /> GitHub
                            </a>
                            <a href="#" className="hover:text-foreground transition-colors">Twitter / X</a>
                            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                        </div>
                        <div className="bg-muted px-3 py-1 rounded-full font-mono text-[10px] text-muted-foreground md:text-xs">
                            BUN_RUNTIME_V1.3.4
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;