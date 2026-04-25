import type { Metadata } from "next";
import "./globals.css";
import { LogProvider } from "@/context/LogContext";

export const metadata: Metadata = {
  title: "AI Security Forensics Dashboard",
  description: "Local Log Analysis & Threat Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LogProvider>
          {children}
        </LogProvider>
      </body>
    </html>
  );
}
