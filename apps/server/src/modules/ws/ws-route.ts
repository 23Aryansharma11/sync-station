import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "@sync-station/env/server";

const SocketSchema = t.Union([
    t.Object({
        type: t.Literal("join"),
        data: t.Object({
            jamId: t.String(),
            id: t.String()
        })
    }),
    t.Object({
        type: t.Literal("music"),
        data: t.Object({
            jamId: t.String(),
            musicId: t.String(),
            userId: t.String()
        })
    }),
]);

export const wsRoutes = new Elysia()
    .use(jwt({ name: "jwt", secret: env.JWT_SECRET }))
    .group("/ws/jam/:jamId", (app) =>
        app
            // 1. GUARD: Define Schema globally for this group
            // This tells TS that jamJoinToken is a required string
            .guard({
                cookie: t.Object({
                    jamJoinToken: t.String()
                })
            })

            // 2. DERIVE: Now TS knows jamJoinToken exists and is a string
            .derive(async ({ params: { jamId }, cookie: { jamJoinToken }, jwt }) => {
                // No need to check if(!jamJoinToken) - the Guard handles it (returns 422 if missing)

                const profile = await jwt.verify(jamJoinToken.value);

                if (!profile) throw new Error("Invalid Token");
                if (profile.jamId !== jamId) throw new Error("Room mismatch");

                return {
                    user: profile
                };
            })

            .ws("/", {
                body: SocketSchema,
                response: SocketSchema,
                open(ws) {
                    const { jamId } = ws.data.params;
                    const { sub: userId, name } = ws.data.user;
                    ws.subscribe(jamId)
                    console.log(`${name} joined ${jamId}`);
                    ws.publish(jamId, {
                        type: "join",
                        data: {
                            jamId, id: userId
                        }
                    })
                },
                async message(ws, message) {
                    const { jamId } = ws.data.params;
                    const { sub: userId, name } = ws.data.user;

                    switch (message.type) {
                        case "music":
                            // ws.publish(jamId, {
                            //     type: "music",
                            //     data: {
                            //         jamId,
                            //         musicId,
                            //         userId: id
                            //     }
                            // })
                            break;
                    }
                },
                close(ws) {
                    const { jamId } = ws.data.params;
                    console.log(`User left room: ${jamId}`);
                    // Auto-unsubscribe happens automatically on close
                }
            })
    );