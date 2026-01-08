import { AtSign } from "lucide-react"
import { Link } from "@tanstack/react-router"

import type { TDebounceRes } from "./search-jam-input"

export function JamListItem(props: TDebounceRes) {
    return <li className="flex justify-start items- gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 p-2 rounded w-full hover:scale-[0.98]">
        <img src={props.bgImage} alt="" className="rounded size-20 object-center object-cover" />
        <div className="flex flex-col items-start">
            <p className="font-semibold text-base capitalize">
                {props.name}
            </p>
            <p className="flex justify-center items-center gap-1 font-semibold text-sm">
                <AtSign size={16} />
                {props.author.email}
            </p>
        </div>
        <Link to="/"  className="self-center bg-primary ml-auto px-4 py-1 rounded text-base">
            Join
        </Link>
    </li>
}