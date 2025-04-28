import { PrivateLayout } from "../../components/Layouts/private-layout";

export default function PrivateSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateLayout>{children}</PrivateLayout>;
}
