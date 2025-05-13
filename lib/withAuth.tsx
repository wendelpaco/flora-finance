import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./authOptions";
import { Session } from "next-auth";

export function withAuth(
  Component: (props: { session: Session }) => React.ReactElement
) {
  return async function ProtectedPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect("/");
      return null; // nunca chega aqui, mas para TS ficar feliz
    }

    return <Component session={session} />;
  };
}
