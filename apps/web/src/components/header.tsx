import { Link } from "@tanstack/react-router";
import { SearchJamInput } from "@/features/jam/components/search-jam-input";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { Radio } from "lucide-react";

export default function Header() {
    // Added 'About' to match our new page
    const links = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" }
    ] as const;

    return (
        <header className="top-0 z-50 sticky bg-background/80 backdrop-blur-md border-border/50 border-b w-full">
            <div className="flex justify-between items-center mx-auto px-4 h-16 container">
                
                {/* --- LOGO SECTION --- */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="group flex items-center gap-2 active:scale-95 transition-transform">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-primary opacity-20 group-hover:opacity-50 blur-sm rounded-full transition" />
                            <Radio className="relative w-6 h-6 text-primary" />
                        </div>
                        <span className="hidden sm:block font-black text-lg italic uppercase tracking-tighter">
                            Sync Station
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {links.map(({ to, label }) => (
                            <Link 
                                key={to} 
                                to={to} 
                                className="font-bold text-muted-foreground hover:text-primary [&.active]:text-primary text-sm [&.active]:underline [&.active]:underline-offset-8 uppercase tracking-widest transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* --- ACTIONS SECTION --- */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/*
                    <div className="w-full max-w-[120px] sm:max-w-[200px] md:max-w-[250px]">
                        <SearchJamInput />
                    </div> */}
                    
                    <div className="flex items-center gap-1 pl-2 md:pl-4 border-border/50 border-l">
                        <ModeToggle />
                        <UserMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}