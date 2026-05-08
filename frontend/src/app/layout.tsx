import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://crm-self-one.vercel.app"),
  title: "CRM SaaS",
  description: "Modern CRM system built with Next.js and FastAPI",
  openGraph: {
    title: "CRM SaaS",
    description: "Modern CRM system built with Next.js and FastAPI",
    url: "https://crm-self-one.vercel.app",
    siteName: "CRM SaaS",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "CRM SaaS Preview",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 dark:bg-slate-950">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
