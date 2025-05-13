import { Session } from "next-auth";
import { VisaoGeralPageClient } from "./components/visao-geral-page-client";
import { withAuth } from "@/lib/withAuth";

function VisaoGeralPage({ session }: { session: Session }) {
  return <VisaoGeralPageClient user={session?.user} />;
}

export default withAuth(VisaoGeralPage);
