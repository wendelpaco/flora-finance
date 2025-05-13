import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "WhatsApp",
      credentials: {
        phone: { label: "Telefone", type: "text" },
        authId: { label: "AuthId", type: "text" },
      },
      async authorize(credentials) {
        // Chama apenas o endpoint de status, que retorna status e user
        const statusRes = await fetch(
          `${process.env.NEXT_PUBLIC_WHATSAPP_URL_BOT}/api/auth/whatsapp/status/${credentials?.authId}`,
          { method: "GET" }
        );
        if (!statusRes.ok) return null;
        const result = await statusRes.json();
        if (result.status !== "CONFIRMED" || !result.user) return null;

        // Ensure email is always a string, using empty string as fallback
        return {
          id: String(result.user.id),
          name: result.user.name ? String(result.user.name) : "",
          email: result.user.email ? String(result.user.email) : "",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.name = typeof token.name === "string" ? token.name : "";
        if (token.email) session.user.email = token.email;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};
