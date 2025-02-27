import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    calendarId?: string;
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
            "openid email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar ",
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
      // Fetch the user's Calendar ID
      if (token.accessToken) {
        try {
          const calendarId = await fetchUserPrimaryCalendar(
            account?.access_token as string,
          );
          token.calendarId = calendarId;
        } catch (error) {
          console.error("Error fetching calendar ID:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.idToken = token.idToken as string;
        session.refreshToken = token.refreshToken as string;
        session.expiresAt = token.expiresAt as number;
        session.calendarId = token.calendarId as string; // Store the calendar ID in session
      }
      return session;
    },
  },
});

// 🔹 Function to Fetch Primary Calendar ID
async function fetchUserPrimaryCalendar(accessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const data = await response.json();
  console.log(data.error.errors);
  if (!response.ok) throw new Error("Failed to fetch calendar ID");

  // Extract the primary calendar ID (Google returns "primary" as default)
  const primaryCalendar = data.items.find((cal: any) => cal.primary);
  console.log(primaryCalendar);
  return primaryCalendar?.id || "primary";
}
