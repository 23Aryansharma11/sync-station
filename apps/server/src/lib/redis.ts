import Redis from "ioredis";
import { env } from "@sync-station/env/server"; 

export const redis = new Redis(env.REDIS_URL); 

redis.on("error", (err) => console.error("Redis Client Error", err));