import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "@sync-station/env/server";
import { redis } from "@/lib/redis"; // <--- Import your client

const SocketSchema = t.Union([
    t.Object({
        type: t.Literal("join"),
        data: t.Object({ joineeId: t.String(), username: t.String(), avatar: t.String() })
    }),
    t.Object({
        type: t.Literal("add-music"),
        data: t.Object({ ytLink: t.String(), name: t.String(), avatar: t.String() })
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
                likedBy: t.Array(t.String())
            }))
        })
    }),
    t.Object({
        type: t.Literal("remove-music"),
        data: t.Object({
            ytLink: t.String()
        })
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
                return { user: profile };
            })

            .ws("/", {
                body: SocketSchema,
                response: SocketSchema,

                async open(ws) {
                    const { jamId } = ws.data.params;
                    const { sub: userId, name, avatar } = ws.data.user;

                    if (!userId) return;
                    ws.subscribe(jamId);

                    const songsMap = await redis.hgetall(`jam:${jamId}:songs`);
                    const queue = [];

                    for (const [ytLink, metadataJson] of Object.entries(songsMap)) {
                        const metadata = JSON.parse(String(metadataJson || ""));
                        const likedBy = await redis.smembers(`jam:${jamId}:likes:${ytLink}`);

                        queue.push({
                            ...metadata,
                            ytLink,
                            likes: likedBy.length,
                            likedBy: likedBy
                        });
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
                        case "add-music":
                            const exists = await redis.hexists(`jam:${jamId}:songs`, message.data.ytLink);
                            if (exists) return;

                            await redis.hset(`jam:${jamId}:songs`, message.data.ytLink, JSON.stringify({
                                name: String(name),
                                avatar: String(avatar),
                                addedAt: Date.now()
                            }));

                            ws.publish(jamId, {
                                type: "add-music",
                                data: {
                                    ytLink: message.data.ytLink,
                                    name: String(name),
                                    avatar: String(avatar)
                                }
                            });
                            break;

                        case "toggle-like":
                            const key = `jam:${jamId}:likes:${message.data.ytLink}`;

                            if (message.data.isLiked) {
                                await redis.sadd(key, String(userId));
                            } else {
                                await redis.srem(key, String(userId));
                            }

                            ws.publish(jamId, {
                                type: "toggle-like",
                                data: {
                                    ytLink: message.data.ytLink,
                                    userId: String(userId),
                                    isLiked: message.data.isLiked
                                }
                            });
                            break;

                        case "remove-music":

                            const linkToRemove = message.data.ytLink;

                            await redis.hdel(`jam:${jamId}:songs`, linkToRemove);
                            await redis.del(`jam:${jamId}:likes:${linkToRemove}`);

                            ws.publish(jamId, {
                                type: "remove-music",
                                data: { ytLink: linkToRemove }
                            });
                            break;
                    }
                },
            })
    );