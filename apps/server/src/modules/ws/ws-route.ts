import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "@sync-station/env/server";
import { redis } from "@/lib/redis";
import { getYoutubeData } from "./lib/get-youtube-data";
import { normalizeLink } from "./lib/standardize-links";

const ClientMessage = t.Union([
    t.Object({
        type: t.Literal("join"),
        data: t.Object({ joineeId: t.String(), username: t.String(), avatar: t.String() })
    }),
    t.Object({
        type: t.Literal("add-music"),
        data: t.Object({
            ytLink: t.String(),
            name: t.Optional(t.String()),
            avatar: t.Optional(t.String()),
            title: t.Optional(t.String()),
            thumbnail: t.Optional(t.String()),
            addedAt: t.Optional(t.Number())
        })
    }),
    t.Object({
        type: t.Literal("toggle-like"),
        data: t.Object({ ytLink: t.String(), userId: t.String(), isLiked: t.Boolean() })
    }),
    t.Object({
        type: t.Literal("remove-music"),
        data: t.Object({ ytLink: t.String() })
    }),
]);

const ServerMessage = t.Union([
    t.Object({
        type: t.Literal("join"),
        data: t.Object({ joineeId: t.String(), username: t.String(), avatar: t.String() })
    }),
    t.Object({
        type: t.Literal("add-music"),
        data: t.Object({
            ytLink: t.String(),
            name: t.String(),
            avatar: t.String(),
            title: t.String(),
            thumbnail: t.String(),
            addedAt: t.Number()
        })
    }),
    t.Object({
        type: t.Literal("toggle-like"),
        data: t.Object({ ytLink: t.String(), userId: t.String(), isLiked: t.Boolean() })
    }),
    t.Object({
        type: t.Literal("initial-queue"),
        data: t.Object({
            queue: t.Array(t.Object({
                ytLink: t.String(),
                name: t.String(),
                avatar: t.String(),
                likes: t.Number(),
                likedBy: t.Array(t.String()),
                title: t.String(),
                thumbnail: t.String(),
                addedAt: t.Number()
            }))
        })
    }),
    t.Object({
        type: t.Literal("remove-music"),
        data: t.Object({ ytLink: t.String() })
    }),
]);

export const wsRoutes = new Elysia()
    .use(jwt({ name: "jwt", secret: env.JWT_SECRET }))
    .group("/ws/jam/:jamId", (app) =>
        app
            .guard({ cookie: t.Object({ jamJoinToken: t.String() }) })
            .derive(async ({ params: { jamId }, cookie: { jamJoinToken }, jwt }) => {
                const profile = await jwt.verify(jamJoinToken.value);
                if (!profile) throw new Error("Invalid Token");
                if (profile.jamId !== jamId) throw new Error("Room mismatch");
                const isAdmin = profile.role === "admin";
                return { user: profile, isAdmin };
            })

            .ws("/", {
                body: ClientMessage,      
                response: ServerMessage, 

                async open(ws) {
                    const { jamId } = ws.data.params;
                    const { sub: userId, name, avatar } = ws.data.user;

                    if (!userId) return;
                    ws.subscribe(jamId);

                    const songsMap = await redis.hgetall(`jam:${jamId}:songs`);
                    const queue = [];

                    for (const [ytLink, metadataJson] of Object.entries(songsMap)) {
                        try {
                            const metadata = JSON.parse(String(metadataJson || "{}"));
                            const likedBy = await redis.smembers(`jam:${jamId}:likes:${ytLink}`);

                            queue.push({
                                ytLink,
                                name: metadata.name || "Unknown",
                                avatar: metadata.avatar || "",
                                title: metadata.title || ytLink,
                                thumbnail: metadata.thumbnail || "",
                                addedAt: metadata.addedAt || Date.now(),
                                likes: likedBy.length,
                                likedBy: likedBy
                            });
                        } catch (e) {
                            console.error(`Failed to parse song ${ytLink}`, e);
                        }
                    }

                    ws.send({
                        type: "initial-queue",
                        data: { queue }
                    });

                    ws.publish(jamId, {
                        type: "join",
                        data: {
                            joineeId: String(userId),
                            username: String(name) || "Unknown User",
                            avatar: String(avatar),
                        }
                    });
                },

                async message(ws, message) {
                    const { jamId } = ws.data.params;
                    const { name, avatar, sub: userId } = ws.data.user;

                    switch (message.type) {
                        case "add-music": {
                            const cleanLink = normalizeLink(message.data.ytLink);
                            
                            const exists = await redis.hexists(`jam:${jamId}:songs`, cleanLink);
                            if (exists) return;

                            const { title, thumbnail } = await getYoutubeData(cleanLink);
                            const addedAt = Date.now();

                            await redis.hset(`jam:${jamId}:songs`, cleanLink, JSON.stringify({
                                name: String(name),
                                avatar: String(avatar),
                                addedAt,
                                title,
                                thumbnail
                            }));

                            ws.publish(jamId, {
                                type: "add-music",
                                data: {
                                    ytLink: cleanLink, 
                                    name: String(name),
                                    avatar: String(avatar),
                                    title,
                                    thumbnail,
                                    addedAt
                                }
                            });
                            break;
                        }

                        case "toggle-like": {
                            const cleanLink = normalizeLink(message.data.ytLink);
                            const key = `jam:${jamId}:likes:${cleanLink}`;

                            if (message.data.isLiked) {
                                await redis.sadd(key, String(userId));
                            } else {
                                await redis.srem(key, String(userId));
                            }

                            ws.publish(jamId, {
                                type: "toggle-like",
                                data: {
                                    ytLink: cleanLink,
                                    userId: String(userId),
                                    isLiked: message.data.isLiked
                                }
                            });
                            break;
                        }

                        case "remove-music": {
                            const cleanLink = normalizeLink(message.data.ytLink);
                            
                            const exists = await redis.hexists(`jam:${jamId}:songs`, cleanLink);
                            if (!exists) return;

                            await redis.hdel(`jam:${jamId}:songs`, cleanLink);
                            await redis.del(`jam:${jamId}:likes:${cleanLink}`);

                            ws.publish(jamId, {
                                type: "remove-music",
                                data: { ytLink: cleanLink }
                            });
                            break;
                        }
                    }
                },
            })
    );