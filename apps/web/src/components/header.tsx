import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { SearchJamInput } from "@/features/jam/components/search-jam-input";

export default function Header() {
  const links = [
    { to: "/", label: "SYNC STATION" },
  ] as const;

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 py-2 bg-card ">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} to={to} className="font-bold">
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <SearchJamInput />
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </>
  );
}
