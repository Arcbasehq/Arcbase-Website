import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { ResendOTP } from "./ResendOTP";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({ verify: ResendOTP }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async redirect({ redirectTo }) {
      if (
        typeof redirectTo === "string" &&
        redirectTo.includes(".vercel.app/")
      ) {
        return redirectTo;
      }

      const siteEnv =
        process.env.SITE_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : undefined);

      if (!siteEnv) {
        if (!redirectTo || redirectTo === "/") return "/";
        if (
          redirectTo.startsWith("http://") ||
          redirectTo.startsWith("https://") ||
          redirectTo.startsWith("?") ||
          redirectTo.startsWith("/")
        ) {
          return redirectTo;
        }
        console.warn(
          `No SITE_URL configured; rejecting redirectTo=${redirectTo}`,
        );
        return "/";
      }

      const baseUrl = siteEnv.replace(/\/$/, "");
      const wwwBaseUrl = baseUrl.replace("https://", "https://www.");

      if (redirectTo.startsWith("?") || redirectTo.startsWith("/")) {
        return `${baseUrl}${redirectTo}`;
      }
      if (redirectTo.startsWith(baseUrl) || redirectTo.startsWith(wwwBaseUrl)) {
        return redirectTo;
      }
      throw new Error(`Invalid redirect: ${redirectTo}`);
    },
  },
});
