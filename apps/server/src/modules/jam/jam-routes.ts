import Elysia, { t } from "elysia";
import prisma from "@sync-station/db";
import { auth } from "@sync-station/auth";
import { isWithinDistanceKm } from "@/lib/utils";
import { randomId } from "elysia/utils";

export const jamRoutes = new Elysia({ prefix: "/jam" })

/* ---------------- CREATE JAM ---------------- */
.post(
  "/",
  async ({ body, request, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      return { code: "UNAUTHORIZED", error: "Unauthorized" };
    }

    const count = await prisma.jam.count({
      where: { authorId: session.user.id },
    });

    if (count >= 2) {
      set.status = 403;
      return {
        code: "LIMIT_REACHED",
        error: "Max 2 jams allowed on free tier",
      };
    }

    return prisma.jam.create({
      data: {
        ...body,
        authorId: session.user.id,
      },
    });
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
  }
)

/* ---------------- LIST USER JAMS ---------------- */
.get("/", async ({ request, set }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    set.status = 401;
    return { code: "UNAUTHORIZED", error: "Unauthorized" };
  }

  return prisma.jam.findMany({
    where: { authorId: session.user.id },
    select: {
      id: true,
      bgImage: true,
      name: true,
      description: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
})

/* ---------------- DELETE JAM ---------------- */
.delete("/:id", async ({ request, params: { id }, set }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    set.status = 401;
    return { code: "UNAUTHORIZED", error: "Unauthorized" };
  }

  const jam = await prisma.jam.findUnique({
    where: { id, authorId: session.user.id },
  });

  if (!jam) {
    set.status = 404;
    return { code: "NOT_FOUND", error: "Jam not found" };
  }

  await prisma.jam.delete({ where: { id } });
  return { success: true };
})

/* ---------------- SEARCH ---------------- */
.get(
  "/search",
  async ({ request, query, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      return { code: "UNAUTHORIZED", error: "Unauthorized" };
    }

    return prisma.jam.findMany({
      where: {
        author: {
          email: {
            contains: query.email,
            mode: "insensitive",
          },
        },
      },
      select: {
        id: true,
        bgImage: true,
        name: true,
        author: {
          select: { name: true, email: true },
        },
      },
    });
  },
  {
    query: t.Object({ email: t.String() }),
  }
)

/* ---------------- GET BY ID ---------------- */
.get("/:id", async ({ request, params: { id }, set }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    set.status = 401;
    return { code: "UNAUTHORIZED", error: "Unauthorized" };
  }

  const jam = await prisma.jam.findUnique({ where: { id } });
  if (!jam) {
    set.status = 404;
    return { code: "NOT_FOUND", error: "Jam not found" };
  }

  return jam;
})

/* ---------------- JOIN TOKEN ---------------- */
.post(
  "/:id/join-token",
  async ({ request, query, body, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      return { code: "UNAUTHORIZED", error: "You must be logged in" };
    }

    const jam = await prisma.jam.findUnique({
      where: { id: query.id },
      select: { latitude: true, longitude: true },
    });

    if (!jam) {
      set.status = 404;
      return { code: "JAM_NOT_FOUND", error: "Jam does not exist" };
    }

    const isNearby = isWithinDistanceKm(
      jam.latitude,
      jam.longitude,
      body.lat,
      body.lon,
      0.5
    );

    if (!isNearby) {
      set.status = 403;
      return {
        code: "TOO_FAR",
        error: "You must be within 500 meters",
      };
    }

    return randomId();
  },
  {
    query: t.Object({ id: t.String() }),
    body: t.Object({
      lat: t.Number(),
      lon: t.Number(),
    }),
  }
);
