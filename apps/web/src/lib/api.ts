import { treaty } from "@elysiajs/eden";

import { env } from "@sync-station/env/web"
import type { TAPP } from "../../../server/src/index"

// @ts-ignore
export const { api } = treaty<TAPP>(env.VITE_SERVER_URL)