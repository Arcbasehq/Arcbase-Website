import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { ResendOTP } from "./ResendOTP";

const providers: any[] = [Password({ verify: ResendOTP })];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
} else {
  console.warn(
    "Skipping Google provider: AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET not set.",
  );
}

let _authInit: any;
try {
  _authInit = convexAuth({
    providers,
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
        let wwwBaseUrl = baseUrl;
        const m = baseUrl.match(/^(https?:\/\/)(?:www\.)?([^/]+)(?:\/.*)?$/i);
        if (m) {
          wwwBaseUrl = `${m[1]}www.${m[2]}`;
        }

        if (redirectTo.startsWith("?") || redirectTo.startsWith("/")) {
          return `${baseUrl}${redirectTo}`;
        }
        if (
          redirectTo.startsWith(baseUrl) ||
          redirectTo.startsWith(wwwBaseUrl)
        ) {
          return redirectTo;
        }
        throw new Error(`Invalid redirect: ${redirectTo}`);
      },
    },
  });
} catch (e) {
  console.error("convexAuth initialization failed:", e);
  _authInit = {
    auth: undefined,
    signIn: async () => {
      throw new Error("Auth not initialized");
    },
    signOut: async () => {
      throw new Error("Auth not initialized");
    },
    store: undefined,
  };
}

export const { auth, signIn, signOut, store } = _authInit;
