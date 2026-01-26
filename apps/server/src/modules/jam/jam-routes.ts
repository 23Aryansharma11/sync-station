import Elysia, { t } from "elysia";
import { jwt } from '@elysiajs/jwt';

import prisma from "@sync-station/db";
import { auth } from "@sync-station/auth";
import { env } from "@sync-station/env/server";
import { isWithinDistanceKm } from "@/lib/utils";

export const jamRoutes = new Elysia({ prefix: "/jam" })
  .post("/", async ({ body, request, status }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      throw new Error("Unauthorized")
    }
    const { name, description, bgImage, accuracy, latitude, longitude } = body;

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
        latitude,
        longitude,
        accuracy
      },
    });

    return dbRes;
  },
    {
      body: t.Object({
        name: t.String({ minLength: 3, maxLength: 20 }),
        description: t.String({ minLength: 3, maxLength: 100 }),
        bgImage: t.String(),
        latitude: t.Number(),
        longitude: t.Number(),
        accuracy: t.Number(),
      }),
    },
  )
  .get("/", async ({ request }) => {
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
  })
  .delete("/:id", async ({ request, status, params: { id } }) => {
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
  .get("/search", async ({ request, query }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      throw new Error("Unauthorized")
    }
    const { email } = query;

    const res = await prisma.jam.findMany({
      where: {
        author: {
          email: {
            contains: email,
            mode: "insensitive"
          }
        }
      },
      select: {
        id: true,
        bgImage: true,
        name: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return res
  }, {
    query: t.Object({
      email: t.String()
    })
  })
  .get("/:id", async ({ request, params: { id } }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      throw new Error("Unauthorized");
    }

    const jam = await prisma.jam.findUnique({
      where: {
        id
      }
    })

    return jam
  })
  .use(jwt({ name: "jwt", secret: env.JWT_SECRET }))
  .post("/:id/join-token", async ({ request, body, jwt, params }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      throw new Error("Unauthorized")
    }
    const { id } = params;
    const { lat, lon } = body;
    const jam = await prisma.jam.findUnique({
      where: {
        id
      },
      select: {
        latitude: true,
        longitude: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    const isNearby = isWithinDistanceKm(jam?.latitude!, jam?.longitude!, lat, lon, 1)

    if (!isNearby) {
      throw new Error("Too far from the station")
    }

    const token = await jwt.sign({
      sub: session.user.id,
      jamId: id,
      name: jam?.author.name
    })
    return { token }
  }, {
    body: t.Object({
      lat: t.Number(),
      lon: t.Number()
    })
  })
  // In your jamRoutes chain
  // Remove the old .get("/valid-token/:token") and replace with:

  .post("/verify-token", async ({ body, jwt }) => {
    const profile = await jwt.verify(body.token);

    if (!profile) {
      throw new Error("Invalid or expired token");
    }

    return { valid: true, jamId: profile.jamId };
  }, {
    body: t.Object({
      token: t.String()
    })
  })
