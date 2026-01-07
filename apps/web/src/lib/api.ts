import { treaty } from "@elysiajs/eden";

import { env } from "@sync-station/env/web";
import type { TAPP } from "../../../server/src/index";

// @ts-expect-error
export const { api } = treaty<TAPP>(env.VITE_SERVER_URL, {
	credentials: "include",
	mode: "cors",
	fetch: {
		credentials: "include",
		mode: "cors",
	},
});

// export const api = edenTreaty<ElysiaBackendApp>("http://localhost:3001", {
// 	$fetch: {
// 		credentials: "include",
// 		mode: "cors",
// 	},
// }) as ReturnType<typeof edenTreaty<ElysiaBackendApp>>;
