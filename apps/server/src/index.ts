import { cors } from "@elysiajs/cors";
import { auth } from "@sync-station/auth";
import { env } from "@sync-station/env/server";
import { Elysia } from "elysia";
import { jamRoutes } from "./modules/jam/jam-routes";

const app = new Elysia({ prefix: "/api" })
	.use(
		cors({
			origin: env.CORS_ORIGIN,
			methods: ["GET", "POST", "OPTIONS", "DELETE", "PATCH"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.all("/auth/*", async (context) => {
		const { request, status } = context;
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
		}
		return status(405);
	})
	.use(jamRoutes)
	.get("/", () => "OK")
	.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});

export type TAPP = typeof app;
