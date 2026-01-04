import { env } from "@sync-station/env/web";
import { createAuthClient } from "better-auth/react";
import type { Session, User } from "better-auth"

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
});

export type AuthContext = {
  session: Session,
  user: User
} | null