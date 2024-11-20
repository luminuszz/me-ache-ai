import { db } from "@/database/db";
import { env } from "@/lib/env";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub({ clientId: env.AUTH_GITHUB_ID, clientSecret: env.AUTH_GITHUB_SECRET })],
});
