import { auth } from "@sync-station/auth";
import prisma from "@sync-station/db";
import Elysia, { t } from "elysia";

export const jamRoutes = new Elysia({ prefix: "/jam" }).post(
	"/",
	async ({ body, request, status }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			throw new Error("Unauthorized")
		}
		const { name, description, bgImage } = body;

		const count = await prisma.jam.count({
			where: {
				authorId: session.user.id
			}
		})

		if (count >= 2) {
			return status(403, { error: "Max 2 jams allowed on free tier" });
		}

		const dbRes = await prisma.jam.create({
			data: {
				name,
				description,
				bgImage,
				authorId: session.user.id,
			},
		});

		return dbRes;
	},
	{
		body: t.Object({
			name: t.String({ minLength: 3, maxLength: 20 }),
			description: t.String({ minLength: 3, maxLength: 100 }),
			bgImage: t.String(),
		}),
	},
).get("/", async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) {
		throw new Error("Unauthorized")
	}
	const res = await prisma.jam.findMany({
		where: {
			authorId: session.user.id
		},
		select: {
			id: true,
			bgImage: true,
			name: true,
			description: true,
			createdAt: true
		},
		orderBy: {
			createdAt: "desc"
		}
	})
	return res;
}).delete("/:id", async ({ request, status, params: { id } }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) {
		throw new Error("Unauthorized");
	}

	const jam = await prisma.jam.findUnique({
		where: { id, authorId: session.user.id }
	});
	if (!jam) return status(404, { error: "Jam not found" });

	await prisma.jam.delete({ where: { id } });
	return { success: true };
})
