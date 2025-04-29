import { PrivateLayout } from "../../components/Layouts/private-layout";
import { Toaster } from "@/components/ui/toaster";

export default function PrivateSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateLayout>
      {children}
      <Toaster />
    </PrivateLayout>
  );
}
