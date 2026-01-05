import { auth } from "@sync-station/auth";
import prisma from "@sync-station/db";
import Elysia, { t } from "elysia";

export const jamRoutes = new Elysia({ prefix: "/jam" })
    .post("/", async ({ body, request: { headers }, status }) => {
        const session = await auth.api.getSession({ headers })
        if (!session) {
            return status(401)
        }
        const { name, description, bgImage } = body
        const dbRes = await prisma.jam.create({
            data: {
                name,
                description,
                bgImage,
                authorId: session.user.id
            }
        })

        return dbRes
    }, {
        body: t.Object({
            name: t.String({ minLength: 3, maxLength: 20 }),
            description: t.String({ minLength: 3, maxLength: 100 }),
            bgImage: t.String(),
        },
        )
    })