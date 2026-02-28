import { createFileRoute } from "@tanstack/react-router";
import React from "react";
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
} from "lucide-react";

export const Route = createFileRoute("/")({
	component: HomePage,
});

// --- TYPE-SAFE VARIANTS --- //

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

// --- HELPER COMPONENTS --- //

const HeroHeading = () => {
	return (
		<div className="relative mx-auto mb-12 px-4 py-10 max-w-5xl">
			{/* Background Kinetic Icons */}
			<motion.div
				variants={floatingIcon(0)}
				animate="animate"
				className="-top-4 left-0 md:left-10 absolute opacity-40 md:opacity-100 text-primary"
			>
				<Music className="w-8 md:w-12 h-8 md:h-12 rotate-[-15deg]" />
			</motion.div>

			<motion.div
				variants={floatingIcon(0.5)}
				animate="animate"
				className="top-1/2 right-0 md:-right-4 absolute opacity-40 md:opacity-100 text-primary/60"
			>
				<AudioLines className="w-10 md:w-16 h-10 md:h-16" />
			</motion.div>

			<motion.div
				variants={floatingIcon(1)}
				animate="animate"
				className="-bottom-8 left-1/4 absolute opacity-30 text-primary/40"
			>
				<Disc className="w-6 md:w-10 h-6 md:h-10 animate-spin-slow" />
			</motion.div>

			{/* Main Animated Text */}
			<motion.h1
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="z-10 relative font-black text-6xl md:text-8xl text-center italic uppercase leading-[0.85] tracking-tighter"
			>
				<motion.span variants={wordVariants} className="block text-foreground">
					The Jukebox
				</motion.span>

				<div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6">
					<motion.span variants={wordVariants} className="text-foreground">
						For
					</motion.span>
					<motion.span
						variants={wordVariants}
						className="bg-clip-text bg-gradient-to-b from-primary via-primary/90 to-primary/70 drop-shadow-sm text-transparent"
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
						className="-bottom-2 left-0 absolute bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] blur-[1px] rounded-full h-2"
					/>
				</motion.span>
			</motion.h1>

			{/* Status Indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.5 }}
				className="flex justify-center items-center gap-4 mt-8 font-mono font-bold text-muted-foreground text-xs uppercase tracking-[0.2em]"
			>
				<span className="flex bg-primary rounded-full w-2 h-2 animate-pulse" />
				Synchronizing State
				<span className="text-primary/50">///</span>
				Edge Node: Active
			</motion.div>
		</div>
	);
};

// --- MAIN PAGE COMPONENT --- //

function HomePage() {
	return (
		<div className="bg-background selection:bg-primary/30 min-h-screen font-sans text-foreground">
			{/* HERO SECTION */}
			<section className="relative pt-20 pb-32 overflow-hidden">
				<div className="top-0 left-1/2 -z-10 absolute opacity-30 dark:opacity-20 w-full h-full -translate-x-1/2">
					<div className="top-0 left-1/4 absolute bg-primary/40 blur-[120px] rounded-full w-96 h-96 animate-pulse" />
					<div className="right-1/4 bottom-0 absolute bg-secondary/40 blur-[120px] rounded-full w-96 h-96" />
				</div>

				<div className="mx-auto px-4 text-center container">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="inline-flex items-center gap-2 bg-primary/5 mb-8 px-4 py-1.5 border border-primary/20 rounded-full font-bold text-primary text-xs"
					>
						<span className="relative flex w-2 h-2">
							<span className="inline-flex absolute bg-primary opacity-75 rounded-full w-full h-full animate-ping" />
							<span className="inline-flex relative bg-primary rounded-full w-2 h-2" />
						</span>
						LIVE IN YOUR VICINITY
					</motion.div>

					<HeroHeading />

					<p className="mx-auto mb-12 max-w-2xl font-medium text-muted-foreground text-lg md:text-xl leading-relaxed">
						Create location-locked music rooms. Add YouTube tracks, vote on the queue,
						and jam with everyone within 1km. No apps, just sync.
					</p>

					<div className="flex sm:flex-row flex-col justify-center items-center gap-5">
						<button className="flex items-center gap-2 bg-primary shadow-2xl shadow-primary/30 hover:shadow-primary/50 px-8 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background font-bold text-primary-foreground text-lg transition-all">
							<Plus className="w-6 h-6" /> Start a Jam Session
						</button>
						<button className="flex items-center gap-2 bg-card/50 hover:bg-accent backdrop-blur-sm px-8 py-5 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background font-bold text-lg transition-all">
							<MapPin className="w-5 h-5 text-secondary" /> Find Nearby Stations
						</button>
					</div>
				</div>
			</section>

			{/* CORE FEATURES */}
			<section id="features" className="bg-muted/30 py-24">
				<div className="mx-auto px-4 container">
					<div className="gap-12 grid md:grid-cols-3">
						{/* Music Sync */}
						<div className="group bg-card shadow-sm p-8 border border-border hover:border-primary/50 rounded-3xl transition-all">
							<div className="flex justify-center items-center bg-primary/10 mb-6 rounded-2xl w-14 h-14 text-primary group-hover:scale-110 transition-transform">
								<Music className="w-8 h-8" />
							</div>
							<h3 className="mb-3 font-bold text-2xl tracking-tight">Collaborative Queue</h3>
							<p className="text-muted-foreground leading-relaxed">
								Add songs together and build the perfect vibe. Everyone in the room can contribute, so the music never stops.
							</p>
						</div>

						{/* Location Bound */}
						<div className="group bg-card shadow-sm p-8 border border-border border-secondary/20 hover:border-secondary/50 rounded-3xl transition-all">
							<div className="flex justify-center items-center bg-secondary/10 mb-6 rounded-2xl w-14 h-14 text-secondary group-hover:scale-110 transition-transform">
								<MapPin className="w-8 h-8" />
							</div>
							<h3 className="mb-3 font-bold text-2xl tracking-tight">1KM Boundary</h3>
							<p className="text-muted-foreground leading-relaxed">
								Keep the session local and exclusive. Only people nearby can join the jam, making every room feel personal.
							</p>
						</div>

						{/* Real-time */}
						<div className="group bg-card shadow-sm p-8 border border-accent/20 border-border hover:border-accent/50 rounded-3xl transition-all">
							<div className="flex justify-center items-center bg-accent/10 mb-6 rounded-2xl w-14 h-14 text-accent group-hover:scale-110 transition-transform">
								<Zap className="w-8 h-8" />
							</div>
							<h3 className="mb-3 font-bold text-2xl tracking-tight">Instant Sync</h3>
							<p className="text-muted-foreground leading-relaxed">
								Add songs together and build the perfect vibe! Your music queue stays perfectly in-sync across the whole room.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="mx-auto px-4 py-24 text-center container">
				<div className="relative bg-primary p-12 md:p-24 rounded-[3rem] overflow-hidden text-primary-foreground">
					<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
					<div className="z-10 relative">
						<h2 className="mb-8 font-extrabold text-5xl md:text-7xl italic uppercase tracking-tighter">
							Start Your Station
						</h2>
						<p className="mx-auto mb-12 max-w-xl font-medium text-primary-foreground/80 text-xl">
							Host a jam at your cafe, gym, or house party. One link, infinite vibes.
						</p>
						<button className="flex items-center gap-3 bg-background shadow-2xl mx-auto px-10 py-5 rounded-full focus:outline-none focus:ring-4 focus:ring-background/50 font-black text-foreground text-2xl hover:scale-105 active:scale-95 transition-all">
							CREATE JAM <ChevronRight />
						</button>
					</div>
				</div>
			</section>

			{/* FOOTER */}
			<footer className="bg-muted/20 py-12 border-border border-t">
				<div className="mx-auto px-4 container">
					<div className="flex md:flex-row flex-col justify-between items-center gap-8">
						<div className="flex items-center gap-2">
							<Radio className="w-6 h-6 text-primary" />
							<span className="font-bold italic uppercase tracking-tighter">Sync Station</span>
						</div>
						<div className="flex gap-8 font-semibold text-muted-foreground text-sm">
							<a href="https://github.com/23Aryansharma11/sync-station" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
								<Github className="w-4 h-4" /> GitHub
							</a>
							<a href="#" className="hover:text-foreground transition-colors">Twitter/X</a>
							<a href="#" className="hover:text-foreground transition-colors">Privacy</a>
						</div>
						<div className="bg-muted px-3 py-1 rounded-full font-mono text-muted-foreground text-xs">
							BUN_RUNTIME_V1.3.4
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default HomePage;