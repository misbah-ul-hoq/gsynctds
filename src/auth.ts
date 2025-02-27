import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar ",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.idToken = token.idToken as string;
        session.refreshToken = token.refreshToken as string;
        session.expiresAt = token.expiresAt as number;
      }
      return session;
    },
  },
});
