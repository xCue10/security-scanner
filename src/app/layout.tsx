import type { Metadata } from "next";
import "./globals.css";
import { LogProvider } from "@/context/LogContext";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Vanguard Security Suite",
  description: "Enterprise Forensic Operations & Threat Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
          <LogProvider>
            {children}
          </LogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
