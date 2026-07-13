const { createAuthClient } = require("better-auth/react");
const { magicLinkClient } = require("better-auth/client/plugins");

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [magicLinkClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
