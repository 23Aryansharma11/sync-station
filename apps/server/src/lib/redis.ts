import Redis from "ioredis";
import { env } from "@sync-station/env/server"; // Assuming you have env handling

// The URL usually looks like: redis://default:password@fly-us-east-1.upstash.io:port
export const redis = new Redis(env.REDIS_URL); 

redis.on("error", (err) => console.error("Redis Client Error", err));