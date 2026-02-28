import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { motion } from 'motion/react'
import { 
  Heart, 
  Code2, 
  Map, 
  Zap, 
  Layers, 
  Globe, 
  Github, 
  Cpu, 
  Database
} from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  return (
    <div className="bg-background selection:bg-secondary/30 pb-24 min-h-screen font-sans text-foreground">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="z-10 relative mx-auto px-4 container">
          <motion.h1 
            {...fadeIn}
            className="mb-6 font-black text-5xl md:text-8xl italic uppercase tracking-tighter"
          >
            Digital Vibes. <br />
            <span className="text-primary">Physical Spaces.</span>
          </motion.h1>
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="max-w-2xl font-medium text-muted-foreground text-xl md:text-2xl leading-relaxed"
          >
            Sync Station is a real-time, location-bound music synchronization platform 
            designed to turn any physical gathering into a collaborative jam session.
          </motion.p>
        </div>

        {/* Decorative Background Element */}
        <div className="top-0 right-0 -z-10 absolute bg-primary/10 blur-[120px] rounded-full w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4" />
      </section>

      {/* --- THE VISION SECTION --- */}
      <section className="mx-auto px-4 py-20 container">
        <div className="items-center gap-16 grid md:grid-cols-2">
          <motion.div {...fadeIn}>
            <h2 className="flex items-center gap-3 mb-6 font-bold text-3xl tracking-tight">
              <Heart className="w-8 h-8 text-destructive" /> The Mission
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                In an era of solitary headphone listening, we’ve lost the magic of the 
                shared jukebox. Sync Station brings back the collective experience by 
                anchoring digital music rooms to physical coordinates.
              </p>
              <p>
                Whether it's a gym, a cafe, or a house party, we believe the music 
                should be a reflection of the people actually in the room—not just a 
                pre-set playlist.
              </p>
            </div>
          </motion.div>

          <motion.div 
            {...fadeIn}
            className="relative bg-card/50 backdrop-blur-sm p-8 border border-border rounded-[2rem]"
          >
            <h3 className="mb-4 font-bold text-xl">The 1KM Radius Lock</h3>
            <p className="mb-6 font-medium text-muted-foreground">
              Our core feature is proximity-based access. By using high-precision 
              geolocation, we ensure that you can only join a station if you are 
              physically present.
            </p>
            <div className="bg-muted rounded-full w-full h-2 overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="bg-linear-to-r from-primary/90 to-primary h-full" 
               />
            </div>
            <div className="flex justify-between mt-2 font-mono font-bold text-muted-foreground text-xs uppercase">
              <span>Your Location</span>
              <span>1KM Bound</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TECH STACK GRID --- */}
      <section className="mx-auto px-4 py-24 border-border/50 border-t container">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-black text-4xl uppercase tracking-tighter">Engineering Speed</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">Built with a high-performance stack to ensure sub-millisecond sync across all connected devices.</p>
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              icon: <Zap className="text-primary" />, 
              title: "Bun & Elysia", 
              desc: "The fastest JavaScript runtime and server framework for real-time WebSockets." 
            },
            { 
              icon: <Layers className="text-secondary" />, 
              title: "Redis", 
              desc: "Edge-based state management for zero-latency queue voting and updates." 
            },
            { 
              icon: <Code2 className="text-accent" />, 
              title: "Eden Treaty", 
              desc: "Full end-to-end type safety between our server and client interfaces." 
            },
            { 
              icon: <Database className="text-chart-1" />, 
              title: "Prisma", 
              desc: "Type-safe schema routing ensuring your station's active state is anchored instantly." 
            }
          ].map((tech, i) => (
            <motion.div 
              key={i}
              {...fadeIn}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-6 border border-border hover:border-primary/50 rounded-2xl transition-colors"
            >
              <div className="flex justify-center items-center bg-muted/50 mb-4 rounded-xl w-12 h-12">
                {tech.icon}
              </div>
              <h4 className="mb-2 font-bold text-lg">{tech.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer-lite for About page */}
      <div className="mx-auto px-4 text-center container">
         <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Handcrafted with precision in 2026
         </p>
      </div>
    </div>
  )
}