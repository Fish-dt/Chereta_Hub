import "./globals.css";
import { Inter } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <title>CheretaHub</title>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ClientProviders>
          <div className="flex-1 flex flex-col">{children}</div>
        </ClientProviders>
      </body>
    </html>
  );
}
