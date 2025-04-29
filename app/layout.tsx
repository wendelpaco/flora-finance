import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flora Finance | Seu controle financeiro inteligente no WhatsApp",
  description:
    "Organize seus ganhos e gastos de forma simples e intuitiva usando o WhatsApp. Controle financeiro moderno, rápido e integrado, com a Flora Finance.",
  openGraph: {
    title: "Flora Finance | Controle financeiro via WhatsApp",
    description:
      "Gerencie suas finanças com praticidade. Acompanhe saldos, transações e metas diretamente pelo WhatsApp com Flora Finance.",
    url: "https://seusite.com.br",
    siteName: "Flora Finance",
    images: [
      {
        url: "https://seusite.com.br/og-image-flora.jpg",
        width: 1200,
        height: 630,
        alt: "Flora Finance - Controle financeiro via WhatsApp",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flora Finance | Seu controle financeiro via WhatsApp",
    description:
      "Domine suas finanças pessoais diretamente no WhatsApp. Simples, rápido e inteligente com Flora Finance!",
    images: ["https://seusite.com.br/og-image-flora.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
