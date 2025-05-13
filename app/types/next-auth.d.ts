import { DefaultSession } from "next-auth";

// 1. Extende a sessão para incluir `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
  }
}
