import { auth } from "@sync-station/auth";
import prisma from "@sync-station/db";
import Elysia, { t } from "elysia";

export const jamRoutes = new Elysia({ prefix: "/jam" }).post(
	"/",
	async ({ body, request, status }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			return status(401);
		}
		const { name, description, bgImage } = body;

		const count = await prisma.jam.count({
			where: {
				authorId: session.user.id
			}
		})

		if (count >= 2) {
			return status(403, "Forbidden");
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
).get("/", async ({ request, status }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) {
		return status(401);
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
			createdAt: "asc"
		}
	})
	return res;
}).delete("/:id", async ({ request, status, params: { id } }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) {
		return status(401);
	}

	const res = await prisma.jam.delete({
		where: {
			authorId: session.user.id,
			id
		}
	})

	return res.id ? true : false

})
